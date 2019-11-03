
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
        CustomSearchType, AdvanceSearchType, PostType, MainPageType)
from .search import ComplexSearchType, ComplexSearchQuery
from .persona_query import CustomPersonaType
from functools import lru_cache
from .cache_functions import Cache

class ListQuery(object):
    list_of_movie_search = graphene.List(MovieType,
                search=graphene.String(default_value=None),
                first=graphene.Int(default_value=None),
                skip=graphene.Int(default_value=None))

    list_of_bookmarks = graphene.List(MovieType,
                username=graphene.String(required=True),
                first=graphene.Int(default_value=None),
                skip=graphene.Int(default_value=None))

    list_of_ratings_movie = graphene.List(MovieType,
                username=graphene.String(required=True),
                first=graphene.Int(default_value=None),
                skip=graphene.Int(default_value=None))

    list_of_crew = graphene.List(CrewType, movie_id=graphene.Int())

    list_of_diary = graphene.List(MovieType,
            first=graphene.Int(default_value=None),
            skip=graphene.Int(default_value=None))

    list_of_lists = graphene.List(CustomListType,
            first=graphene.Int(default_value=None),
            skip=graphene.Int(default_value=None))

    list_of_categorical_lists= graphene.List(CustomListType,
            admin=graphene.Boolean(default_value=True), # return only admin created lists or not 
            list_type=graphene.String(),
            first=graphene.Int(default_value=None),
            skip=graphene.Int(default_value=None))

    list_of_movies = graphene.List(MovieType, 
            id=graphene.Int(default_value=None),
            name=graphene.String(default_value=None),
            search=graphene.String(default_value=None),
            first=graphene.Int(default_value=None),
            skip=graphene.Int(default_value=None))

    list_of_directors = graphene.List(DirectorType,
            first=graphene.Int(default_value=None),
            skip=graphene.Int(default_value=None))

    length = graphene.Int(
        id=graphene.Int(default_value=None),
        name=graphene.String(default_value=None),
        search=graphene.String(default_value=None))


    list_of_tags = graphene.List(TagType)
    list_of_topics = graphene.List(TopicType)

    list_of_recent_movies = graphene.List(CustomMovieType,
                    first=graphene.Int(default_value=None),
                    skip=graphene.Int(default_value=None))

    def resolve_list_of_recent_movies(self, info, **kwargs):
        first = kwargs.get("first") if kwargs.get("first") else 20
        skip = kwargs.get("skip") if kwargs.get("skip") else 0
        viewer =  info.context.user.profile if info.context.user.is_authenticated else None

        movie_qs = Movie.objects.filter(year__gte=2017).only(
            "id", "updated_at").exclude(cover_poster="").order_by("-year")[skip : skip + first]
        custom_movies = [CustomMovieType(x.id) for x in movie_qs if len(x.videos.all())>0 ]
        return custom_movies

    def resolve_list_of_topics(self, info, **kwargs):
        return Topic.objects.filter(main_page=True).only("id", "slug", "name", "summary", "cover_poster")

    def resolve_list_of_tags(self, info, **kwargs):
        QF = (Q(genre_tag=True) | Q(base_tag=True) | Q(award_tag=True)) & Q(topic_tag=False)
        return Tag.objects.filter(QF).only("id", "slug", "name",)

    def resolve_list_of_bookmarks(self, info, **kwargs):
        first = kwargs.get("first")
        skip = kwargs.get("skip")
        username = kwargs.get("username")
        user = info.context.user
        if user.is_authenticated:
            qs = user.profile.bookmarks.defer(*movie_defer).all()
            if first:
                return  qs[skip : skip + first]
            else:
                return  qs

    def resolve_list_of_ratings_movie(self, info, **kwargs):
        first = kwargs.get("first")
        skip = kwargs.get("skip")
        username = kwargs.get("username")
        user = info.context.user
        if user.is_authenticated:
            qs = Movie.objects.defer(*movie_defer).filter(rates__profile=user.profile)
            if first:
                return  qs[skip : skip + first]
            else:
                return  qs  


    def resolve_list_of_movie_search(self, info, **kwargs):
        first = kwargs.get("first")
        skip = kwargs.get("skip")
        search = kwargs.get("search")
        if search:
            words = multi_word_search(search)
            if len(words)==1:
                filter = ( Q(name__icontains=words[0]) )
                if first:
                    return Movie.objects.defer(*movie_defer).filter(filter)[skip : skip + first]
                else:
                    return Movie.objects.defer(*movie_defer).filter(filter)
            elif len(words)>1:
                term1 = " ".join(words)
                filter1 = ( Q(name__icontains=term1))
                qs1 = Movie.objects.defer(*movie_defer).filter(filter1)
                result = [x for x in qs1]


                filter2 = (Q(name__icontains=words[0]))
                qs2 = Movie.objects.defer(*movie_defer).filter(filter2)

                for i in range(1, len(words)):
                    kw = words[i]
                    qs2 = qs2.filter(Q(name__icontains=kw))

                for mov in qs2:
                    result.append(mov)

                result = list(set(result))
                if first:
                    return result[ skip : skip + first ]

                else:
                    return result
    
    def resolve_list_of_crew(self, info, **kwargs):
        movie_id = kwargs.get("movie_id")
        show_jobs = ["d", "a"]
        qs = Crew.objects.filter(movie=Movie.objects.get(id=movie_id),
            job__in=show_jobs, person__bio__isnull=False).select_related("person").defer("data").exclude(
                person__bio__isnull=True).exclude(person__bio__exact='', person__poster__isnull=True)
        return qs

    
    def resolve_list_of_diary(self, info, **kwargs):
        first = kwargs.get("first")
        skip = kwargs.get("skip")
        user = info.context.user
        if user.is_authenticated:
            Q1 = Q(notes__isnull=False)
            Q2 = Q(date__isnull=False)
            rates = user.profile.rates.filter(Q1 | Q2)
            qs = Movie.objects.filter(rates__in=rates).defer(*movie_defer)
        if first:
            return paginate(qs, first, skip)
        return qs

    def resolve_list_of_ratings(self, info, **kwargs):
        first = kwargs.get("first")
        skip = kwargs.get("skip")
        user = info.context.user
        if user.is_authenticated:
            qs =  Rating.objects.select_related("movie", "profile").filter(profile__username=user.username)
            if first:
                return paginate(qs, first, skip)
            return qs

    def resolve_list_of_directors(self, info, **kwargs):
        first = kwargs.get("first")
        skip = kwargs.get("skip")
        result = ListQuery.get_directors()
        #print( ListQuery.get_directors.cache_info())
        return result
        #qs =  Director.objects.filter(active=True)
        #if first:
        #    return paginate(qs, first, skip)
        #return qs
    
    @lru_cache(maxsize=32)
    def get_directors():
        qs =  Director.objects.filter(active=True)
        return qs

    def resolve_list_of_lists(self, info, **kwargs):
        first = kwargs.get("first")
        skip = kwargs.get("skip")
        qs = List.objects.filter(owner__username="pixly").only("id").values_list("id", flat=True)
        if first:
            qs = qs[skip : skip + first]
        else:
            qs = qs
        return [CustomListType(id=x) for x in qs ]

    def resolve_list_of_categorical_lists(self, info, **kwargs):
        user = info.context.user
        page = kwargs.get("page")
        list_type = kwargs.get("list_type")
        admin = kwargs.get("admin")
        model_types = ["df", "fw", "ms", "gr"]
        qs = List.objects.filter(list_type__in=model_types, public=True).only("id").values_list("id", flat=True)
        return [CustomListType(id=x) for x in qs  if len(CustomListType(id=x).liste.summary) > settings.LIST_MIN_SUMMARY ]
        #return [CustomListType(id=x) for x in qs]



    def resolve_list_of_movies(self, info, **kwargs):
        id = kwargs.get("id")
        first = kwargs.get("first")
        skip = kwargs.get("skip")
        name = kwargs.get("name")
        search = kwargs.get("search")
        if id is not None:
            """
            qs = List.objects.get(id=id).movies.defer(*movie_defer)
            """
            ls = List.objects.only("movies").get(id=id)
            if first:
                return Movie.objects.defer("imdb_id","imdb_rating","summary",
                            "tmdb_id","director","data",
                            "tags").filter(lists=ls)[skip : skip + first]
            else:
                return  Movie.objects.defer("imdb_id","imdb_rating","summary",
                            "tmdb_id","director","data",
                            "tags").filter(lists=ls)

        if name is not None:
            user = info.context.user
            if user.is_authenticated:
                if name=="ratings":
                    if first:
                        return Movie.objects.defer("imdb_id","imdb_rating",
                                "tmdb_id","data","director","summary",
                                "tags").filter(rates__in=user.profile.rates.only("movie"))[skip : skip + first]
                    else:
                        return Movie.objects.defer("imdb_id","imdb_rating",
                                "tmdb_id","data","director","summary",
                                "tags").filter(rates__in=user.profile.rates.only("movie"))

                if name=="bookmarks":
                    if first:
                        return  Movie.objects.defer("imdb_id","imdb_rating",
                                "tmdb_id","data","director","summary",
                                "tags").filter(bookmarked=user.profile)[skip : skip + first]
                    else:
                        return  Movie.objects.defer("imdb_id","imdb_rating",
                                "tmdb_id","data","director","summary",
                                "tags").filter(bookmarked=user.profile)        

            else :
                raise Exception('Authentication credentials were not provided')

        if search:
            words = multi_word_search(search)
            if len(words)==1:
                filter = ( Q(name__icontains=words[0]) )
                if first:
                    return Movie.objects.defer("imdb_id","imdb_rating","tmdb_id","data",
                    "director","summary","tags").filter(filter)[skip : skip + first]
                else:
                    return Movie.objects.defer("imdb_id","imdb_rating","tmdb_id","data",
                    "director","summary","tags").filter(filter)
            elif len(words)>1:
                term1 = " ".join(words)
                filter1 = ( Q(name__icontains=term1))
                qs1 = Movie.objects.defer("imdb_id","imdb_rating","tmdb_id","data",
                    "director","summary","tags").filter(filter1)
                result = [x for x in qs1]


                filter2 = (Q(name__icontains=words[0]))
                qs2 = Movie.objects.defer("imdb_id","imdb_rating","tmdb_id","data",
                    "director","summary","tags").filter(filter2)

                for i in range(1, len(words)):
                    kw = words[i]
                    qs2 = qs2.filter(Q(name__icontains=kw))

                for mov in qs2:
                    result.append(mov)

                result = list(set(result))
                """
                for word in words:
                    if len(word)>4:
                        filter2 = ( Q(name__icontains=word) )
                        qs2 = Movie.objects.defer("imdb_id","imdb_rating","tmdb_id","data",
                        ,"director","summary","tags").filter(filter2)
                        for mov in qs2:
                            result.append(mov)
                """
                if first:
                    return result[ skip : skip + first ]

                else:
                    return result


    def resolve_length(self, info, **kwargs):
        id = kwargs.get("id")
        name = kwargs.get("name")
        search = kwargs.get("search")

        if id is not None:
            return List.objects.get(id=id).movies.all().count()

        if name is not None:
            user = info.context.user
            if name=="ratings":
                return user.profile.rates.all().count()
            elif name=="bookmarks":
                return user.profile.bookmarks.all().count()
            elif name=="list_of_lists":
                return List.objects.all().count()
            elif name=="list_of_directors":
                return  Director.objects.filter(active=True).count()
            elif name=="list_of_topics":
                return Topic.objects.all().count()
            elif name=="list_of_diary" and user.is_authenticated:
                return user.profile.rates.filter(notes__isnull=False).count()


        if search:
            filter = (
                Q(name__icontains=search)
                #| Q(summary__icontains=search)
            )
            return Movie.objects.filter(filter).count()

