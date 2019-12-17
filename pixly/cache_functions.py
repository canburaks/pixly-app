
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
from pixly.lib import get_class_callable_names, get_class_cache_methods
from functools import lru_cache

class Cache():
    
    def flush():
        try:
            [Cache.__dict__[name].cache_clear() for name,method in get_class_cache_methods(Cache)]
            return True
        except:
            return False
    
    # ------ Main Page ---------gql.types 
    @lru_cache(maxsize=100)
    def main_page_movies():
        from gql.types import CustomMovieType
        mqs = Movie.objects.filter(main_page=True).order_by("-created_at").values_list("slug", flat=True)
        return [CustomMovieType(slug=x) for x in mqs]

    @lru_cache(maxsize=100)
    def main_page_lists():
        from gql.types import CustomListType
        lqs =  List.objects.filter(main_page=True).values_list("slug", flat=True)
        return [CustomListType(slug=x) for x in lqs]

    @lru_cache(maxsize=100)
    def main_page_persons():
        pqs = Person.objects.filter(main_page=True).values_list("slug", flat=True)
        return Person.objects.filter(slug__in=pqs)

    #@lru_cache(maxsize=100)    
    def main_page_topics():
        pqs = Topic.objects.filter(main_page=True).values_list("slug", flat=True)
        return Topic.objects.filter(slug__in=pqs)

    # ------ Complex Search ---------gql.complex_search 
    #@lru_cache(maxsize=200)    
    def complex_search_topic_result(topic_slug, min_year, max_year, min_rating, max_rating):
        qs = Topic.objects.filter(slug=topic_slug)
        if not qs.exists():
            return []
        topic = qs.first()
        topic.html_content
        qs = topic.movies.all().only("id", "slug", "name", "poster", "cover_poster", "year", "imdb_rating").order_by("-imdb_rating")


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


    # ------  LISTS --------- gql.schema resolve_liste 
    @lru_cache(maxsize=200)
    def get_custom_list_anonymous_user(id, slug, page):
        from gql.types import CustomListType
        return CustomListType(id, slug, page=page)

    @lru_cache(maxsize=300)
    def get_custom_list_auth_user(id, slug, page, username):
        from gql.types import CustomListType
        profile = Profile.objects.filter(username=username) 
        return CustomListType(id, slug, page=page, viewer=profile)

    # ------ Movies  ---------gql.types 
    @lru_cache(maxsize=100)
    def recent_movies(quantity=20):
        mqs = Movie.objects.filter(year=2019, imdb_rating__gte=6.5).defer("director", "data").order_by("-updated_at")[:quantity]
        return mqs

    @lru_cache(maxsize=42)
    def active_directors():
        qs =  Director.objects.filter(active=True)
        return qs