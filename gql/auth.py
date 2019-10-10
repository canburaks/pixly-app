import django.contrib.auth 
from django.contrib.auth import get_user_model 
from django.contrib.auth.models import User 
from django_mysql.models import JSONField
from graphene_django.types import DjangoObjectType
from graphene_django.converter import convert_django_field
from django.core.cache import cache
from django.core.exceptions import ValidationError
import graphene
import graphql_jwt
from graphql_jwt.decorators import login_required
from django.views.decorators.csrf import csrf_exempt
#from background_task import background
from django.contrib.sitemaps import ping_google
from djaws import cognito
from django.contrib.auth import authenticate, login, user_logged_in
from django.contrib.auth import logout
from persons.profile import LogEntry
from gql.types import (VideoType, MovieType, ProfileType, PersonType,
        DirectorType, TopicType, ListType, UserType, RatingType)
from persons.profile import LogEntry


@convert_django_field.register(JSONField)
def convert_json_field_to_string(field, registry=None):
    return graphene.String()

debug = True
def trace(text, *args, **kwargs):
    if debug:
        print(text, *args, **kwargs)

# PASSWORD CHANGE AUTH USER
class ChangePassword(graphene.Mutation):
    user = graphene.Field(UserType)
    message = graphene.String()
    status = graphene.Boolean()
    class Arguments:
        username = graphene.String(required=True)
        old_password = graphene.String(required=True)
        new_password = graphene.String(required=True)

    @classmethod
    def mutate(cls, root, info, username, old_password, new_password):
        trace("----------CHANGE PASSWORD---------------------\n")
        context_user = info.context.user
        user = User.objects.get(username=username)
        if context_user != user:
            print('User credentials were not match with requested User')
            return cls(user=context_user, message='User credentials were not match with requested User', status=False)
        
        #check old password
        old_check = user.check_password(old_password)
        if not old_check:
            print('Old Password is incorrect')
            return cls(user=context_user, message='Old Password is incorrect', status=False)
        
        #check new passwrod
        if not DBCheck.password_validation(new_password):
            return cls(user=context_user,
                message='New Password mut be at least 8 characters and includes 1 Uppercase and 1 lowercase. ', status=False)
        
        #finally change password
        user.set_password(new_password)
        trace("new password setted")
        user.save()
        if user.profile.should_change_password:
            user.profile.should_change_password = False
            user.profile.save()
        return cls(user=context_user, message='Succesfull', status=True)


class CreateUser(graphene.Mutation):
    user = graphene.Field(UserType)
    message = graphene.String()
    class Arguments:
        username = graphene.String(required=True)
        password = graphene.String(required=True)
        email = graphene.String(required=True)
        name = graphene.String(required=True)

    @classmethod
    def mutate(cls, root, info, username, password, email, name):
        if User.objects.filter(username__iexact=username).exists():
            raise ValidationError('This username has already been taken!')
        if User.objects.filter(email__iexact=email).exists():
            raise ValidationError('This email has already been registered!')
        if DBCheck.password_validation(password)==False:
            raise ValidationError('Invalid password!')

        #------- Cognito Check-------------------------------
        cognito_userlist = cognito.get_user_list()
        #filter cognito_users with username
        user_cognito_account = list(filter(lambda x: x.username==username, cognito_userlist))
        if (user_cognito_account):
            raise ValidationError('This username has already been taken!')

        trace("----------DATABASE SIGNUP---------------------")

        user = get_user_model()(
            username=username.lower(),
            email=email,
        )


        user.set_password(password)
        user.save()
        profile = user.profile
        profile.name = name
        profile.email = email
        profile.save()
        trace(f"user with {username} was created. ")

        #------------COGNITO REGISTER-----------------
        #register
        trace(f"{username} is registering on Cognito. ")
        response  = cognito.register(
                    username, user.email, user.profile.name, password)

        #if error
        if isinstance(response, str):
            profile.cognito_status = response
            trace("Registration Error: ", response)
            profile.save()
        
        #if success
        if response==True:
            profile.cognito_registered = True
            profile.cognito_status = f"Verification Email was sent to ${profile.username}"
            profile.save()
            trace("Registration Completed: ", response)
            


        # CREATE LOG ENTRY
        ip = info.context.META.get('REMOTE_ADDR')
        LogEntry.objects.create(action='user_created_in', ip=ip, username=info.context.user.username)
        #token_auth = graphql_jwt.ObtainJSONWebToken.Field()
        #token = graphql_jwt.shortcuts.get_token(user)
        trace("------------------------------------------------- \n")
        return cls(user=user, message="Successfull")


