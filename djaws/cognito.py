from warrant import Cognito
import boto3

#from botocore.errorfactory import UsernameExistsException, InvalidPasswordException
import environ
env = environ.Env()
environ.Env.read_env()

AWS_ACCESS_KEY_ID = env('AWS_KEY')
AWS_SECRET_ACCESS_KEY = env('AWS_SECRET_KEY')
AWS_DEFAULT_REGION = env('AWS_DEFAULT_REGION')

pool_id=env("COGNITO_USER_POOL_ID")
client_id=env("COGNITO_CLIENT_ID")

#print(pool_id, client_id)
#u = Cognito(pool_id, client_id)
#u = Cognito('eu-west-2_Qb43s0inU','6dcpm9fb4i8n1hdci0uqp1faob')
"""
pool_id='eu-west-2_Qb43s0inU'
client_id="6dcpm9fb4i8n1hdci0uqp1faob"
"""
    
#----------------------------------------------------------
#--------------- BOTO----------------------------------
boto_client = boto3.client('cognito-idp',
    aws_access_key_id=AWS_ACCESS_KEY_ID,
    aws_secret_access_key=AWS_SECRET_ACCESS_KEY,
    region_name=AWS_DEFAULT_REGION
)


# SEND VERIFICATION EMAIL
def resend_verification_email(username):
    # first get authenticated user client with tokens
    try:
        response = boto_client.resend_confirmation_code(
            ClientId=client_id,
            Username=username
        )
        print("Boto3 successfully re-send verification mail.")
        return True
    except:
        print(f"Boto3 could not re-send verification mail! ")
        return False


#----------------------------------------------------------
#--------------- WARRANT----------------------------------
#   REGISTER
def register(username, email, name, password):
    u = Cognito(pool_id, client_id)
    try:
        u.add_base_attributes(email=email, name=name)
        u.register(username.lower(), password)
        print("Successfully registered. Please check your mail box for activation.")
        return True
    except:
        return "Unknown Error! Check username, password or email."


def confirm_register(username, verification_code):
    u = Cognito(pool_id, client_id)
    try:
        u.confirm_sign_up(verification_code,username=username.lower())
        print("Successfully activated.")
        return True
    except:
        print("Registration Error! invalid verification code.")
#----------------------------------------------------------

# AUTHENTICATION
def auth(username, password):
    u = Cognito(pool_id, client_id, username=username.lower())
    try:
        u.authenticate(password=password)
        print("Successfully authenticated!")
        return u
    except:
        print("Authentication Error! Check username and password again")
        return False

def auth_token_client(username, password):
    auth_client = auth(username.lower(), password)
    u = Cognito(pool_id, client_id,
        id_token=auth_client.id_token,
        refresh_token=auth_client.refresh_token,
        access_token=auth_client.access_token)
    return u

def auth_user_client(id_token, refresh_token, access_token):
    u = Cognito(pool_id, client_id,
        id_token=id_token,
        refresh_token=refresh_token,
        access_token=access_token)
    return u

def logout(auth_token_client):
    try:
        auth_token_client.logout()
        return True
    except:
        return False
        
#----------------------------------------------------------

# FORGET PASSWORD AND PASSWORD CHANGE
def send_forget_password(username):
    try:
        u = Cognito(pool_id, client_id, username=username.lower())
        u.initiate_forgot_password()
        print("Email was sent. Please check your mail box")
        return True
    except:
        return False
def confirm_forget_password(username, verification_code, new_password):
    try:
        u = Cognito(pool_id, client_id, username=username.lower())
        u.confirm_forgot_password(verification_code, new_password)
        print("Your forgotten password was changed ")
        return True
    except:
        print("Verification Code Error (Forget password)! Check your verification code or new password (8chars, UPPERCASE, lowercase).")
        return False

def change_password(username, password, new_password):
    # first get authenticated user client with tokens
    try:
        u = auth(username.lower(), password) 
        response =  u.change_password(password, new_password)
        print("Password was changed")
        return True
    except:
        print("Password Change Error!"
            " Password must have min 8 characters, lowercase and uppercase characters"
        )
        return False
#----------------------------------------------------------


#----------------------------------------------------------

# TOKENS
def check_token(username, password):
    u = auth_token_client(username, password)
    u.check_token()

#-------------------------------------------------------
#   FUNCTIONS
def get_user_list():
    u = Cognito(pool_id, client_id)
    return u.get_users()

def get_username_list():
    user_list =  get_user_list()
    return [x.username for x in user_list]

def get_superuser():
    cbs = Profile.objects.get(username="canburaks")
    tokens = cbs.cognito_tokens
    try:
        u = Cognito(pool_id, client_id,
            id_token=tokens["id_token"],refresh_token=tokens["refresh_token"],
            access_token=tokens["access_token"])
        print("Superuser connected")
        return u
    except:
        print("Superuser Authentication Error!")
        return None

#superuser = get_superuser()

def get_user_obj(username):
    superuser = get_superuser()
    return superuser.get_user_obj(username=username,
            attribute_list=[{'Name': 'email_verified','Value': 'string'}],
            metadata={},
            attr_map={"email_verified":"first_name"}
            )


def get_user(username):
    u = Cognito(pool_id, client_id, username=username)
    return u.get_user(attr_map={"email_verified":"email"})



"""
u.__dir__() --->

['user_pool_id',
 'client_id',
 'user_pool_region',
 'username',
 'id_token',
 'access_token',
 'refresh_token',
 'client_secret',
 'token_type',
 'custom_attributes',
 'base_attributes',
 'client',
 'pool_jwk',
 '__module__',
 'user_class',
 'group_class',
 '__init__',
 'get_keys',
 'get_key',
 'verify_token',
 'get_user_obj',
 'get_group_obj',
 'switch_session',
 'check_token',
 'add_base_attributes',
 'add_custom_attributes',
 'register',
 'admin_confirm_sign_up',
 'confirm_sign_up',
 'admin_authenticate',
 'authenticate',
 'new_password_challenge',
 'logout',
 'admin_update_profile',
 'update_profile',
 'get_user',
 'get_users',
 'admin_get_user',
 'admin_create_user',
 'send_verification',
 'validate_verification',
 'renew_access_token',
 'initiate_forgot_password',
 'delete_user',
 'admin_delete_user',
 'confirm_forgot_password',
 'change_password',
 '_add_secret_hash',
 '_set_attributes',
 'get_group',
 'get_groups',
]


u = Cognito('your-user-pool-id','your-client-id')
u = Cognito('eu-west-2_tS2PEUS8s','4u365p4vhun9ei7f5q9d4j0nrj',
    client_secret='optional-client-secret'
    username='optional-username',
    id_token='optional-id-token',
    refresh_token='optional-refresh-token',
    access_token='optional-access-token',
    access_key='optional-access-key',
    secret_key='optional-secret-key')
"""