class SearchQuery(object):
    search = graphene.Field(CustomSearchType,
                search=graphene.String(),
                first=graphene.Int(default_value=None),
                skip=graphene.Int(default_value=None))

    search_movie = graphene.List(MovieType,
                search=graphene.String(),
                first=graphene.Int(default_value=None),
                skip=graphene.Int(default_value=None))


    search_list = graphene.List(CustomListType,
                search=graphene.String(),
                first=graphene.Int(default_value=None),
                skip=graphene.Int(default_value=None))

    search_director = graphene.List(DirectorType,
                search=graphene.String(),
                first=graphene.Int(default_value=None),
                skip=graphene.Int(default_value=None))

    search_length = graphene.List(graphene.Int,
                search=graphene.String(),
                first=graphene.Int(default_value=None),
                skip=graphene.Int(default_value=None))

    filter_page = graphene.Field(AdvanceSearchType,
                min_year=graphene.Int(default_value=None),
                max_year=graphene.Int(default_value=None),
                year=graphene.Int(default_value=None),
                min_rating=graphene.Float(default_value=None),
                max_rating=graphene.Float(default_value=None),
                #TAGS
                tag_movielens_ids=graphene.List(graphene.Int, default_value=[]),
                tag_custom_ids=graphene.List(graphene.Int, default_value=[]),

                first=graphene.Int(default_value=None),
                skip=graphene.Int(default_value=None))

    discovery_lists = graphene.List(MovieListType)


    def resolve_filter_page(self, info, **kwargs):
        search_query = AdvanceSearchType(kwargs)
        return search_query


    def resolve_discovery_lists(self, info, **kwargs):
        list_qs = List.objects.prefetch_related("related_persons").filter(
            list_type__in=["df", "fw"]).only(
                    "id","name","poster","list_type", "related_persons__id", "related_persons__name", "related_persons__poster")
        return list_qs



    def resolve_search(self, info, **kwargs):
        first = kwargs.get("first") if kwargs.get("first") else 20
        skip = kwargs.get("skip") if kwargs.get("skip") else 0
        search = kwargs.get("search")
        viewer =  info.context.user.profile if info.context.user.is_authenticated else None

        if len(search)>=3:
            return CustomSearchType(search=search, first=first, skip=skip, viewer=viewer)
        return None

    def resolve_search_movie(self, info, **kwargs):
        first = kwargs.get("first")
        skip = kwargs.get("skip")
        search = kwargs.get("search")
        words = multi_word_search(search)
        if len(words)==1:
            filter = ( Q(name__icontains=words[0]) )
            if first:
                return Movie.objects.defer(*movie_defer).filter(filter)[skip : skip + first]
            else:
                return Movie.objects.defer(*movie_defer).filter(filter)
        elif len(words)>1:
            term1 = " ".join(words)
            filter1 = ( Q(name__icontains=term1))
            qs1 = Movie.objects.defer(*movie_defer).filter(filter1)
            result = [x for x in qs1]


            filter2 = (Q(name__icontains=words[0]))
            qs2 = Movie.objects.defer(*movie_defer).filter(filter2)

            for i in range(1, len(words)):
                kw = words[i]
                qs2 = qs2.filter(Q(name__icontains=kw))

            for mov in qs2:
                result.append(mov)

            result = list(set(result))
            if first:
                return result[ skip : skip + first ]

            else:
                return result

    def resolve_search_list(self, info, **kwargs):
        first = kwargs.get("first")
        skip = kwargs.get("skip")
        search = kwargs.get("search")
        words = multi_word_search(search)
        if len(words)==1:
            filter1 = ( Q(name__icontains=words[0]) )
            if first:
                qs = List.objects.filter(filter1).only("id", "name")[skip : skip + first]
                liste_list = [CustomListType(id=x.id) for x in qs]
                return liste_list
            else:
                qs = List.objects.filter(filter1).only("id", "name")
                liste_list = [CustomListType(id=x.id) for x in qs]
                return liste_list
        elif len(words)>1:
            term1 = " ".join(words)
            filter2 = ( Q(name__icontains=term1))
            qs1 = List.objects.only("id","name").filter(filter2)
            result = [x for x in qs1]


            filter3 = (Q(name__icontains=words[0]))
            qs2 = List.objects.only("id","name").filter(filter3)

            for i in range(1, len(words)):
                kw = words[i]
                qs2 = qs2.filter(Q(name__icontains=kw))

            for mov in qs2:
                result.append(mov)

            result = list(set(result))
            if first:
                liste_list = [CustomListType(id=x.id) for x in result]
                return liste_list[ skip : skip + first ]
            else:
                liste_list = [CustomListType(id=x.id) for x in result]
                return liste_list

    def resolve_search_director(self, info, **kwargs):
        first = kwargs.get("first")
        skip = kwargs.get("skip")
        search = kwargs.get("search")
        words = multi_word_search(search)
        if len(words)==1:
            director_filter = ( Q(name__icontains=words[0]))
            if first:
                return Director.objects.defer("bio", "data").filter(director_filter)[skip : skip + first]
            else:
                return Director.objects.defer("bio", "data").filter(director_filter)

        elif len(words)>1:
            term1 = " ".join(words)
            filter1 = ( Q(name__icontains=term1))
            qs1 = Director.objects.defer("bio", "data").filter(filter1)

            filter2 = (Q(name__icontains=words[0]))
            qs2 = Director.objects.defer("bio", "data").filter(filter2)

            for i in range(1, len(words)):
                kw = words[i]
                qs2 = qs2.filter(Q(name__icontains=kw))

            result = qs1 | qs2
            result = list(set(result))
            if first:
                return result[ skip : skip + first ]
            else:
                return result