class Login(graphene.Mutation):
    user = graphene.Field(UserType)
    class Arguments:
        username = graphene.String(required=True)
        password = graphene.String(required=True)
    
    @classmethod
    def mutate(cls, root, info, username, password,  **kwargs):
        #print({"username":username, "password":password})

        #--------- DB Check---------------------------------
        user = DBCheck.username_and_password(username, password)
        if user==False:
            trace("Database Check Error! Invalid username or password")
            raise ValidationError("Invalid username or password")
            return None
        # check if password is  valid ---> 8-UP-low
        if DBCheck.password_validation(password)!=True:
            user.profile.should_change_password = True
            user.profile.save()
        
        trace("Username and password is matched with database.")
        profile = user.profile
        

        #----------COGNITO REGISTER CHECK---------------------
        trace("----------COGNITO REGISTER CHECK---------------------")
        cognito_userlist = cognito.get_user_list()
        trace("Cognito User List: ",cognito_userlist)

        #filter cognito_users with username
        user_cognito_account = list(filter(lambda x: x.username==username, cognito_userlist))
        trace("user_cognito_account", user_cognito_account)

        # IF Not registered on Cognito (DB check)
        if not user.profile.cognito_registered:
            trace(f"{username} is not registered to Cognito. (profile property value)")

            userlist = cognito.get_username_list()

            #IF  user is  in Cognito Users but not profile.cognito_registered (AWS check)
            if user_cognito_account:
                profile.cognito_registered = True
                profile.cognito_verified = user_cognito_account[0].email_verified
                profile.save()
                trace(f"{username} registration status was false "
                        "but its username is in Cognito userlist. \n"
                        "Current User registration status True.\n"
                        f"Current User verification status {profile.cognito_verified} (remote value)")

            #IF  username is not in Cognito Users (AWS check)
            if not user_cognito_account:
                trace(f"{username} is not in the Cognito Users List (remote value)")

                #register
                trace("username is registering...")
                response  = cognito.register(
                            username, user.email, user.profile.name, password)

                #if error
                if isinstance(response, str):
                    profile.cognito_status = response
                    trace("Registration Error: ", response)
                    profile.save()
                
                #if success
                if response==True:
                    profile.cognito_registered = True
                    profile.cognito_status = f"Verification Email was sent to ${profile.username}"
                    profile.save()
                    trace("Registration Completed: ", response)
                    
                    #Get newly registered user's cognito account
                    cognito_userlist = cognito.get_user_list()
                    user_cognito_account = list(filter(lambda x: x.username==username, cognito_userlist))
        trace("------------------------------------------------- \n")
        #-------------------------------------------------------------


        #----------COGNITO VERIFICATION CHECK---------------------
        if profile.cognito_verified==False:

            trace("----------COGNITO VERIFICATION CHECK---------------------")
            trace(f"{username} cognito verification status: False")
            #check again if user's cognito account exists
            if user_cognito_account:
                trace("Corresponding cognito account found. Will be checked for verification status.")
                profile.cognito_verified = user_cognito_account[0].email_verified
                trace(f"Current Verification status: {profile.cognito_verified}")
            
            trace("------------------------------------------------- \n")
        #-------------------------------------------------------------


        # -----------AUTHENTICATE COGNITO-----------------------------
        # Authenticate if user is verified
        if profile.cognito_verified ==True:

            trace("-----------COGNITO AUTHENTICATION----------------")
            trace("Authenticating to Cognito...")

            cognito_auth_user = cognito.auth(username, password)

            # if authenticated to cognito
            if cognito_auth_user and isinstance(cognito_auth_user.__class__, type):
                trace("Cognito Authentication Completed.")
                token_dict = {
                            "id_token": cognito_auth_user.id_token,
                            "refresh_token": cognito_auth_user.refresh_token,
                            "access_token": cognito_auth_user.access_token}
                profile.cognito_tokens = token_dict
                trace("Cognito tokens were saved.")
                profile.save()

            #if not authenticated to cognito
            elif cognito_auth_user == False:
                
                old_status = profile.cognito_status if profile.cognito_status else ""
                profile.cognito_status = (old_status + 
                        "\n Added Notes: Cognito Authentication Error!" + 
                        "Check username and password again ")
                trace(f"Authentication Error. Check {username} cognito_status")
                profile.save()
            trace("------------------------------------------------- \n")

        #--------------------------------------------------------------

        # ------------AUTHENTICATE DATABASE----------------------------
        trace("------------DATABASE AUTHENTICATION---------------------")
        token = DBCheck.get_token(root, info, username, password)
        if token:
            trace("Database Authentication completed. JWT acquired.")
            trace("---Successfully Logged in----")
            #response = ObtainJSONWebToken.resolve(root, info)
            return cls(user=user)
        else:
            trace(f"Authentication Error. Could not complete JWT request.")
            return None
        trace("------------------------------------------------- \n")


