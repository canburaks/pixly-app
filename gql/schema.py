from django.conf import settings
from django.contrib.auth import logout, get_user_model
from django.contrib.auth.models import User 
from django.core.cache import cache
from django_mysql.models import JSONField
from items.models import Movie,Rating, List,  Video, Topic, Tag,MovieGroup
from persons.models import Person,  Director, Crew
from persons.profile import Profile, Follow
from persona.models import Recommendation, Persona
from blog.models import Post
from pprint import pprint
import graphene

import graphql_jwt
from graphql_jwt.decorators import login_required
from graphene_django.types import DjangoObjectType
from django.db.models import Q
from graphene_django.converter import convert_django_field
from graphene_django.debug import DjangoDebug
import django_filters
from .types import (VideoType, MovieType, MovieListType, RatingType, ProfileType, PersonType,TagType,
        CustomListType, CustomMovieType, DirectorPersonMixType,CountryType, PersonaType,
        DirectorType, TopicType, ListType, UserType, CrewType, movie_defer,
        CustomSearchType, AdvanceSearchType, PostType, MainPageType, MovieGroupType)
from .search import ComplexSearchType, ComplexSearchQuery
from .persona_query import CustomPersonaType
from functools import lru_cache
from pixly.cache_functions import Cache

# Define GraphQL queries for the application
class ListQuery(object):
    # Query to search for movies
    list_of_movie_search = graphene.List(MovieType,
                search=graphene.String(default_value=None),
                first=graphene.Int(default_value=None),
                skip=graphene.Int(default_value=None))

    # Query to get user bookmarks
    list_of_bookmarks = graphene.List(MovieType,
                username=graphene.String(required=True),
                first=graphene.Int(default_value=None),
                skip=graphene.Int(default_value=None))

    # Query to get user movie ratings
    list_of_ratings_movie = graphene.List(MovieType,
                username=graphene.String(required=True),
                first=graphene.Int(default_value=None),
                skip=graphene.Int(default_value=None))

    # Query to get movie crew
    list_of_crew = graphene.List(CrewType, movie_id=graphene.Int())

    # Query to get user diary
    list_of_diary = graphene.List(MovieType,
            first=graphene.Int(default_value=None),
            skip=graphene.Int(default_value=None))

    # Additional queries...

# Define GraphQL mutations for the application
class Mutation(graphene.ObjectType):
    # Mutation for blog post operations
    blog_post_mutation = BlogPostMutation.Field()
    # Mutation for user contact operations
    contact_mutation = ContactMutation.Field()
    # Additional mutations...

# Define utility functions for pagination and filtering
def paginate(query, first, skip):
    """Paginate the query results."""
    # Implementation...

def multi_word_search(text):
    """Perform a multi-word search."""
    # Implementation...

# Additional utility functions...