class Query(ListQuery, SearchQuery,ComplexSearchQuery, graphene.ObjectType):
    #debug = graphene.Field(DjangoDebug, name='__debug')
    liste = graphene.Field(CustomListType, 
                    slug=graphene.String(default_value=None),
                    id=graphene.Int(default_value=None),
                    page=graphene.Int(default_value=None),
                    first=graphene.Int(default_value=None),
                    skip=graphene.Int(default_value=None))

    rating = graphene.Field(RatingType,id=graphene.Int())

    prediction = graphene.Float(movieId=graphene.Int(default_value=None), id=graphene.Int(default_value=None))

    person = graphene.Field(PersonType,id=graphene.String(default_value=None))
    
    director = graphene.Field(DirectorType,id=graphene.String(default_value=None))

    director_person_mix = graphene.Field(DirectorPersonMixType,
                    id=graphene.String(default_value=None),
                    slug=graphene.String(default_value=None))


    viewer = graphene.Field(ProfileType)

    profile = graphene.Field(ProfileType, username=graphene.String())
    #myself = graphene.Field(MyProfileType, username=graphene.String(default_value=None))


    movie = graphene.Field(CustomMovieType,
                id=graphene.Int(default_value = None),
                slug=graphene.String(default_value = None))


    check_redis_key =  graphene.String(key=graphene.String())

    check_cache_key =  graphene.String(key=graphene.String())

    check_cache_info =  graphene.String(key=graphene.String())

    countries = graphene.List(CountryType)

    persona = graphene.Field(CustomPersonaType, 
                username=graphene.String(),
                first=graphene.Int(default_value=None),
                skip=graphene.Int(default_value=None) )

    blog_posts = graphene.List(PostType, 
                post_type=graphene.String(default_value=None),
                first=graphene.Int(default_value=None),
                skip=graphene.Int(default_value=None) )


    post = graphene.Field(PostType,
                id=graphene.Int(default_value=None),
                slug=graphene.String(default_value=None))

    main_page = graphene.Field(MainPageType)

    topic = graphene.Field(TopicType,
                id=graphene.Int(default_value = None),
                slug=graphene.String(default_value = None))

    def resolve_topic(self, info, **kwargs):
        id = kwargs.get("id")
        slug = kwargs.get("slug")
        #ip = info.context.META.get('REMOTE_ADDR')
        if id:
            return Topic.objects.filter(id=id).first()
        elif slug:
            return Topic.objects.filter(slug=slug).first()
        else:
            return None


    def resolve_main_page(self, info, *_):
        return MainPageType
    
    def resolve_blog_posts(self, info, post_type=None, first=5, skip=0):
        if post_type:
            return Post.objects.filter(post_type=post_type, active=True).order_by("id")[skip : skip + first]
        return Post.objects.filter(active=True).order_by("id")[skip : skip + first]


    def resolve_post(self, info, id=None, slug=None):
        if id:
            return Post.objects.filter(id=id).first()
        elif slug:
            return Post.objects.filter(slug=slug).first()




    def resolve_persona(self, info, username, first=None, skip=None):
        #CHECK IF AUTHENTICATED
        if not info.context.user.is_authenticated:
            raise Exception('Authentication credentials were not provided')
            return None
        
        request_user = info.context.user
        username_user = User.objects.get(username=username)
        
        #CHECK IF USERNAME AND REQUEST USER ARE THE SAME
        
        if request_user!=username_user:
            raise Exception('Credentials user and username mismatched. Please login again!')
            logout(info.context)
            return None
    
        return CustomPersonaType(username=username, first=first, skip=skip)

    def resolve_check_redis_key(self, info, key):
        from django_redis import get_redis_connection
        con = get_redis_connection("default")
        bkey = f":1:{key}"
        key_response = con.exists(str(key))
        bkey_response = con.exists(bkey)
        result = f"key response:{key_response}, bytes key response:{bkey_response}"
        return result

    def resolve_check_cache_key(self, info, key):
        response = cache.has_key(key)
        return str(response)

    def resolve_check_cache_info(self, info, key):
        response = cache.get(key)
        if response!=None:
            r_type = type(response)
            r_len = len(response)
            result = f"key:{key}, type:{r_type}, len:{r_len}"
            return result
        return "Empty"

    def resolve_countries(self,info, **kwargs):
        num = kwargs.get("num")
        liste = []
        for i in range(1,249,1):
            if CountryType(num=i)!=None:
                country = CountryType(num=i)
                liste.append(country)
        return liste

    def resolve_liste(self, info, **kwargs):
        id = kwargs.get("id")
        slug = kwargs.get("slug")
        page = kwargs.get("page")
        first = kwargs.get("first")
        skip = kwargs.get("skip")
        
        user = info.context.user
        if user.is_authenticated:
            return Cache.get_custom_list_auth_user(id, slug, page=page, username=user.username)
        
        return Cache.get_custom_list_anonymous_user(id, slug, page)


    def resolve_profile(self, info, **kwargs):
        username = kwargs.get("username")
        user = info.context.user
        if not user.is_authenticated:
            return Profile.objects.get(username=username)
        elif info.context.user.is_authenticated:
            user = info.context.user
            if user.username==username:
                is_self=True
                return user.profile
            else:
                is_self=False
            return Profile.objects.get(username=username)

        
    def resolve_rating(self, info,**kwargs):
        movid = kwargs.get("id")
        if info.context.user.is_authenticated:
            profile = info.context.user.profile
            rates = profile.rates.get(movie__id=movid)
            return rates
            #return Rating.objects.get(profile=profile, movie=Movie.objects.get(id=id))

    def resolve_topic(self, info, **kwargs):
        id = kwargs.get("id")
        return Topic.objects.get(id=id)

    def resolve_prediction(self, info,**kwargs):
        # Change in future, only use "id"
        if kwargs.get("id"):
            movid = kwargs.get("id")
        elif kwargs.get("movieId"):
            movid = kwargs.get("movieId")

        if info.context.user.is_authenticated:
            profile = info.context.user.profile
            if len(profile.ratings.items())<40:
                return 0
            movie = Movie.objects.get(id=movid)
            result = profile.predict(movie)
            return result

    def resolve_director(self, info, **kwargs):
        id = kwargs.get("id")
        name = kwargs.get("name")
        if id is not None:
            return Person.objects.get(id=id)

    def resolve_director_person_mix(self, info, **kwargs):
        id = kwargs.get("id")
        slug = kwargs.get("slug")
        print(slug, id)
        if slug is not None:
            return Person.objects.get(slug=slug)
        elif id is not None:
            return Person.objects.get(id=id)

    def resolve_person(self, info, **kwargs):
        id = kwargs.get("id")
        name = kwargs.get("name")
        if id is not None:
            return Person.objects.get(id=id)

    def resolve_viewer(self, info, **kwargs):
        if info.context.user.is_authenticated:
            user = info.context.user
            return user.profile
        else:
            return None

    def resolve_movie(self, info, **kwargs):
        id = kwargs.get("id")
        slug = kwargs.get("slug")
        #ip = info.context.META.get('REMOTE_ADDR')
        if info.context.user.is_authenticated:
            user = info.context.user
            return CustomMovieType(id=id, slug=slug, viewer=user.profile)
        return CustomMovieType(id=id, slug=slug)


