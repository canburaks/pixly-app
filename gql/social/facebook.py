from persons.profile import Profile, Follow
from items.models import Movie, List,  Video, Rating, Topic, Article
from persons.models import Director, Person
from persons.profile import Profile, Social

from django.contrib.auth import get_user_model
from django.contrib.auth.models import User
from django_mysql.models import JSONField
from django.contrib.auth import authenticate

from graphene_django.types import DjangoObjectType
from graphene_django.converter import convert_django_field
import json
import graphene
import graphql_jwt
from pprint import pprint
from graphene_file_upload.scalars import Upload
from pprint import pprint
from gql.auth import DBCheck, Login
from gql.cognito import CognitoClass
from gql.types import (VideoType, MovieType, ProfileType, PersonType,CustomListType,
        DirectorType, TopicType, ListType, UserType, RatingType)
from pixly.lib import to_english_chars, remove_punctuations, is_email_registered
    

def is_social_account_exist(email):
    return Social.objects.filter(email=email).exists()

class FacebookBackend:
    def authenticate(self, request,email, token=None):
        print("req", request)
        fb_account = Social.get_with_facebook_email(email)
        print("fb backend:", fb_account)
        if fb_account:
            return fb_account.profile.user




class FacebookAuthentication(graphene.Mutation):
    user = graphene.Field(UserType)
    success = graphene.Boolean()
    status = graphene.String()
    message = graphene.String()
    form = graphene.types.json.JSONString()
    
    login = graphene.Field(Login)



    class Arguments:
        data = graphene.String(required=True)

    @staticmethod
    def resolve_login(root: None, info: graphene.ResolveInfo):
        print("info", info, info.context.user)
        return Login()

    def mutate(root,info,data):
        fb_data = json.loads(data)
        #print("fb_data",fb_data)
        fb_profile = fb_data.get("profile")
        fb_email = fb_data.get("profile").get("email")

        #pprint(fb_data.get("profile"))

        #check missing data
        if fb_data.get("tokenDetail")==None or fb_profile==None:
            return FacebookAuthentication(user=None, success=False, 
                status = "error: missing facebook data",
                message = "profile or token details are missing")

        #check if email is paired and user connected before
        is_social_exist = Social.check_with_facebook_email(fb_email)
        #print("is social account exists?", is_social_exist)

        # CASE: Login
        if is_social_exist:
            social_account = Social.get_with_facebook_email(fb_email)
            profile = social_account.profile
            ##print("profile_token",profile_token)

            #check incoming and existing facebook id's same
            is_same_id = fb_profile.get("id") == social_account.facebook_id
            if not is_same_id:
                #print("are incoming and existing facebook id's same? ", is_same_id)
                #print(social_account.facebook_id, fb_profile.get("id"))
                return FacebookAuthentication(user=profile.use, success=False,
                    status = "error: different facebook data ",
                    message = "Did you change your facebook account ? " +
                        "Facebook information you provide doesn't paired with the existing information. " +
                        "Please login with your username and then connect your facebook account in profile settings. " +
                        "After than you will be able to login your account with your facebook.")

            social_account.save_facebook_data(fb_data)

            # print("user and context auth status: ", profile.user.is_authenticated, info.context.user.is_authenticated)
            return FacebookAuthentication(user=profile.user, success=True,
                        message="Success. You are redirecting.",status="login")


        # CASE: Register
        if not is_social_exist:
            # Case I: Email Belongs any Profile
            # if the fb_email belongs to any profile
            # ask them to login with existing account and then connect its fb
            # or if client can not remember password ask to do forget_password
            is_mail_adress_belongs_profile = DBCheck.email(fb_email)
            print(is_mail_adress_belongs_profile)
            if is_mail_adress_belongs_profile:
                return FacebookAuthentication(user=None, success=False, form=form, message= \
                "Your facebook mail adress belongs to an existing user. " +
                "Please login with corresponding username and after than " +
                "Connect your facebook account in profile settings. " +
                "After than you will be able to login your account with your facebook. ")

            # Cognito username check (Look Later for removal of the cognito accounts)
            is_username_exists_on_cognito = CognitoClass.is_username_registered(fb_profile.get("username"))
            print(is_username_exists_on_cognito)
            if is_username_exists_on_cognito:
                return FacebookAuthentication(user=None, success=False, form=form, message= \
                "Your facebook mail adress belongs to an existing user. " +
                "Please login with corresponding username and after than " +
                "Connect your facebook account in profile settings. " +
                "After than you will be able to login your account with your facebook. ")

            # Case II Sign up
            # if fb_email does not belongs to any user and profile
            # Send proper info to client in order to create new user mutation
            if not is_mail_adress_belongs_profile:
                print("in")
                fb_name = fb_profile.get("name")
                form = {"email":fb_email, "name":fb_name, }

                #check and suggest proper username
                name_lower_eng_chars = to_english_chars(fb_name).casefold()
                name_no_punc = remove_punctuations(name_lower_eng_chars)
                name_splitted = name_no_punc.strip().split(" ")

                # try underline/s or hyphen
                for joiner in ["_", "__", "-"]:
                    username_draft = joiner.join(name_splitted)
                    is_username_exists = DBCheck.username(username_draft)
                    if not is_username_exists:
                        form["username"] = joiner.join(name_splitted)
                        print("form successfully sent.")
                        return FacebookAuthentication(user=None, success=True,
                                message="You are redirecting to finish your registration",
                                status="register", form=form)

                # try numbers
                for suffix in ["_", "_0", "_01" ]:
                    username_draft = "_".join(name_splitted) + suffix
                    is_username_exists = DBCheck.username(username_draft)
                    if DBCheck.username(username_draft):
                        form["username"] = username_draft
                        print("form successfully sent.")
                        return FacebookAuthentication(user=None, success=True,
                                message="You are redirecting to finish your registration",
                                status="register", form=form)

            else:
                print("3")
                return FacebookAuthentication(user=None, success=False, form=None,
                        messsage="We are not processing your request. Please try later.",
                        status="Unknown error in FacebookAuthentication." + 
                        "(Probably in suggesting valid username)")








#for authenticated users only
class FacebookConnect(graphene.Mutation):
    user = graphene.Field(UserType)
    success = graphene.Boolean()
    message = graphene.String()
    status = graphene.String()

    class Arguments:
        data = graphene.String(required=True)

    def mutate(self,info,data):
        print("facebook mutation:", data)
        if info.context.user.is_authenticated:
            user = info.context.user
            social_account = user.profile.get_or_create_social_account()
            social_account.save_facebook_data(data)
            #fb_data = json.loads(data)
            return FacebookConnect(user=user, success=True, message="Connected", status="Success" )

        return FacebookConnect(user=None, success=False, status="Not authenticated",
                message="You are not authenticated. Please Login first")

