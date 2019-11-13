from items.models import Rating,Movie, List, Video, Topic, Tag
from persons.models import Person, Director, Crew
from persons.profile import Profile, Follow
from django.contrib.auth import get_user_model
import graphene
from django_mysql.models import JSONField
from graphene_django.types import DjangoObjectType
from graphene_django.converter import convert_django_field
from django.db.models import Q
import django_filters
from django.conf import settings
from pixly.cache_functions import Cache
from .types import (VideoType, MovieType, MovieListType, RatingType, ProfileType, PersonType,
        CustomListType, CustomMovieType, DirectorPersonMixType, TagType,
        DirectorType, TopicType, ListType, UserType, CrewType, movie_defer)

def multi_word_search(text):
    text = text.strip()
    text = text.replace("'" , " ")
    text = text.replace("," , " ")
    text_filtered = text.split(" ")
    word_list = list(filter(lambda x: len(x)>2 , text_filtered))
    word_list = list(map( lambda x: x.lower(), word_list ))
    return word_list

def multi_word_query(*arg):
    if len(arg)==1:
        one_word = ( Q(name__icontains=arg[0]) )



class ComplexSearchQuery(object):
    tag_search = graphene.List(MovieType, tags=graphene.List(graphene.String))
    tag_search_quantity = graphene.Int(tags=graphene.List(graphene.String))


    complex_search = graphene.Field("gql.search.ComplexSearchType",
            keywords=graphene.String(default_value=None),
            page=graphene.Int(default_value=None),

            min_year=graphene.Int(default_value=None),
            max_year=graphene.Int(default_value=None),

            min_rating=graphene.Float(default_value=None),
            max_rating=graphene.Float(default_value=None),

            #TAGS
            tags=graphene.List(graphene.String, default_value=[]),
            first=graphene.Int(default_value=None),
            topic_slug= graphene.String(default_value=None)

            )

    def resolve_tag_search(self, info, **kwargs):
        tags = kwargs.get("tags")
        tag_qs = Tag.objects.filter(slug__in=tags).only("related_movies__id", "slug").prefetch_related("related_movies")
        movie_list = set()
        for t in tag_qs:
            tag_movies = t.related_movies.all().only("id")
            for mid in tag_movies:
                movie_list.add(mid)
        
        return movie_list

    def resolve_tag_search_quantity(self, info, **kwargs):
        tags = kwargs.get("tags")
        print("self",self)
        tag_qs = Tag.objects.filter(slug__in=tags).only("related_movies__id", "slug").prefetch_related("related_movies")
        movie_list = set()
        for t in tag_qs:
            tag_movies = t.related_movies.all().only("id")
            for mid in tag_movies:
                movie_list.add(mid)
        return len(movie_list)

    def resolve_complex_search(self, info, **kwargs):
        return ComplexSearchType(kwargs)



