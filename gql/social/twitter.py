from persons.profile import Profile, Follow
from items.models import Movie, List,  Video, Rating, Topic, Article
from persons.models import Director, Person
from persons.profile import Profile, Social

from django.contrib.auth import get_user_model
from django_mysql.models import JSONField
from graphene_django.types import DjangoObjectType
from graphene_django.converter import convert_django_field
import json
import graphene
import graphql_jwt
from graphene_file_upload.scalars import Upload

from gql.types import (VideoType, MovieType, ProfileType, PersonType,CustomListType,
        DirectorType, TopicType, ListType, UserType, RatingType)


class TwitterMutation(graphene.Mutation):
    profile = graphene.Field(ProfileType)

    class Arguments:
        data = graphene.String(required=True)

    def mutate(self,info,data):
        if info.context.user.is_authenticated:
            user = info.context.user
            #print("twitter mutation:",user, data)
            social_account = user.profile.get_or_create_social_account()
            tw_data = json.loads(data)
            social_account.twitter_data = converted_data

            social_account.save()
            return TwitterMutation(profile=user.profile)

