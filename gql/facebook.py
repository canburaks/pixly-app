from persons.profile import Profile, Follow
from items.models import Movie, List,  Video, Rating, Topic, Article
from persons.models import Director, Person
from persons.profile import Profile, Info

from django.contrib.auth import get_user_model
from django_mysql.models import JSONField
from graphene_django.types import DjangoObjectType
from graphene_django.converter import convert_django_field
import json
import graphene
import graphql_jwt
from graphene_file_upload.scalars import Upload

from .types import (VideoType, MovieType, ProfileType, PersonType,CustomListType,
        DirectorType, TopicType, ListType, UserType, RatingType)

def get_info_object(profile):
    info_qs = Info.objects.filter(profile=profile)
    if info_qs.exists():
        return info_qs.first()
    new_info_obj = Info.objects.create(profile=profile)
    print(f"new info object created for {profile.username} in facebook mutation")
    return new_info_obj


class FacebookMutation(graphene.Mutation):
    profile = graphene.Field(ProfileType)

    class Arguments:
        data = graphene.String(required=True)

    def mutate(self,info,data):
        if info.context.user.is_authenticated:
            user = info.context.user
            #print("facebook mutation:",user, data)
            info_object = user.profile.get_info_object()
            fb_data = json.loads(data)
            info_object.facebook_data = fb_data
            if fb_data.get("profile"):
                fb_profile = fb_data.get("profile")
                info_object.facebook_email = fb_profile.get("email")
                info_object.facebook_name = fb_profile.get("name")
                info_object.facebook_id = fb_profile.get("id")
            if fb_data.get("tokenDetail"):
                token_data = fb_data.get("tokenDetail")
                info_object.facebook_token = token_data.get("accessToken")
                info_object.facebook_sign = token_data.get("signedRequest")
            info_object.save()
            return FacebookMutation(profile=user.profile)