from .mutations import (Bookmark, Follow, Rating, BackgroundTasks,ContactMutation,
        ObtainJSONWebToken, Prediction, RedisMutation, Fav, #BackgroundCacheSet,
        EmailValidation, UsernameValidation,Logout, ObtainJSONWebToken)
        

from .profile_mutations import (CreateList,UpdateList, DeleteList,
        AddMovie, RemoveMovie, ProfileInfo, AddMovies, UploadAvatar)

from .auth import (Login, ResendRegisterationMail, CheckVerificationMutation,
            Logout, CreateUser, ChangePassword, ForgetPassword, ChangeForgetPassword)

from .social.facebook import FacebookConnect, FacebookAuthentication
from .social.twitter import TwitterMutation

class Mutation(graphene.ObjectType):
    contact_mutation = ContactMutation.Field()

    facebook_connect = FacebookConnect.Field()
    facebook_authenticate = FacebookAuthentication.Field()
    
    twitter_mutation = TwitterMutation.Field()

    valid_username = UsernameValidation.Field()
    valid_email = EmailValidation.Field()

    updateList = UpdateList.Field()
    upload_avatar = UploadAvatar.Field()
    prediction = Prediction.Field()
    profile_info_mutation = ProfileInfo.Field()
    add_movies = AddMovies.Field()
    add_movie = AddMovie.Field()
    remove_movie = RemoveMovie.Field()
    create_list = CreateList.Field()
    delete_list = DeleteList.Field()

    #background_cache_task = BackgroundCacheSet.Field()
    background_tasks = BackgroundTasks.Field()

    redis = RedisMutation.Field()
    
    follow= Follow.Field()
    fav= Fav.Field()
    logout = Logout.Field()
    rating = Rating.Field()
    bookmark = Bookmark.Field()
    create_user = CreateUser.Field()


    #token_auth = ObtainJSONWebToken.Field()

    verify_token = graphql_jwt.Verify.Field()
    refresh_token = graphql_jwt.Refresh.Field()

    #COGNITO MUTATIONS
    token_auth = Login.Field()
    resend_mail = ResendRegisterationMail.Field()
    check_verification= CheckVerificationMutation.Field()

    change_password = ChangePassword.Field() #auth user change
    forget_password = ForgetPassword.Field() #send mail
    change_forget_password = ChangeForgetPassword.Field() #change with verification code

