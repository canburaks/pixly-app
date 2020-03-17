from items.models import Rating,Movie, List,  Video, Topic, Prediction, Tag
from persons.models import Person, Director, Crew
from persons.profile import Profile, Follow, Activity
from archive.models import MovSim, TmdbMovie, ContentSimilarity
from persona.models import Recommendation, Persona
from blog.models import Post
from django.contrib.auth import get_user_model
from django.contrib.auth.models import User 
import graphene
from django_mysql.models import JSONField
from graphene_django.types import DjangoObjectType
from graphene_django.converter import convert_django_field
from django.db.models import Q
from django_countries import countries
import itertools
from pprint import pprint
from django.conf import settings
from pixly.cache_functions import Cache
from gql.types import (MovieType, ProfileType, DirectorPersonMixType,CustomListType,
        ActivityType, TopicType, ListType, UserType, RatingType, RecommendationType,
        TagType, SocialMediaType, SEOType)


class CustomPersonaType(graphene.ObjectType, SocialMediaType, SEOType):
    profile = graphene.Field(ProfileType)
    recommendations = graphene.List(RecommendationType)
    feed = graphene.List(ActivityType)
    recent_movies = graphene.List(MovieType)

    most_actors = graphene.List(DirectorPersonMixType)
    most_directors = graphene.List(DirectorPersonMixType)
    most_lists = graphene.List(CustomListType)
    starter_lists = graphene.List(CustomListType)
    newest_lists = graphene.List(CustomListType)
    newest_topics = graphene.List(TopicType)

    most_genres = graphene.List(TagType)

    #feed_unique_profiles = graphene.List(ProfileType)

    def __init__(self, username, first=None, skip=None):
        self.username = username
        self.user = User.objects.get(username=username)
        self.profile = self.user.profile
        #self.stat = self.profile.get_statistics_object()
        self.first = first
        self.skip = skip

    def resolve_newest_lists(self, info):
        movie_list_ids = List.objects.filter(is_newest=True).values_list("id", flat=True)
        return [CustomListType(id=x) for x in movie_list_ids]

    def resolve_newest_topics(self, info):
        tqs = Topic.objects.filter(is_newest=True).only("slug", "id", "name", "summary", "cover_poster")
        return tqs

    def resolve_most_actors(self, info, *_):
        m_actors = self.profile.get_statistics_object().most_actors()
        result = []
        try:
            for counter_obj in m_actors:
                person = Person.objects.filter(id=counter_obj[0]).first()
                person.watch_quantity = counter_obj[1]
                result.append(person)
            return result
        except:
            return None

    def resolve_most_directors(self, info, *_):
        m_directors = self.profile.get_statistics_object().most_directors()
        result = []
        try:
            for counter_obj in m_directors:
                person = Person.objects.filter(id=counter_obj[0]).first()
                person.watch_quantity = counter_obj[1]
                result.append(person)
            return result
        except:
            return None

    def resolve_most_lists(self, info):
        m_lists = self.profile.get_statistics_object().most_lists()
        result = []
        try:
            for counter_obj in m_lists:
                liste = CustomListType(id=counter_obj[0])
                liste.watch_quantity = counter_obj[1]
                result.append(liste)
            return result
        except:
            return None

    def resolve_most_genres(self, info):
        m_genres = self.profile.get_statistics_object().most_genres()
        result = []
        try:
            for counter_obj in m_genres:
                tag = Tag.objects.filter(slug=counter_obj[0]).first()
                tag.watch_quantity = counter_obj[1]
                result.append(tag)
            return result
        except:
            return None

    def resolve_seo_title(self, info, *_):
        if self.seo_title == None:
            name = self.user.profile.name if self.user.profile.name != None else f"@{self.username}"
            self.seo_title = f"{name} - Pixly"
            self.save()
        return self.seo_title

    def resolve_seo_description(self, info, *_):
        if self.user.profile.seo_description == None:
            try:
                self.set_seo_description_keywords()
                return self.user.profile.seo_description
            except:
                print(f"{self.name} custom profile seo description could not be saved in -> resolve_seo_description ")
                return self.user.profile.seo_description
        return self.user.profile.seo_description

    def resolve_seo_keywords(self, info, *_):
        if self.user.profile.seo_keywords == None:
            try:
                self.user.profile.set_seo_description_keywords()
                return self.user.profile.seo_keywords
            except:
                print(f"{self.username} custom profile seo keywords could not be saved in -> resolve_seo_keywords ")
                return self.user.profile.seo_keywords
        return self.user.profile.seo_keywords

    def resolve_profile(self, info):
        return self.user.profile

    def resolve_recent_movies(self, info):
        return Cache.recent_movies(quantity=20)

    def resolve_recommendations(self, info, *_):
        print("asd")
        records = Recommendation.prepare_recommendations(profile=self.user.profile)
        print("recommendations quantity",len(records))
        return records


    def resolve_feed(self, info):
        target_profiles_qs = Follow.objects.select_related("profile", "target_profile").filter(profile=self.user.profile,
            typeof="u").only("profile","target_profile", "typeof")
        target_profiles = [x.target_profile for x in target_profiles_qs]

        if self.first!=None:
            return Activity.objects.filter(profile__in=target_profiles).order_by("-created_at")[self.skip : self.skip + self.first]
        else:
            return Activity.objects.filter(profile__in=target_profiles).order_by("-created_at")[:50]

    def resolve_starter_lists(self, info):
        imdb250_id = 3
        movie_list_ids = [imdb250_id]
        return [CustomListType(id=x) for x in movie_list_ids]