class ComplexSearchType(graphene.ObjectType):
    quantity = graphene.Int()
    quantity_request = graphene.Int()

    result = graphene.List(MovieType)
    keyword_result = graphene.List(MovieType)

    topic = graphene.Field(TopicType)
    topic_result = graphene.List(MovieType)

    def __init__(self,kwargs):
        #print(kwargs)
        self.keywords = kwargs.get("keywords")
        
        self.min_year = kwargs.get("min_year")
        self.max_year = kwargs.get("max_year")
        
        self.min_rating = kwargs.get("min_rating")
        self.max_rating = kwargs.get("max_rating")

        self.tags = kwargs.get("tags")
        self.topic_slug = kwargs.get("topic_slug")

        self.page = kwargs.get("page") if kwargs.get("page") else 1
        self.first = kwargs.get("first") if kwargs.get("first") else settings.PER_PAGE_ITEM
        self.skip = (self.page - 1 ) * settings.PER_PAGE_ITEM
        #self.first = 40
        #self.skip = (self.page - 1 ) * 40

        self.quantity = 0

    def result_query(self):
        keywords = self.keywords.strip() if self.keywords != None else None
        tags = self.tags
        #print(tags, keywords)

        #MAIN QUERY

        #FIRST KEYWORDS
        if keywords and len(keywords) > 0:
            keywords_ids = set()
            if keywords and len(keywords) > 0:
                print("asd")
                words = multi_word_search(keywords)

                #check for full keywords
                full_name_query_ids = Movie.objects.filter(name__icontains=keywords).values_list("id", flat=True)
                #append ids to set
                for movie_id in full_name_query_ids:
                    keywords_ids.add(movie_id) 

                #check for partial keywords
                if len(words) > 1:
                    for word in words:
                        partial_name_query_ids = Movie.objects.filter(name__icontains=keywords).values_list("id", flat=True)
                        #append ids to set
                        for movie_id in partial_name_query_ids:
                            keywords_ids.add(movie_id)
            if len(keywords_ids) > 0:
                print("asd2")
                #print("before quantity: ", qs.count())
                qs = Movie.objects.filter(id__in=keywords_ids)
                #print("after quantity: ", qs.count())
            else:
                qs = Movie.objects.none()


        #qs = Movie.objects.all().only("id", "name", "poster","slug", "cover_poster", "year", "imdb_rating").order_by("id")
        #SECOND TAG MOVIES
        if tags and len(tags) > 0:
            tag_movie_ids = set()
            if len(tags)>0:
                tag_qs = Tag.objects.filter(slug__in=tags).only("slug")
                if tag_qs.exists():
                    for t in tag_qs:
                        for movie_id in t.movie_ids:
                            tag_movie_ids.add(movie_id)
            if len(tag_movie_ids) > 0:
                if keywords and len(keywords) > 0:
                    qs = qs.filter(id__in=tag_movie_ids)
                else:
                    qs = Movie.objects.filter(id__in=tag_movie_ids)
        if (not keywords or len(keywords) == 0) and ( not tags or len(tags) == 0):
            qs = Movie.objects.all().only("id", "name", "poster","slug", "cover_poster", "year", "imdb_rating").order_by("id")

        print("before year and rating filter", qs.count())
        #YEAR FILTERING
        min_year = self.min_year if self.min_year!=None else 1800
        max_year = self.max_year if self.max_year!=None else 2025
        
        qs = qs.filter(year__gte=min_year, year__lte=max_year)
        print("after year filter",min_year, max_year, qs.count())   


        #IMDB RATING FILTER
        min_rating = self.min_rating if self.min_rating!=None else 1
        max_rating = self.max_rating if self.max_rating!=None else 10
        qs = qs.filter(imdb_rating__gte=min_rating, imdb_rating__lte=max_rating)
        print("after rating",min_rating, max_rating, qs.count())   

        



       
            
        #print(qs.count())
        self.quantity = qs.count()

        qs = qs[self.skip : self.skip + self.first]
        #print(qs.count())
        return qs


    def resolve_result(self, info):
        query = self.result_query()
        return query


    def keyword_query(self):
        keywords = self.keywords.strip() if self.keywords != None else None
        tags = self.tags
        #print(keywords)

        #MAIN QUERY
        qs = Movie.objects.all().only("id", "name", "poster","slug", "cover_poster", "year", "imdb_rating").order_by("id")

        #YEAR FILTERING
        min_year = self.min_year if self.min_year!=None else 1800
        max_year = self.max_year if self.max_year!=None else 2025
        qs = qs.filter(year__gte=min_year, year__lte=max_year)


        #IMDB RATING FILTER
        min_rating = self.min_rating if self.min_rating!=None else 1
        max_rating = self.max_rating if self.max_rating!=None else 10
        qs = qs.filter(imdb_rating__gte=min_rating, imdb_rating__lte=max_rating)

        
        #FIRST KEYWORDS
        keywords_ids = set()
        if keywords != None:
            words = multi_word_search(keywords)

            #check for full keywords
            full_name_query_ids = Movie.objects.filter(name__icontains=keywords).values_list("id", flat=True)
            #append ids to set
            for movie_id in full_name_query_ids:
                keywords_ids.add(movie_id) 
            
            #check for partial keywords
            if len(words) > 1:
                for word in words:
                    partial_name_query_ids = Movie.objects.filter(name__icontains=keywords).values_list("id", flat=True)
                    #append ids to set
                    for movie_id in partial_name_query_ids:
                        keywords_ids.add(movie_id)
        if len(keywords_ids) > 0:
            #print("before quantity: ", qs.count())
            qs = qs.filter(id__in=keywords_ids)
            #print("after quantity: ", qs.count())
        else:
            return []

        #print(qs.count())
        self.quantity = qs.count()

        qs = qs.order_by("-year")
        #print(qs.count())
        return qs

    def resolve_keyword_result(self, info):
        query = self.keyword_query()
        #print("query", query.count())
        #PAGINATE
        #if self.first!=None and self.skip!=None:
        #    return query[self.skip : self.first + self.skip]

        #FIRST PAGE
        return query[self.skip : self.skip + self.first]


    #while querying result, use this
    def resolve_quantity(self, info):
        if self.quantity:
            return self.quantity
        return 0
    
    #This is for only quantity requests
    def resolve_quantity_request(self, info):
        keywords = self.keywords.strip() if self.keywords != None else None
        tags = self.tags
        #print(keywords)

        #MAIN QUERY
        qs = Movie.objects.all().only("id", "name", "poster", "cover_poster", "year", "imdb_rating")

        #YEAR FILTERING
        min_year = self.min_year if self.min_year!=None else 1800
        max_year = self.max_year if self.max_year!=None else 2025
        qs = qs.filter(year__gte=min_year, year__lte=max_year)


        #IMDB RATING FILTER
        min_rating = self.min_rating if self.min_rating!=None else 1
        max_rating = self.max_rating if self.max_rating!=None else 10
        qs = qs.filter(imdb_rating__gte=min_rating, imdb_rating__lte=max_rating)


        #FIRST KEYWORDS
        keywords_ids = set()
        if keywords != None:
            words = multi_word_search(keywords)

            #check for full keywords
            full_name_query_ids = Movie.objects.filter(name__icontains=keywords).values_list("id", flat=True)
            #append ids to set
            for movie_id in full_name_query_ids:
                keywords_ids.add(movie_id) 
            
            #check for partial keywords
            if len(words) > 1:
                for word in words:
                    partial_name_query_ids = Movie.objects.filter(name__icontains=keywords).values_list("id", flat=True)
                    #append ids to set
                    for movie_id in partial_name_query_ids:
                        keywords_ids.add(movie_id)
        if len(keywords_ids) > 0:
            #print("before quantity: ", qs.count())
            qs = qs.filter(id__in=keywords_ids)
            #print("after quantity: ", qs.count())



        #SECOND TAG MOVIES
        tag_movie_ids = set()
        if len(tags)>0:
            tag_qs = Tag.objects.filter(slug__in=tags).only("slug")
            if tag_qs.exists():
                for t in tag_qs:
                    for movie_id in t.movie_ids:
                        tag_movie_ids.add(movie_id)
        if len(tag_movie_ids) > 0:
            #print("before quantity: ", qs.count())
            qs = qs.filter(id__in=tag_movie_ids)
            #print("after quantity: ", qs.count())          
            
        return qs.count()



    def resolve_topic(self, info):
        qs = Topic.objects.filter(slug=self.topic_slug)
        if qs.exists():
            #print(qs.first().html_content)
            return qs.first()
        return None

    def resolve_topic_result(self, info):
        #print("www", info.context.user.username)
        cached_qs = Cache.complex_search_topic_result(
            self.topic_slug, 
            self.min_year, self.max_year,
            self.min_rating, self.max_rating
            )
        #print(qs.count())
        self.quantity = cached_qs.count()

        cached_qs = cached_qs[self.skip : self.skip + self.first]
        #print(cached_qs.count())
        return cached_qs

    

###     FILTERS     ####
"""
    def resolve_topic_result(self, info):
        if not self.topic_slug:
            return []
        qs = Topic.objects.filter(slug=self.topic_slug, main_page=True)
        if not qs.exists():
            return []
        topic = qs.first()
        qs = topic.movies.all().only("id", "slug", "name", "poster", "cover_poster", "year").order_by("-id")
        #print(tags, keywords)


        #YEAR FILTERING
        min_year = self.min_year if self.min_year!=None else 1800
        max_year = self.max_year if self.max_year!=None else 2025
        qs = qs.filter(year__gte=min_year, year__lte=max_year)
        #print("0", qs.count())   


        #IMDB RATING FILTER
        min_rating = self.min_rating if self.min_rating!=None else 1
        max_rating = self.max_rating if self.max_rating!=None else 10
        qs = qs.filter(imdb_rating__gte=min_rating, imdb_rating__lte=max_rating)
        #print("1", qs.count())   

        #print(qs.count())
        self.quantity = qs.count()

        qs = qs[self.skip : self.skip + self.first]
        #print(qs.count())
        return qs
"""