schema = graphene.Schema(query=Query, mutation=Mutation)



def paginate(query, first, skip):
    return query[int(skip) : int(skip) + int(first)]

def multi_word_search(text):
    text = text.replace("'" , " ")
    text = text.replace("," , " ")
    text_filtered = text.split(" ")
    word_list = list(filter(lambda x: len(x)>1 and (x.lower() !="the"), text_filtered))
    word_list = list(map( lambda x: x.lower(), word_list ))
    return word_list



def is_owner(self, info):
    user = info.context.user
    if user.username == self.username:
        return True
    return False

def year_filter(year, min_year, max_year):
    if year!=None:
        return Q(year=year)
    elif min_year!=None and max_year!=None:
        return Q(Q(year__gte=min_year) & Q(year__lte=max_year))
    
def rating_filter(min_rating, max_rating):
    if min_rating!=None and max_rating!=None:
        return Q(Q(imdb_rating__gte=min_rating) & Q(imdb_rating__lte=max_rating))

def filter_page_function(kwargs):
    min_year = kwargs.get("min_year") if kwargs.get("min_year")!=None else 1800
    max_year = kwargs.get("max_year") if kwargs.get("max_year")!=None else 2025
    year = kwargs.get("year") 
    min_rating = kwargs.get("min_rating") if kwargs.get("min_rating")!=None else 1
    max_rating = kwargs.get("max_rating") if kwargs.get("max_rating")!=None else 10

    movielens_ids = kwargs.get("movielens_ids")
    custom_ids = kwargs.get("custom_ids")


    first = kwargs.get("first")
    skip = kwargs.get("skip")
        
    print(year, min_year, max_year, min_rating, max_rating, first, skip)
    # OPENING PAGE
    if year==None and min_year==None and max_year==None and min_rating==None and max_rating==None and len(movielens_ids)==0 and len(custom_ids)==0:
        return Movie.objects.filter(year__gte=2019).defer("summary", "director", "data").order_by("?")[:50]


    #FIRST TAG MOVIES
    if len(movielens_ids)>0 or len(custom_ids)>0:
        q1 = Q(movielens_id__in=movielens_ids)
        q2 = Q(custom_id__in=custom_ids)
        q3 = Q(q1 | q2)

        tag_qs = Tag.objects.prefetch_related("related_movies").filter(q3)
        if tag_qs.exists():
            movie_ids = []
            for t in tag_qs:
                tmid = [x.id for x in t.related_movies.all().only("id")]
                movie_ids = movie_ids + tmid
            qs = Movie.objects.filter(id__in=movie_ids).defer("summary", "director", "data")
            print("tqs",qs.count())
            
    else:
        qs = Movie.objects.all().defer("summary", "director", "data")


    if year!=None:
        qs = qs.filter(year=year)

    #MIN-MAX YEAR FILTER
    qs = qs.filter(year__gte=min_year, year__lte=max_year)

    #IMDB RATING FILTER
    qs = qs.filter(imdb_rating__gte=min_rating, imdb_rating__lte=max_rating)
    quantity = qs.count()

    #PAGINATE
    if first!=None and skip!=None:
        return qs.order_by("-year")[skip : first + skip], quantity
    #FIRST PAGE
    return qs.order_by("-year")[:50], quantity