class Logout(graphene.Mutation):
    user = graphene.Field(UserType)
    message = graphene.String()
    def mutate(self, info):
        if info.context.user.is_authenticated:
            user = info.context.user
            profile = user.profile

            #if verified user logout from cognito
            """
            if (profile.cognito_registered and profile.cognito_verified):
                print(profile.cognito_tokens)
                user_cognito_client = cognito.auth_user_client(
                    profile.cognito_tokens.get("id_token"),
                    profile.cognito_tokens.get("refresh_token"),
                    profile.cognito_tokens.get("access_token"))

                #logout from cognito
                user_cognito_client.logout()
                trace(f"{user.username} logged out from cognito")
                #clear profile tokens
                set_profile_tokens(user_cognito_client, profile)
                trace(f"{user.username} cognito tokens were cleared")
            """


            # CREATE LOGOUT ENTRY
            ip = info.context.META.get('REMOTE_ADDR')
            LogEntry.objects.create(action='user_logged_out', ip=ip, username=info.context.user.username)
            #print(LogEntry.objects.all().last())
            
            # logout from db
            logout(info.context)
        
        return Logout(message="Successfully logged out.")



class ResendRegisterationMail(graphene.Mutation):
    user = graphene.Field(UserType)
    message = graphene.String()
    status = graphene.Boolean()
    class Arguments:
        username = graphene.String(required=True)

    @classmethod
    def mutate(cls, root, info, username):
        trace("----------RESEND REGISTRATION MAIL---------------------\n")
        context_user = info.context.user
        user = User.objects.get(username=username)
        if context_user != user:
            print('User credentials were not match with requested User')
            return cls(user=context_user, message='User credentials were not match with requested User')
        if not user.is_authenticated:
            print('Authentication credentials were not provided')
            return cls(user=context_user, message='Authentication credentials were not provided')


        # CHECK
        checked_status = CheckVerification( username )

        trace(f"{username} Checked Status: ", checked_status)
        if checked_status != True:
            user = User.objects.get(username=username)

            # send with boto client
            response = cognito.resend_verification_email(username)
            trace("Resending registration mail response: ", response )
            if response == True:
                trace("Successfully Sent")
                trace("------------------------------------------------- \n")
                return cls(user=user, message="Successfully Sent.")
            else:
                trace("Resend Registration Mail Error.")
                trace("------------------------------------------------- \n")
                return cls(user=user, message="Resend Fail..")

        #if already verified
        elif checked_status == True:
            trace(f"{username} already verified its mail adress.")
            trace("------------------------------------------------- \n")
            return cls(user=user, message="Already Verified. Didn't Send.")


class CheckVerificationMutation(graphene.Mutation):
    status = graphene.Boolean()
    class Arguments:
        username = graphene.String(required=True)
    
    @classmethod
    def mutate(cls, root, info, username):
        trace("CheckVerificationMutation", username)
        status = CheckVerification(username)
        trace("status", status)
        return cls(status=status)


class ForgetPassword(graphene.Mutation):
    message = graphene.String()
    status = graphene.Boolean()
    class Arguments:
        username = graphene.String(required=True)
    
    @classmethod
    def mutate(cls, root, info, username):
        trace("ForgetPassword", username)
        status = cognito.send_forget_password(username)
        trace("status", status)

        if status == True:
            return cls(status=status, message="Please Check Your mailbox")

        return cls(status=status, message="Check your username again or please try again later.")




