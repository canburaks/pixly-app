from persons.profile import Profile, Follow
from items.models import Movie, List,  Video, Rating, Topic, Article
from persons.models import Director, Person
from persons.profile import Profile, Social

from django.contrib.auth import get_user_model
from django.contrib.auth.models import User
from django_mysql.models import JSONField
from graphene_django.types import DjangoObjectType
from graphene_django.converter import convert_django_field
import json
import graphene
import graphql_jwt
from graphene_file_upload.scalars import Upload
from pprint import pprint
from gql.auth import DBCheck
from gql.types import (VideoType, MovieType, ProfileType, PersonType,CustomListType,
        DirectorType, TopicType, ListType, UserType, RatingType)

    
def is_email_registered(email):
    if User.objects.filter(email__iexact=email).exists() or \
        Profile.objects.filter(email__iexact=email).exists():
        return True
    return False

def is_social_account_exist(email):
    return Social.objects.filter(email=email).exists()

class FacebookAuthentication(graphene.Mutation):
    user = graphene.Field(UserType)
    success = graphene.Boolean()
    message = graphene.String()

    class Arguments:
        data = graphene.String(required=True)

    def mutate(root,info,data):
        fb_data = json.loads(data)
        #print("data", fb_data.get("profile"))

        #check missing data
        if fb_data.get("tokenDetail")==None or fb_data.get("profile")==None:
            return FacebookAuthentication(success=False, message="profile or token details are missing")

        #check if email is paired and user connected before
        fb_email = fb_data.get("profile").get("email")
        is_social_exist = Social.check_with_facebook_email(fb_email)

        # Login Case
        if is_social_exist:
            social_account = Social.get_with_facebook_email(fb_email)
            profile = social_account.profile
            profile_token = profile.token
            #print("profile_token",profile_token)

            #check incoming and existing facebook id's same
            is_same_id = fb_data.get("profile").get("id") == social_account.facebook_id
            if not is_same_id:
                print("are incoming and existing facebook id's same? ", is_same_id)
                print(social_account.facebook_id, fb_data.get("profile").get("id"))
                return FacebookAuthentication(user=profile.user, success=False,
                    message="Existing and incoming facebook_ids are not the same")

            # first set token details
            token_data = fb_data.get("tokenDetail")
            social_account.facebook_data = fb_data
            social_account.facebook_token = token_data.get("accessToken")
            social_account.facebook_sign = token_data.get("signedRequest")
            social_account.save()
            #print("social account data saved \n")

            #print("user and context auth status: ", profile.user.is_authenticated, info.context.user.is_authenticated)
            return FacebookAuthentication(user=profile.user, success=True, message="")







#for authenticated users only
class FacebookConnect(graphene.Mutation):
    user = graphene.Field(UserType)
    success = graphene.Boolean()
    message = graphene.String()

    class Arguments:
        data = graphene.String(required=True)

    def mutate(self,info,data):
        if info.context.user.is_authenticated:
            user = info.context.user
            #print("facebook mutation:",user, data)
            social_account = user.profile.get_or_create_social_account()
            fb_data = json.loads(data)
            pprint(fb_data["profile"])
            social_account.facebook_data = fb_data
            if fb_data.get("profile"):
                fb_profile = fb_data.get("profile")

                #check email clash for new accounts
                if not social_account.facebook_id or not social_account.facebook_email:
                     have_email_clash = is_email_registered(fb_profile.get("email"))
                     print("have email clash: ", have_email_clash)
                     social_account.email_clash["facebook"] = have_email_clash

                # set fb data
                social_account.facebook_email = fb_profile.get("email")
                social_account.facebook_name = fb_profile.get("name")
                social_account.facebook_id = fb_profile.get("id")

            # set token details
            if fb_data.get("tokenDetail"):
                token_data = fb_data.get("tokenDetail")
                social_account.facebook_token = token_data.get("accessToken")
                social_account.facebook_sign = token_data.get("signedRequest")

            social_account.save()
            return FacebookConnect(user=user, success=True, message=None)
        return FacebookConnect(user=user, success=False, message=None)

