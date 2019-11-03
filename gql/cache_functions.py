
from django.conf import settings
from django.contrib.auth import logout, get_user_model
from django.contrib.auth.models import User 
from django.core.cache import cache
from django_mysql.models import JSONField
from items.models import Movie,Rating, List,  Video, Topic, Tag
from persons.models import Person,  Director, Crew
from persons.profile import Profile, Follow
from persona.models import Recommendation, Persona
from blog.models import Post
from pprint import pprint
import graphene

from django.db.models import Q
from graphene_django.converter import convert_django_field
from gql.types import CustomListType,CustomMovieType
#from .types import ( MovieType, MovieListType, RatingType, ProfileType, PersonType,TagType,
#        CustomListType, CustomMovieType, DirectorPersonMixType,CountryType, PersonaType,
#        DirectorType, TopicType, ListType, UserType, CrewType, movie_defer,
#        CustomSearchType, AdvanceSearchType, PostType, MainPageType)
#from .search import ComplexSearchType, ComplexSearchQuery
#from .persona_query import CustomPersonaType
from functools import lru_cache

class Cache():
    # ------ Main Page ---------gql.types 
    @lru_cache(maxsize=100)
    def main_page_movies():
        mqs = Movie.objects.filter(main_page=True).values_list("slug", flat=True)
        return [CustomMovieType(slug=x) for x in mqs]

    @lru_cache(maxsize=100)
    def main_page_lists():
        lqs =  List.objects.filter(main_page=True).values_list("slug", flat=True)
        return [CustomListType(slug=x) for x in lqs]

    @lru_cache(maxsize=100)
    def main_page_persons():
        pqs = Person.objects.filter(main_page=True).values_list("slug", flat=True)
        return Person.objects.filter(slug__in=pqs)

    @lru_cache(maxsize=100)    
    def main_page_topics():
        pqs = Topic.objects.filter(main_page=True).values_list("slug", flat=True)
        return Topic.objects.filter(slug__in=pqs)

    # ------ Complex Search ---------gql.complex_search 
    @lru_cache(maxsize=200)    
    def complex_search_topic_result(topic_slug, min_year, max_year, min_rating, max_rating):
        qs = Topic.objects.filter(slug=topic_slug, main_page=True)
        if not qs.exists():
            return []
        topic = qs.first()
        qs = topic.movies.all().only("id", "slug", "name", "poster", "cover_poster", "year").order_by("-imdb_rating")
        #print(tags, keywords)


        #YEAR FILTERING
        min_year = min_year if min_year!=None else 1800
        max_year = max_year if max_year!=None else 2025
        qs = qs.filter(year__gte=min_year, year__lte=max_year)
        #print("0", qs.count())   


        #IMDB RATING FILTER
        min_rating = min_rating if min_rating!=None else 1
        max_rating = max_rating if max_rating!=None else 10
        qs = qs.filter(imdb_rating__gte=min_rating, imdb_rating__lte=max_rating)
        return qs


    # ------ MOVIE LISTS --------- gql.schema resolve_liste 
    @lru_cache(maxsize=200)
    def get_custom_list_anonymous_user(id, slug, page):
        return CustomListType(id, slug, page=page)

    @lru_cache(maxsize=300)
    def get_custom_list_auth_user(id, slug, page, username):
        profile = Profile.objects.filter(username=username) 
        return CustomListType(id, slug, page=page, viewer=profile)

    # ------ Persona  ---------