"""
import functools
from gql.schema import schema

@functools.lru_cache(maxsize=32)
def cacher():
    qs = "{ listOfDirectors{id,name} }"
    #qs = "{ listOfDirectors{id,name, born, tmdb_id} }"
    result = schema.execute(qs)
    print("result", result.data["listOfDirectors"])
    return result.data["listOfDirectors"]

cacher.cache_info()
mutation TokenAuth($username: String!, $password: String!) {
  tokenAuth(username: $username, password: $password) {
    token
  }
}


mutation VerifyToken($token: String!) {
  verifyToken(token: $token) {
    payload
  }
}

mutation RefreshToken($token: String!) {
  refreshToken(token: $token) {
    token
    payload
  }
}

    def resolve_filter_page(self, info, year=None, min_year=1800, max_year=2025, min_rating=1, max_rating=10, first=50, skip=0 ):
        
        min_year = kwargs.get("min_year") if kwargs.get("min_year")!=None else 1800
        max_year = kwargs.get("max_year") if kwargs.get("max_year")!=None else 2025
        year = kwargs.get("year") 
        min_rating = kwargs.get("min_rating") if kwargs.get("min_rating")!=None else 1
        max_rating = kwargs.get("max_rating") if kwargs.get("max_rating")!=None else 10
        first = kwargs.get("first")
        skip = kwargs.get("skip")
        
        print("kwargs:\n")
"""