# PASSWORD CHANGE ANONYMOUS USER
class ChangeForgetPassword(graphene.Mutation):
    user = graphene.Field(UserType)
    message = graphene.String()
    status = graphene.Boolean()
    class Arguments:
        username = graphene.String(required=True)
        verification_code = graphene.String(required=True)
        new_password = graphene.String(required=True)

    @classmethod
    def mutate(cls, root, info, username, verification_code, new_password):
        trace("----------CHANGE FORGETTEN PASSWORD---------------------\n")


        #PASSWORD VALIDITY
        is_new_password_valid = DBCheck.password_validation( new_password )
        if not is_new_password_valid:
            return cls(status=False, message="Invalid Password. Password must be minimum 8 "
                    "characters and include both uppercase and lowercase")
        trace("- New Password is valid.")

        #COGNITO CHECK
        cognito_response = cognito.confirm_forget_password(username, verification_code, new_password)
        if cognito_response == False:
            trace(f"Forget Password Validation Error!! {username} ")
            return cls(status=False, message="Invalid Verification Code. Please Try again later.")

        if cognito_response == True:
            trace(f"{username} has verified  forget password code.")

            #CHANGE LOCAL PASSWORD
            user = User.objects.get(username=username)
            user.set_password(new_password)
            trace("new password setted")
            user.save()


        #CHECK IF EXISTING 'SHOULD PROFILE CHANGE PASSWORD' 
        if user.profile.should_change_password:
            user.profile.should_change_password = False
            user.profile.save()

        return cls(user=user, message='Password successfully changed.', status=True)



class DBCheck:
    def username(username):
        try:
            user = User.objects.get(username__iexact=username)
            return True
        except:
            return False

    def email(email):
        try:
            user = User.objects.get(email__iexact=email)
            return True
        except:
            return False

    def username_and_password(username, password):
        try:
            user = User.objects.get(username=username)
            if user.check_password(password):
                return user
            return False
        except:
            return False

    def get_token(root, info, username, password):
        try:
            response = graphql_jwt.ObtainJSONWebToken.Field().resolver(
                            root, info,username=username, password=password)
            #print("get_token", info, info.context, info.context.user)
            return response.token
        except:
            print("Please, enter valid credentials. (DBCheck.get_token)")
            return None

    def password_validation( password ):
        #if all lower
        if password == password.lower():
            print("There is no UPPER character.")
            return False
        if password == password.upper():
            print("There is no LOWER character.")
            return False
        if len(password) < 8:
            print("Less than 8 character.")
            return False
        digits = [i for i in password if i.isdigit()]
        if len(digits)<1:
            print("There is no NUMERIC caracter")
            return False
        return True


def set_profile_tokens(cognito_user_obj, profile):
    token_dict = {
            "id_token": cognito_user_obj.id_token,
            "refresh_token": cognito_user_obj.refresh_token,
            "access_token": cognito_user_obj.access_token}
    profile.cognito_tokens = token_dict
    profile.save()
    print("profile tokens", profile.cognito_tokens)


def CheckVerification( username ):
    # COGNITO verification status Check
    trace("----------VERIFICATION FUNCTION---------------------\n")
    
    user = User.objects.get(username=username)
    profile = user.profile

    #FIRST CHECK DATABASE  - if profile.cognito_Verified is True
    if profile.cognito_verified == True:
        # (assumes AWS status also True)
        trace(f"{username} already verified its account.(property value) Terminating process.")
        trace("------------------------------------------------- \n")
        return True


    cognito_userlist = cognito.get_user_list()
    user_cognito_account = list(filter(lambda x: x.username==username, cognito_userlist))
    trace("Corresponding cognito account ->", user_cognito_account)

    #CHECK AWS -  user cognito account 
    if user_cognito_account:
        verification_status = user_cognito_account[0].email_verified

        #if AWS status is False
        if verification_status == False:
            trace(f"{username} cognito verification status: {verification_status}")
            trace("------------------------------------------------- \n")
            return False

        #If profile.cognito_Verified is False but AWS Cognito status is True
        elif verification_status==True and profile.cognito_verified == False:
            profile.cognito_verified = True
            profile.save()
            trace(f"{username} already verified its account (AWS value)."
                    "{username} cognito verification property is changed to True.")
            trace("------------------------------------------------- \n")
            return True
    trace(f"{username} has no corresponding Cognito Account.")
    trace(" ------------------------------------------------- \n ")
    return False
