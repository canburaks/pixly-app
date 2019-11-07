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
    



        