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


@convert_django_field.register(JSONField)
def convert_json_field_to_string(field, registry=None):
    return graphene.String()

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



movie_defer = ("imdb_id","tmdb_id","data",
        "director","summary","tags", "tags")


#-------ABSTRACT TYPES-----------#
class SocialMediaType(graphene.AbstractType):
    homepage = graphene.String()
    facebook = graphene.String()
    twitter = graphene.String()
    instagram = graphene.String()
    imdb = graphene.String()

class SEOType(graphene.AbstractType):
    seo_title = graphene.String()
    seo_short_description = graphene.String()
    seo_description = graphene.String()
    seo_keywords = graphene.String()
    richdata = graphene.types.json.JSONString()

class StatisticsType(graphene.AbstractType):
    watch_quantity = graphene.Int()






#-----------------------------------------#

class ContentSimilarityType(graphene.ObjectType):
    movie = graphene.Field("gql.types.MovieType")
    common_tags = graphene.List(graphene.String)

    def __init__(self,base_movie, target_movie):
        self.base = base_movie
        self.target = target_movie
    
    def resolve_movie(self,info):
        return self.target

    def resolve_common_tags(self,info):
        return list(Movie.common_content_tags_of_movies(self.base, self.target))

#-----------------------------------------#

class TagType(DjangoObjectType, StatisticsType):
    movielens_id  = graphene.Int()
    custom_id  = graphene.Int()
    name = graphene.String()
    movies = graphene.List("gql.types.MovieType")
    tag_type = graphene.String()
    quantity = graphene.Int()
    poster = graphene.String()
    slug = graphene.String()
    genre_tag = graphene.Boolean()

    class Meta:
        model = Tag


    def resolve_genre_tag(self, info, *_):
        return self.genre_tag
    def resolve_subgenre_tag(self, info, *_):
        return self.subgenre_tag
    def resolve_phenomenal_tag(self, info, *_):
        return self.phenomenal_tag
    def resolve_theme_tag(self, info, *_):
        return self.theme_tag
    def resolve_form_tag(self, info, *_):
        return self.form_tag
    def resolve_slug(self, info, *_):
        return self.slug

    def resolve_poster(self, info, *_):
        if self.poster:
            return self.poster.url
        return None


    def resolve_quantity(self, info, *_):
        return self.movie_quantity

    def resolve_custom_id(self, info, *_):
        return self.custom_id


    def resolve_movielens_id(self, info, *_):
        return self.movielens_id

    def resolve_name(self, info, *_):
        return self.name

    def resolve_movies(self, info, *_):
        return self.related_movies.all().only("id", "name", "year", "poster")

    def resolve_tag_type(self, info, *_):
        return self.tag_type




class PostType(DjangoObjectType):
    id  = graphene.Int()
    author = graphene.Field("gql.types.ProfileType")
    header  = graphene.String()
    text = graphene.String()

    summary = graphene.String()
    slug = graphene.String()
    poster = graphene.String()

    post_type = graphene.String()
    created_at = graphene.String()
    updated_at = graphene.String()
    active = graphene.Boolean()

    class Meta:
        model = Post

    def resolve_id(self, info, *_):
        return self.id

    def resolve_header(self, info, *_):
        return self.header
        
    def resolve_text(self, info, *_):
        return self.text

    def resolve_summary(self, info, *_):
        return self.summary[:400]



    def resolve_slug(self, info, *_):
        return self.slug

    def resolve_post_type(self, info, *_):
        return self.post_type

    def resolve_poster(self, info, *_):
        try:
            return self.image.url
        except:
            if self.image != None  & self.image != "":
                return "https://cbs-static.s3.amazonaws.com/static/media/" + self.image
            return None

    def resolve_created_at(self, info, *_):
        return str(self.created_at)
    
    def resolve_updated_at(self, info, *_):
        return str(self.updated_at)

    def resolve_active(self, info, *_):
        return self.active

    def resolve_author(self, info, *_):
        return self.author



class FollowType(DjangoObjectType):
    class Meta:
        model=Follow

class CountryType(graphene.ObjectType):
    country = graphene.List(graphene.String)
    

    def __init__(self,code=None, num=None):
        self.code = code
        self.num = num

    def resolve_country(self, info):
        if self.code:
            return dict(countries).get(self.code)
        elif self.num:
            if list(countries)[self.num]:
                c =  list(countries)[self.num]
                return [c.name, c.code]

class VideoType(DjangoObjectType):
    tags = graphene.List(graphene.String)
    isFaved = graphene.Boolean()
    thumb = graphene.String()
    yt_id = graphene.String()

    related_movies = graphene.List("gql.types.CustomMovieType")
    related_persons = graphene.List("gql.types.DirectorPersonMixType")


    class Meta:
        model=Video

    def resolve_yt_id(self, info, *_):
        if self.youtube_id:
            return self.youtube_id
        else:
            url = self.link
            if "youtube" in url:
                try:
                    defer_web = url.split("v=")[1]
                    yt_id = defer_web.split("&")[0]
                    return yt_id
                except:
                    return None            

    def resolve_related_movies(self, info, *_):
        from gql.types import CustomMovieType
        movs = self.related_movies.only("id", "name").all()
        if movs:
            custom_movie_list = [CustomMovieType(x.id) for x in movs]
        else:
            return []

    def resolve_related_persons(self, info, *_):
        from gql.types import DirectorPersonMixType
        return self.related_persons.only("id", "name","poster").all()

    def resolve_thumb(self, info, *_):
        if self.thumbnail:
            return self.thumbnail
        else:
            url = self.link
            if "youtube" in url:
                try:
                    defer_web = url.split("v=")[1]
                    yt_id = defer_web.split("&")[0]
                    v.youtube_id = yt_id
                    v.thumbnail = "https://img.youtube.com/vi/{}/mqdefault.jpg".format(yt_id)
                except:
                    return None


    def resolve_tags(self, info, *_):
        return self.tagss

    def resolve_isFaved(self,info, *_):
        if info.context.user.is_authenticated:
            user= info.context.user
            if self in user.profile.videos.all():
                return True
        return False


class MovieType(DjangoObjectType):
    name = graphene.String()
    poster = graphene.String()

    isBookmarked = graphene.Boolean()

    viewer_rating = graphene.Float()
    data = graphene.types.json.JSONString()
    tags = graphene.List(TagType)
    viewer_points = graphene.Int()
    viewer_notes = graphene.String()
    viewer_rating_date = graphene.types.datetime.Date()
    isFaved = graphene.Boolean()
    prediction_history = graphene.Float()
    cover_poster = graphene.String()
    has_cover = graphene.Boolean()
    slug = graphene.String()
    short_summary = graphene.String()

    class Meta:
        model = Movie
    def resolve_short_summary(self,info):
        return self.get_short_summary()

    def resolve_name(self,info):
        return self.name
    def resolve_slug(self, info, *_):
        if self.slug:
            return self.slug
        else:
            self.add_slug()
            return self.slug

    def resolve_has_cover(self,info):
        if self.cover_poster and hasattr(self.cover_poster, "url"):
            return True
        return False

    def resolve_cover_poster(self, info, *_):
        if self.cover_poster and hasattr(self.cover_poster, "url"):
            return self.cover_poster.url

    def resolve_prediction_history(self, info):
        if info.context.user.is_authenticated:
            profile = info.context.user.profile
            qs = Recommendation.objects.filter(profile=profile, movie=self).order_by("created_at")
            if qs.exists():
                return qs.first().prediction
            else:
                return 0



    def resolve_viewer_rating_date(self, info, *_):
        if info.context.user.is_authenticated:
            profile= info.context.user.profile
            try:
                return profile.rates.get(movie=self).date
            except:
                return ""

    def resolve_viewer_notes(self, info, *_):
        if info.context.user.is_authenticated:
            profile= info.context.user.profile
            try:
                return profile.rates.get(movie=self).notes
            except:
                return ""

            
    def resolve_viewer_points(self, info, *_):
        if info.context.user.is_authenticated:
            profile= info.context.user.profile
            return len(profile.ratings.items())
        return 0
    


    def resolve_poster(self, info, *_):
        if self.poster and hasattr(self.poster, "url"):
            return self.poster.url
        return "https://s3.eu-west-2.amazonaws.com/cbs-static/static/images/default.jpg"


    def resolve_images(self,info, *_):
        return self.images.all()

    def resolve_isBookmarked(self,info, *_):
        if info.context.user.is_authenticated:
            user = info.context.user
            if user.profile in self.bookmarked.all():
                return True
        return False

    def resolve_viewer_rating(self, info, *_):
        if info.context.user.is_authenticated:
            user= info.context.user
            return user.profile.ratings.get(str(self.id))

    def resolve_data(self,info,*_):
        data = self.data
        new_data = {}
        new_data["Plot"] = data.get("Plot")
        new_data["Director"] = data.get("Director")
        new_data["Country"] = data.get("Country")
        new_data["Runtime"] = data.get("Runtime")
        return new_data

    def resolve_tags(self, info, *_):
        return self.tags.all()

    def resolve_isFaved(self,info, *_):
        if info.context.user.is_authenticated:
            user= info.context.user
            if user.profile in self.liked.all():
                return True
        return False

class RecommendationType(DjangoObjectType):
    profile = graphene.Field("gql.types.ProfileType")
    movie = graphene.Field("gql.types.CustomMovieType")
    prediction = graphene.Float()
    class Meta:
        model = Recommendation

    def resolve_movie(self, info):
        return CustomMovieType(id=self.movie.id)



class RatingType(DjangoObjectType):
    movie = graphene.Field(MovieType)
    date = graphene.types.datetime.Date()
    notes = graphene.String()
    rating = graphene.Float()

    class Meta:
        model= Rating

    def resolve_movie(self, info):
        return self.movie

    def resolve_date(self, info, *_):
        return self.date
    def resolve_notes(self, info, *_):
        return self.notes
    def resolve_rating(self, info, *_):
        return self.rating



class PersonType(DjangoObjectType):
    jobs = graphene.List(graphene.String)
    data = graphene.types.json.JSONString()
    poster = graphene.String()
    square_poster = graphene.String()

    isActive = graphene.Boolean()
    isFollowed = graphene.Boolean()
    movies = graphene.List(MovieType)
    slug = graphene.String()



    class Meta:
        model = Person

    def resolve_slug(self, info, *_):
        if self.slug:
            return self.slug
        else:
            self.add_slug()
            return self.slug


    def resolve_jobs(self,info,):
        history=  Crew.objects.filter(person=self).only("job").values_list("job", flat=True).distinct()
        job_list = []
        for x in history:
            if x=="a":
                job_list.append("ACTOR/ACTRESS")
            if x=="d":
                job_list.append("DIRECTOR")
            elif x=="w":
                job_list.append("WRITER")
            elif x=="e":
                job_list.append("EDITOR")
        return job_list

    def resolve_isActive(self,info,*_):
        return self.active

    def resolve_isFollowed(self, info, *_):
        if info.context.user.is_authenticated:
            profile = info.context.user.profile
            qs = self.followers.select_related("profile")
            qs_profiles = [x.profile for x in qs]
            if profile in qs_profiles:
                return True
        return False

    def resolve_data(self,info,*_):
        return self.data

    def resolve_images(self,info, *_):
        return self.images.all()

    def resolve_poster(self, info, *_):
        if self.poster and hasattr(self.poster, "url"):
            return self.poster.url
            """
            self.save_poster_from_url()
            if self.poster and hasattr(self.poster, "url"):
                return self.poster.url
            else:
                return "https://s3.eu-west-2.amazonaws.com/cbs-static/static/images/default.jpg" """


    def resolve_square_poster(self, info, *_):
        if self.square_poster and hasattr(self.square_poster, "url"):
            return self.square_poster.url
    
    def resolve_movies(self, info, *_):
        crew_qs = Crew.objects.filter(person=self).select_related("movie").defer("job","character")
        return list(set([x.movie for x in crew_qs]))

class CrewType(DjangoObjectType):
    person = graphene.Field(PersonType)
    class Meta:
        model = Crew
    
    def resolve_person(self, info, *_):
        return self.person



class DirectorType(DjangoObjectType):
    data = graphene.types.json.JSONString()
    jobs = graphene.List(graphene.String)
    movies = graphene.List(MovieType)
    favourite_movies = graphene.List(MovieType)

    poster = graphene.String()
    square_poster = graphene.String()
    has_cover = graphene.Boolean()
    cover_poster = graphene.String()

    isActive = graphene.Boolean()
    isFollowed = graphene.Boolean()
    lenMovies = graphene.Int()
    viewer_points = graphene.Int()
    
    #Viewer rated movies for this director
    viewer_movies = graphene.List(MovieType)
    #Viewer rated movies for this director's favourite film list
    viewer_favourite_movies = graphene.List(MovieType)
    all_images = graphene.types.json.JSONString()
    slug = graphene.String()


    class Meta:
        model = Person

    def resolve_slug(self, info, *_):
        if self.slug:
            return self.slug
        else:
            self.add_slug()
            return self.slug

    def resolve_all_images(self,info):
        return Person.images_all()
        
    def resolve_jobs(self,info,):
        history=  Crew.objects.filter(person=self).only("job").values_list("job", flat=True).distinct()
        job_list = []
        for x in history:
            if x=="d":
                job_list.append("DIRECTOR")
            elif x=="w":
                job_list.append("WRITER")
            elif x=="e":
                job_list.append("EDITOR")
        return job_list

    def resolve_viewer_favourite_movies(self, info, *_):
        if info.context.user.is_authenticated:
            profile = info.context.user.profile
            profile_rated_movies = profile.rated_movie_list()

            qs_list = List.objects.prefetch_related("movies").filter(list_type="df",
                        related_persons=self, movies__in=profile_rated_movies).only("id","movies", "list_type")
            movie_list = []
            for x in qs_list:
                movie_qs = x.movies.only("id","name","poster","year").all()
                for m in movie_qs:
                    movie_list.append(m)
            return list(set(movie_list))
        else:
            return None

    def resolve_favourite_movies(self, info, *_):
        qs_list = List.objects.prefetch_related("movies").filter(list_type="df",
                    related_persons=self).only("id","movies", "list_type")
        movie_list = []
        for x in qs_list:
            movie_qs = x.movies.only("id","name","poster","year").all()
            for m in movie_qs:
                movie_list.append(m)
        return list(set(movie_list))

    def resolve_viewer_movies(self, info, *_):
        if info.context.user.is_authenticated:
            profile = info.context.user.profile
            profile_rated_movies = profile.rated_movie_list()
            crew_qs = Crew.objects.filter(person=self, movie__in=profile_rated_movies).select_related("movie").defer("job","character")
            return [x.movie for x in crew_qs]
        else:
            return None
            
    def resolve_movies(self, info, *_):
        crew_qs = Crew.objects.filter(person=self).select_related("movie").defer("job","character")
        return list(set([x.movie for x in crew_qs]))

    def resolve_isActive(self,info,):
        return self.active

    def resolve_lenMovies(self,info,*_):
        return Crew.objects.filter(person=self, job="d").count()

    def resolve_isFollowed(self, info, *_):
        if info.context.user.is_authenticated:
            profile = info.context.user.profile
            qs = self.followers.select_related("profile")
            qs_profiles = [x.profile for x in qs]
            if profile in qs_profiles:
                return True
        return False

    def resolve_data(self,info,*_):
        return self.data
    def resolve_images(self,info, *_):
        return self.images.all()

    def resolve_poster(self, info, *_):
        if self.poster and hasattr(self.poster, "url"):
            return self.poster.url
        return "https://s3.eu-west-2.amazonaws.com/cbs-static/static/images/directors-default.jpg"

    def resolve_square_poster(self, info, *_):
        if self.square_poster and hasattr(self.square_poster, "url"):
            return self.square_poster.url

    def resolve_has_cover(self,info):
        if self.cover_poster and hasattr(self.cover_poster, "url"):
            return True
        return False

    def resolve_cover_poster(self, info, *_):
        if self.cover_poster and hasattr(self.cover_poster, "url"):
            return self.cover_poster.url
        return "https://s3.eu-west-2.amazonaws.com/cbs-static/static/images/director-cover-background-default.jpg"

    def resolve_viewer_points(self, info, *_):
        if info.context.user.is_authenticated:
            profile= info.context.user.profile
            return len(profile.ratings.items())
        return 0

class PredictionType(DjangoObjectType):
    class Meta:
        model = Prediction



class UserType(DjangoObjectType):
    class Meta:
        model = get_user_model()
    def resolve_token(self, info, **kwargs):
        return graphql_jwt.shortcuts.get_token(self)

class ListType(DjangoObjectType, SocialMediaType, SEOType):
    image = graphene.List(graphene.String)
    isFollowed = graphene.Boolean()
    viewer_points = graphene.Int()
    followers = graphene.List("gql.types.ProfileType")
    num_movies = graphene.Int()
    poster = graphene.String()
    list_type = graphene.String()
    slug = graphene.String()

    class Meta:
        model=List

    def resolve_seo_title(self, info, *_):
        if self.seo_title == None:
            self.seo_title = f"{self.name} - Pixly"
            self.save()
        return self.seo_title

    def resolve_seo_description(self, info, *_):
        if self.seo_description == None:
            try:
                #self.set_seo_description_keywords()
                return self.seo_description
            except:
                print(f"{self.name} person seo description could not be saved in -> resolve_seo_description ")
                return self.seo_description
        return self.seo_description

    def resolve_seo_keywords(self, info, *_):
        if self.seo_keywords == None:
            try:
                #self.set_seo_description_keywords()
                return self.seo_keywords
            except:
                print(f"{self.name} person seo keywords could not be saved in -> resolve_seo_keywords ")
                return self.seo_keywords
        return self.seo_keywords


    def resolve_slug(self, info, *_):
        return self.slug

    def resolve_list_type(self, info, *_):
        return self.list_type

    def resolve_num_movies(self, info, *_):
        return self.movies.count()
    
    def resolve_poster(self,info):
        if self.liste.poster!="" and self.liste.poster!=None:
            return self.liste.poster.url
        return None

    def resolve_followers(self,info, *_):
        qs = Follow.objects.select_related("profile").filter(liste=self, 
            typeof="l").defer("target_profile","person","updated_at","created_at")
        return [x.profile for x in qs]

    def resolve_image(self, info, *_):
        return self.image

    def resolve_isFollowed(self, info, *_):
        if info.context.user.is_authenticated:
            profile = info.context.user.profile
            qs = self.followers.select_related("profile")
            qs_profiles = [x.profile for x in qs]
            if profile in qs_profiles:
                return True
        return False

    def resolve_viewer_points(self, info, *_):
        if info.context.user.is_authenticated:
            profile= info.context.user.profile
            return len(profile.ratings.items())
        return 0


class TopicType(DjangoObjectType):
    name = graphene.String()
    class Meta:
        model = Topic


class DirectorPersonMixType(DjangoObjectType, SocialMediaType, SEOType, StatisticsType):
    filtered_data = graphene.types.json.JSONString()
    social_media = graphene.types.json.JSONString()

    jobs = graphene.List(graphene.String)
    movies = graphene.List(MovieType)
    favourite_movies = graphene.List(MovieType)
    slug = graphene.String()

    poster = graphene.String()
    square_poster = graphene.String()
    has_cover = graphene.Boolean()
    cover_poster = graphene.String()

    isActive = graphene.Boolean()
    isFollowed = graphene.Boolean()
    lenMovies = graphene.Int()
    viewer_points = graphene.Int()
    
    #Viewer rated movies for this director
    viewer_movies = graphene.List(MovieType)
    #Viewer rated movies for this director's favourite film list
    viewer_favourite_movies = graphene.List(MovieType)

    user_watched_director_quantity = graphene.Int()
    related_lists = graphene.List(ListType)
    quotes = graphene.List(graphene.String)


    class Meta:
        model = Person

    def __init__(self, id=None, watch_quantity=None):
        if id and watch_quantity:
            self = Person.objects.filter(id=id).first()
            self.watch_quantity = watch_quantity
    

    def resolve_quotes(self, info, *_):
        if self.quotes.exists():
            quote_list = [x.text for x in self.quotes.all()]
            return quote_list
        return []

    def resolve_richdata(self, info, *_):
        if not self.richdata:
            self.set_richdata()
            return self.richdata
        return self.richdata
        

    def resolve_seo_title(self, info, *_):
        if self.seo_title == None:
            self.seo_title = f"{self.name} - Pixly"
            self.save()
        return self.seo_title

    def resolve_seo_description(self, info, *_):
        if self.seo_description == None:
            try:
                #self.set_seo_description_keywords()
                return self.seo_description
            except:
                print(f"{self.name} person seo description could not be saved in -> resolve_seo_description ")
                return self.seo_description
        return self.seo_description

    def resolve_seo_keywords(self, info, *_):
        if self.seo_keywords == None:
            try:
                #self.set_seo_description_keywords()
                return self.seo_keywords
            except:
                print(f"{self.name} person seo keywords could not be saved in -> resolve_seo_keywords ")
                return self.seo_keywords
        return self.seo_keywords


    def resolve_seo_short_description(self, info, *_):
        return self.seo_short_description


    def resolve_homepage(self, info, *_):
        return self.homepage

    def resolve_imdb(self, info, *_):
        return self.imdb
    
    def resolve_facebook(self, info, *_):
        return self.facebook

    def resolve_twitter(self, info, *_):
        return self.twitter

    def resolve_instagram(self, info, *_):
        return self.instagram

    def resolve_slug(self, info, *_):
        if self.slug:
            return self.slug
        else:
            self.add_slug()
            return self.slug

    def resolve_related_lists(self,info,):
        return self.related_lists.all()


    def resolve_user_watched_director_quantity(self,info,):
        if info.context.user.is_authenticated:
            movie_ids = [int(x) for x in info.context.user.profile.ratings.keys()]
            crew_qs = Crew.objects.filter(movie__id__in = movie_ids, person=self, job="d")
            return crew_qs.count()
        return 0

    def resolve_jobs(self,info,):
        history=  Crew.objects.filter(person=self).only("job").values_list("job", flat=True).distinct()
        job_list = []
        for x in history:
            if x=="d":
                job_list.append("DIRECTOR")
            elif x=="w":
                job_list.append("WRITER")
            elif x=="e":
                job_list.append("EDITOR")
        return job_list

    def resolve_viewer_favourite_movies(self, info, *_):
        if info.context.user.is_authenticated:
            profile = info.context.user.profile
            profile_rated_movies = profile.rated_movie_list()

            qs_list = List.objects.prefetch_related("movies").filter(list_type="df",
                        related_persons=self, movies__in=profile_rated_movies).only("id","movies", "list_type")
            movie_list = []
            for x in qs_list:
                movie_qs = x.movies.only("id","name","poster","year").all()
                for m in movie_qs:
                    movie_list.append(m)
            return list(set(movie_list))

    def resolve_favourite_movies(self, info, *_):
        qs_list = List.objects.prefetch_related("movies").filter(list_type="df",
                    related_persons=self).only("id","movies", "list_type")
        movie_list = []
        for x in qs_list:
            movie_qs = x.movies.only("id","name","poster","year").all()
            for m in movie_qs:
                movie_list.append(m)
        return list(set(movie_list))

    def resolve_viewer_movies(self, info, *_):
        if info.context.user.is_authenticated:
            profile = info.context.user.profile
            profile_rated_movies = profile.rated_movie_list()
            crew_qs = Crew.objects.filter(person=self, movie__in=profile_rated_movies).select_related("movie").defer("job","character")
            return [x.movie for x in crew_qs]
            
    def resolve_movies(self, info, *_):
        crew_qs = Crew.objects.filter(person=self).select_related("movie").defer("job","character").order_by("movie__imdb_rating")
        crew_movies_list = [x.movie for x in crew_qs]
        person_movies_qs_list = list(self.movies.all())
        result = person_movies_qs_list + crew_movies_list
        return list(set(result))

    def resolve_isActive(self,info,):
        return self.active

    def resolve_lenMovies(self,info,*_):
        return Crew.objects.filter(person=self, job="d").count()

    def resolve_isFollowed(self, info, *_):
        if info.context.user.is_authenticated:
            profile = info.context.user.profile
            qs = self.followers.select_related("profile")
            qs_profiles = [x.profile for x in qs]
            if profile in qs_profiles:
                return True
        return False

    def resolve_filtered_data(self,info,*_):
        person_data = self.data
        filtered_data = {}
        keywords = ["gender", "birthday", "deathday","also_known_as", "place_of_birth"]
        for kw in keywords:
            if person_data.get(kw)!="" and person_data.get(kw)!=None:
                if kw=="also_known_as":
                    filtered_data[kw] = person_data.get(kw)[:2]
                else:
                    filtered_data[kw] = person_data.get(kw)
        return filtered_data

    def resolve_social_media(self,info,*_):
        person_data = self.data
        filtered_data = {"imdb": "https://www.imdb.com/name/{}".format(self.id)}
        keywords = ["homepage", "instagram_id", "facebook_id", "twitter_id"]
        for kw in keywords:
            if person_data.get(kw)!="" and person_data.get(kw)!=None:
                if kw=="twitter_id":
                    filtered_data["twitter"] = "https://twitter.com/{}".format(person_data.get(kw))
                if kw=="instagram_id":
                    filtered_data["instagram"] = "https://www.instagram.com/{}".format(person_data.get(kw))
                if kw=="facebook_id":
                    filtered_data["facebook"] = "https://www.facebook.com/{}".format(person_data.get(kw))
                if kw=="homepage":
                    filtered_data["homepage"] = "https://www.facebook.com/{}".format(person_data.get(kw))
        return filtered_data





    def resolve_poster(self, info, *_):
        if self.poster and hasattr(self.poster, "url"):
            return self.poster.url
        else:
            self.save_poster_from_url()
            if self.poster and hasattr(self.poster, "url"):
                return self.poster.url
            else:
                return "https://s3.eu-west-2.amazonaws.com/cbs-static/static/images/default.jpg"

    def resolve_square_poster(self, info, *_):
        if self.square_poster and hasattr(self.square_poster, "url"):
            return self.square_poster.url

    def resolve_has_cover(self,info):
        if self.cover_poster and hasattr(self.cover_poster, "url"):
            return True
        return False

    def resolve_cover_poster(self, info, *_):
        if self.cover_poster and hasattr(self.cover_poster, "url"):
            return self.cover_poster.url
        return "https://s3.eu-west-2.amazonaws.com/cbs-static/static/images/director-cover-background-default.jpg"

    def resolve_viewer_points(self, info, *_):
        if info.context.user.is_authenticated:
            profile= info.context.user.profile
            return len(profile.ratings.items())
        return 0


class PersonaType(DjangoObjectType):
    class Meta:
        model = Persona

    def resolve_profile(self, info, *_):
        return self.profile


class ProfileType(DjangoObjectType, SocialMediaType, SEOType):
    token = graphene.String()
    is_self = graphene.Boolean()
    avatar = graphene.String()
    country = graphene.List(graphene.String)

    bookmarks = graphene.List(MovieType)
    ratings = graphene.List(RatingType)
    diaries = graphene.List(RatingType)

    latest_ratings = graphene.List(RatingType)
    ratings_movieset = graphene.List(graphene.Int)

    lists = graphene.List(ListType)

    points = graphene.Int()
    num_bookmarks = graphene.Int()
    is_followed = graphene.Boolean()

    favourite_movies = graphene.List(MovieType)
    favourite_videos = graphene.List(VideoType)

    following_lists = graphene.List(ListType)
    following_topics = graphene.List(TopicType)
    following_persons =  graphene.List(PersonType)
    following_profiles =  graphene.List("gql.types.ProfileType")

    followers = graphene.List("gql.types.ProfileType")
    ratingset = graphene.types.json.JSONString()
    recommendations = graphene.List(RecommendationType)

    persona = graphene.Field(PersonaType)
    activities = graphene.List("gql.types.ActivityType")

    cognito_status = graphene.Boolean()

    class Meta:
        model = Profile

    def resolve_seo_title(self, info, *_):
        if self.seo_title == None:
            self.seo_title = f"{self.name} - Pixly"
            self.save()
        return self.seo_title

    def resolve_seo_description(self, info, *_):
        if self.seo_description == None:
            try:
                #self.set_seo_description_keywords()
                return self.seo_description
            except:
                print(f"{self.name} person seo description could not be saved in -> resolve_seo_description ")
                return self.seo_description
        return self.seo_description

    def resolve_seo_keywords(self, info, *_):
        if self.seo_keywords == None:
            try:
                #self.set_seo_description_keywords()
                return self.seo_keywords
            except:
                print(f"{self.name} person seo keywords could not be saved in -> resolve_seo_keywords ")
                return self.seo_keywords
        return self.seo_keywords


    def resolve_activities(self, info):
        QQ = Q(action="rm")
        QQ2 = Q(rating=None)
        return Activity.objects.filter(profile=self).exclude(Q(QQ & QQ2)).order_by("-created_at")[:50]
        


    def resolve_persona(self, info):
        if self.persona:
            return self.persona
        return None

    def resolve_recommendations(self, info):
        rec_qs = Recommendation.get_recommendations(self)
        return rec_qs

    def resolve_ratingset(self, info):
        return self.ratings

    def resolve_avatar(self, info, *_):
        if self.avatar and hasattr(self.avatar, "url"):
            return self.avatar.url
        return "https://s3.eu-west-2.amazonaws.com/cbs-static/static/images/user-avatar.svg"

    def resolve_latest_ratings(self, info, *_):
        return self.rates.select_related("movie").order_by("-created_at")[:5]

    def resolve_country(self, info, *_):
        if self.country and hasattr(self.country, "name"):
            return [self.country.name, self.country.code]

    def resolve_is_self(self, info, *_):
        user = info.context.user
        if user.username == self.username:
            return True
        return False

    def resolve_bookmarks(self, info, *_):
        return self.bookmarks.all().defer(*movie_defer)

    def resolve_ratings(self, info, *_):
        return self.rates.select_related("movie").order_by("-created_at").all()
        #return Rating.objects.select.related("movie").filter(profile=self).all()
        

    def resolve_diaries(self, info, *_):
        q_filter = Q(date__isnull=False)
        my_diaries = self.rates.filter(q_filter).select_related("movie").order_by("-date")
        return my_diaries



    def resolve_ratings_movieset(self, info, *_):
        if is_owner(self,info):
            return self.rates.values_list("movie_id",flat=True)
        raise("Not owner of rates")

    def resolve_lists(self, info, *_):
        if is_owner(self,info):
            return self.lists.all().defer("movies", "reference_notes", "related_persons")
        return self.lists.filter(public=True).defer("movies", "reference_notes", "related_persons")

    def resolve_points(self, info):
        return len(self.ratings.items())

    def resolve_num_bookmarks(self, info):
        return len(self.ratings.items())

    def resolve_is_followed(self, info, *_):
        if info.context.user.is_authenticated:
            profile = info.context.user.profile
            qs = Follow.objects.filter(profile=profile, target_profile=self, typeof="u")
            if qs:
                return True
            return False

    def resolve_favourite_movies(self, info, *_):
        qs = self.liked_movies.all().defer("imdb_id","imdb_rating","summary",
                "tmdb_id","director","data", "tags")
        return  qs

    def resolve_favourite_videos(self, info, *_):
        qs = self.videos.defer("duration","channel_url","channel_name",
                "related_persons","related_movies","tags").all()
        return  qs


    def resolve_following_lists(self, info, *_):
        qs = Follow.objects.select_related("liste").filter(profile=self,
            typeof="l").defer("target_profile","person","topic","liste__movies",
            "updated_at","created_at")
        return [x.liste for x in qs]

    def resolve_following_topics(self, info, *_):
        qs = Follow.objects.select_related("topic").filter(profile=self,
            typeof="t").defer("target_profile","person","liste",
            "updated_at","created_at")
        return [x.topic for x in qs]

    def resolve_following_persons(self, info, *_):
        qs = Follow.objects.select_related("person").filter(profile=self,
            typeof="p").defer("target_profile","topic","liste",
            "updated_at","created_at")
        return [x.person for x in qs]
            
    def resolve_following_profiles(self, info, *_):
        qs = Follow.objects.select_related("target_profile").filter(profile=self,
            typeof="u").defer("person","topic","liste","updated_at","created_at")
        return [x.target_profile for x in qs]



    def resolve_followers(self, info, *_):
        qs = Follow.objects.select_related("profile").filter(target_profile=self,
            typeof="u").defer("person","topic","liste","updated_at","created_at")
        return [x.profile for x in qs]


class MovieListType(DjangoObjectType):
    is_self = graphene.Boolean()
    image = graphene.types.json.JSONString()
    images_all = graphene.types.json.JSONString()

    isFollowed = graphene.Boolean()
    viewer_points = graphene.Int()

    followers = graphene.List("gql.types.ProfileType")
    num_followers = graphene.Int()
    child_movies = graphene.List(MovieType)
    length = graphene.Int()
    description = graphene.String()
    poster = graphene.String()
    slug = graphene.String()

    class Meta:
        model=List
    def resolve_slug(self, info, *_):
        return self.slug

    def resolve_images_all(self, info, *_):
        return self.images_all

    def resolve_poster(self,info):
        if self.poster!="" and self.poster!=None:
            return self.poster.url
        return None

    def resolve_is_self(self, info):
        if info.context.user.is_authenticated:
            if self.owner.username==info.context.user.username:
                return True
        return False
    
    def resolve_description(self, info, *_):
        if info.context.user.is_authenticated:
            profile = info.context.user.profile
            #if private
            if not self.public:
                if self.owner==profile:
                    return self.summary
                else:
                    return "This is a private list"
            return self.summary

    def resolve_length(self, info, *_):
        return self.movies.count()

    def resolve_child_movies(self, info, *_, **kwargs):
        if info.context.user.is_authenticated:
            profile = info.context.user.profile
            #if private
            if not self.public:
                if self.owner==profile:
                    qs = self.movies.all().defer(*movie_defer)
                    return qs
                if self.owner!=profile:
                    return []
            return self.movies.all().defer(*movie_defer)


    def resolve_followers(self,info, *_):
        qs = Follow.objects.select_related("profile").filter(liste=self, 
            typeof="l").defer("target_profile","person","topic","updated_at","created_at")
        return [x.profile for x in qs]

    def resolve_num_followers(self,info, *_):
        qs = Follow.objects.filter(liste=self, typeof="l")
        return qs.count()

    def resolve_image(self, info, *_):
        return self.image

    def resolve_isFollowed(self, info, *_):
        if info.context.user.is_authenticated:
            profile = info.context.user.profile
            qs = self.followers.select_related("profile")
            qs_profiles = [x.profile for x in qs]
            if profile in qs_profiles:
                return True
        return False


class ActivityType(DjangoObjectType):
    profile = graphene.Field("gql.types.ProfileType")
    target_profile = graphene.Field("gql.types.ProfileType")

    action = graphene.String()
    action_type = graphene.String()
    target_object = graphene.String()
    rating = graphene.Float()

    movie = graphene.Field("gql.types.CustomMovieType")
    person = graphene.Field("gql.types.DirectorPersonMixType")
    liste = graphene.Field("gql.types.ListType")


    class Meta:
        model=Activity

    def resolve_profile(self, info, *_):
        return self.profile

    def resolve_action(self, info, *_):
        return self.action
    
    def resolve_action_type(self, info, *_):
        # rating, bookmark, follow, like
        if self.action=="rm":
            return "rating"
        elif self.action=="bm":
            return "bookmark"
        elif self.action.startswith("f"):
            return "follow"
        elif self.action.startswith("l"):
            return "like"
        


    def resolve_target_object(self, info, *_):
        #profile, movie, person, liste
        if self.action=="fu":
            return "profile"
        elif self.action=="rm" or self.action=="bm" or self.action=="lm":
            return "movie"
        elif self.action=="fp":
            return "person"
        elif self.action=="fl":
            return "liste"

    def resolve_target_profile(self, info, *_):
        if self.target_profile_username:
            return Profile.objects.get(username=self.target_profile_username)
        return None

    def resolve_movie(self, info, *_):
        if self.movie_id:
            return CustomMovieType(id=self.movie_id)
        return None
    
    def resolve_rating(self,info):
        if self.action=="rm":
            return self.rating
        return None

    def resolve_person(self, info, *_):
        if self.person_id:
            return Person.objects.get(id=self.person_id)
        return None
    
    def resolve_liste(self, info, *_):
        if self.liste_id:
            return List.objects.get(id=self.liste_id)
        return None


class CustomListType(graphene.ObjectType, SocialMediaType, SEOType,StatisticsType):
    id = graphene.Int()
    name = graphene.String()
    summary = graphene.String()
    list_type = graphene.String()

    owner = graphene.Field(ProfileType)
    is_self = graphene.Boolean()
    
    movies = graphene.List(MovieType)
    movieset = graphene.List(graphene.Int)
    num_movies = graphene.Int()

    image = graphene.List(graphene.String)
    images_all = graphene.List(graphene.String)

    followers = graphene.List(ProfileType)
    viewer = graphene.Field(ProfileType)

    isFollowed = graphene.Boolean()
    num_followers = graphene.Int()

    reference_notes = graphene.String()
    reference_link= graphene.String()
    related_persons = graphene.List(DirectorPersonMixType)
    poster = graphene.String()
    cover_poster = graphene.String()
    large_cover_poster = graphene.String()

    slug = graphene.String()

    def __init__(self,id=None,slug=None,page=None, first=None, skip=None, viewer=None, watch_quantity=None):
        if page:
            self.page = page
            self.first = settings.PER_PAGE_ITEM
            self.skip = ((self.page - 1 ) * settings.PER_PAGE_ITEM)
        else:
            self.first = first
            self.skip = skip
        if slug:
            self.slug = slug
            self.liste = List.objects.filter(slug=slug).first()
            self.id = self.liste.id
        elif id:
            self.id = id
            self.liste = List.objects.filter(id=id).first()
            self.slug= self.liste.slug
        if watch_quantity:
            self.watch_quantity = watch_quantity
        self.viewer = viewer
        self.summary = self.liste.summary


    def resolve_richdata(self, info, *_):
        if not self.liste.richdata:
            self.liste.set_richdata()
            return self.liste.richdata
        return self.liste.richdata

    def resolve_seo_title(self, info, *_):
        if self.liste.seo_title == None:
            self.liste.seo_title = f"{self.liste.name} - Pixly"
            self.liste.save()
        return self.liste.seo_title

    def resolve_seo_description(self, info, *_):
        if self.liste.seo_description == None:
            try:
                #self.liste.set_seo_description_keywords()
                return self.liste.seo_description
            except:
                print(f"{self.liste.name} person seo description could not be saved in -> resolve_seo_description ")
                return self.liste.seo_description
        return self.liste.seo_description

    def resolve_seo_short_description(self, info, *_):
        if self.liste.seo_short_description == None:
            try:
                #self.liste.set_seo_description_keywords()
                return self.liste.seo_short_description
            except:
                print(f"{self.liste.name} person seo description could not be saved in -> resolve_seo_description ")
                return self.liste.seo_short_description
        return self.liste.seo_short_description

    def resolve_seo_keywords(self, info, *_):
        if self.liste.seo_keywords == None:
            try:
                self.liste.set_seo_description_keywords()
                return self.liste.seo_keywords
            except:
                print(f"{self.liste.name} person seo keywords could not be saved in -> resolve_seo_keywords ")
                return self.liste.seo_keywords
        return self.liste.seo_keywords



    def resolve_slug(self, info, *_):
        return self.liste.slug

    def resolve_poster(self,info):
        if self.liste.poster!="" and self.liste.poster!=None:
            return self.liste.poster.url
        return None

    def resolve_cover_poster(self,info):
        if self.liste.cover_poster!="" and self.liste.cover_poster!=None:
            return self.liste.cover_poster.url
        return None

    def resolve_large_cover_poster(self,info):
        if self.liste.large_cover_poster!="" and self.liste.large_cover_poster!=None:
            return self.liste.large_cover_poster.url
        return None

    def resolve_reference_notes(self, info, *_):
        return self.liste.reference_notes


    def resolve_related_persons(self, info, *_):
        return self.liste.related_persons.all()

    def resolve_reference_link(self, info, *_):
        return self.liste.reference_link

    def resolve_list_type(self, info):
        if self.liste.list_type!=None:
            return self.liste.list_type

    def resolve_viewer(self, info):
        if self.viewer:
            return self.viewer

    def resolve_name(self, info, *_):
        return self.liste.name

    def resolve_summary(self, info, *_):
        return self.liste.summary

    def resolve_owner(self, info, *_):
        return self.liste.owner

    def resolve_movies(self, info):
        if self.first:
            return self.liste.movies.defer(*movie_defer).all()[self.skip : self.skip + self.first]
        return self.liste.movies.defer(*movie_defer).all()

    def resolve_movieset(self, info):
        return self.movies.values_list("id", flat=True)

    def resolve_num_movies(self, info, *_):
        return self.liste.movies.count()

    def resolve_is_self(self, info):
        if info.context.user.is_authenticated:
            if self.liste.owner==info.context.user.profile:
                return True
        return False
    


    def resolve_followers(self,info, *_):
        folls = Follow.objects.filter(liste=self.liste, typeof="l").select_related("profile")
        return [ x.profile for x in folls]

    def resolve_num_followers(self,info, *_):
        return self.liste.followers.count()

    def resolve_image(self, info, *_):
        return self.liste.image

    def resolve_images_all(self, info, *_):
        return self.liste.images_all

    def resolve_isFollowed(self, info, *_):
        if info.context.user.is_authenticated:
            profile = info.context.user.profile
            qs = self.liste.followers.select_related("profile")
            qs_profiles = [x.profile for x in qs]
            if profile in qs_profiles:
                return True
        return False



class CustomMovieType(graphene.ObjectType, SocialMediaType, SEOType):
    id = graphene.Int()
    name = graphene.String()
    summary = graphene.String()
    year = graphene.Int()

    poster = graphene.String()
    has_cover = graphene.Boolean()
    cover_poster = graphene.String()


    data = graphene.types.json.JSONString()
    imdb_rating = graphene.Float()
    videos = graphene.List(VideoType)
    director = graphene.List(PersonType)
    crew = graphene.List(CrewType)

    isBookmarked = graphene.Boolean()
    isFaved = graphene.Boolean()
    #liked = graphene.List(ProfileType)
    prediction = graphene.Float()
    viewer = graphene.Field(ProfileType)
    viewer_rating = graphene.Float()
    viewer_points = graphene.Int()
    viewer_notes = graphene.String()
    viewer_rating_date = graphene.types.datetime.Date()
    appears = graphene.List(ListType)

    similars = graphene.List(MovieType)
    content_similars = graphene.List(ContentSimilarityType)
    tags = graphene.List(TagType)
    slug = graphene.String()

    social_media = graphene.types.json.JSONString()
    quotes = graphene.List(graphene.String)
    short_summary = graphene.String()


    def __init__(self, id=None, slug=None, viewer=None):
        #print(self,  id, slug)
        self.id = id
        self.slug = slug
        if self.slug:
            self.movie = Movie.objects.only("id", "slug").get(slug=slug)
            self.id = self.movie.id
        elif self.id:
            mqs = Movie.objects.filter(id=id).only("id", "slug")
            self.movie = mqs.first()
            self.slug = self.movie.slug
        self.homepage = self.movie.homepage
        self.facebook = self.movie.facebook
        self.twitter = self.movie.twitter
        self.instagram = self.movie.instagram
        #self.seo_title= self.movie.seo_title
        #self.seo_description = self.movie.seo_description
            
        self.viewer = viewer #Profile

    def resolve_short_summary(self,info):
        return self.movie.get_short_summary()

    def resolve_quotes(self, info, *_):
        if self.movie.quotes.exists():
            quote_list = [x.text for x in self.movie.quotes]
            return quote_list
        return []



    #   !!! OPTIMIZE LATER
    def resolve_content_similars(self, info, *_):
        qs = self.movie.content_similar_object.all()
        if qs.exists():
            content_object = qs.first()
            similars = content_object.similars.all().defer("data", "director", "videos")
            return [ContentSimilarityType(self.movie, x) for x in similars if len(self.movie.common_content_tags(x)) > 0 ] 


    def resolve_richdata(self, info, *_):
        if not self.movie.richdata:
            try:
                self.movie.set_richdata()
                return self.movie.richdata
            except:
                return None
        return self.movie.richdata
        

    def resolve_seo_title(self, info, *_):
        return f"{self.movie.name} ({self.movie.year}) and Similar Movies - Pixly "
        #if self.movie.seo_title == None:
        #    self.movie.seo_title = f"{self.movie.name} ({self.movie.year}) and Similar Movies - Pixly "
        #    self.movie.save()
        #return self.movie.seo_title

    def resolve_seo_description(self, info, *_):
        if self.movie.seo_description == None:
            try:
                #self.movie.set_seo_description_keywords()
                return self.movie.seo_description
            except:
                print(f"{self.movie.name} description could not be saved in -> resolve_seo_description ")
                return self.movie.seo_description
        return self.movie.seo_description

    def resolve_seo_short_description(self, info, *_):
        dsc =  f"Discover similar movies like '{self.movie.name}'. Movies with similar contents with {self.movie.name}."
        dsc = dsc + f" People who like {self.movie.name} also like these films..."
        dsc = dsc + f"Cast and Videos about {self.movie.name}."
        return dsc
        #return self.movie.seo_short_description

    def resolve_seo_keywords(self, info, *_):
        if self.movie.seo_keywords == None:
            try:
                self.movie.set_seo_description_keywords()
                return self.movie.seo_keywords
            except:
                print(f"{self.movie.name} description could not be saved in -> resolve_seo_keywords ")
                return self.movie.seo_keywords
        return self.movie.seo_keywords

    def resolve_homepage(self, info, *_):
        return self.movie.homepage

    def resolve_imdb(self, info, *_):
        return self.movie.imdb
    
    def resolve_facebook(self, info, *_):
        return self.movie.facebook

    def resolve_twitter(self, info, *_):
        return self.movie.twitter

    def resolve_instagram(self, info, *_):
        return self.movie.instagram



    def resolve_slug(self, info, *_):
        if self.movie.slug:
            return self.movie.slug
        else:
            self.movie.add_slug()
            return self.movie.slug

    def resolve_tags(self,info):
        return self.movie.tags.all()

    def resolve_name(self,info):
        return self.movie.name

    def resolve_summary(self,info):
        return self.movie.summary

    def resolve_year(self,info):
        return self.movie.year

    def resolve_similars(self, info):
        if info.context.user.is_authenticated:
            viewer_ratings = [int(x) for x in set(self.viewer.ratings.keys())]
            sim_p = MovSim.get_by_acs(self.id, exclude=viewer_ratings)
            sim_acs = MovSim.get_by_pearson(self.id, exclude=viewer_ratings)
            similar_set = list(set(set(sim_p).union(set(sim_acs))))[:6]

            #filtered_from_already_rateds = similar_set.difference(viewer_ratings)
            #will_recommend = [CustomMovieType(id=x) for x in  filtered_from_already_rateds]
            return Movie.objects.filter(id__in=similar_set).exclude(poster="")
        else:
            sim_p = MovSim.get_by_acs(self.id)
            sim_acs = MovSim.get_by_pearson(self.id)
            similar_set = list(set(set(sim_p).union(set(sim_acs))))[:6]

            #filtered_from_already_rateds = similar_set.difference(viewer_ratings)
            #will_recommend = [CustomMovieType(id=x) for x in  filtered_from_already_rateds]
            return Movie.objects.filter(id__in=similar_set).exclude(poster="")
        
        

    def resolve_imdb_rating(self, info):
        if self.movie.imdb_rating:
            return self.movie.imdb_rating

    def resolve_prediction(self, info, compute=False):
        #CHECK IF AUTHENTICATED
        if not info.context.user.is_authenticated:
            return None
        profile = info.context.user.profile

        #CHECK IF PROFILE HAS ACTIVE PROFILE
        record_quantity = Recommendation.objects.filter(profile=profile).count()
        if not profile.can_predict(target=self.movie):
            return None

        #CHECK IF PREDICTION EXISTS
        record = Recommendation.objects.filter(movie=self.movie, profile=profile)
        if record.exists():
            return record.first().prediction

        #COMPUTE NEW PREDICTION
        elif not record.exists() and compute==True:
            new_prediction = profile.persona.prediction(movie_id = self.movie.id)
            if new_prediction>0.5:
                new_record = Recommendation(profile=profile, movie=self.movie, prediction=new_prediction, points=profile.points)
                try:
                    new_record.save()
                except:
                    print("New Recommendation Record could not be saved!")
                finally:
                    return new_prediction
            return None
        return None


    def resolve_poster(self,info):
        if self.movie.poster!="" and self.movie.poster!=None:
            return self.movie.poster.url
        else:
            return "https://s3.eu-west-2.amazonaws.com/cbs-static/static/images/default.jpg"
        #else:
        #    self.movie.save_poster_from_url()
        #    if self.movie.poster!="" and self.movie.poster!=None:
        #        return self.movie.poster.url
        #    return "https://s3.eu-west-2.amazonaws.com/cbs-static/static/images/default.jpg"

    def resolve_has_cover(self,info):
        if self.movie.cover_poster and hasattr(self.movie.cover_poster, "url"):
            return True
        return False

    def resolve_cover_poster(self, info, *_):
        if self.movie.cover_poster and hasattr(self.movie.cover_poster, "url"):
            return self.movie.cover_poster.url

    def resolve_data(self,info,*_):
        data = self.movie.data
        new_data = {}
        new_data["imdb_id"] = self.movie.imdb_id
        new_data["tmdb_id"] = self.movie.tmdb_id
        if TmdbMovie.objects.filter(tmdb_id=self.movie.tmdb_id).exists():
            tmovie = TmdbMovie.objects.filter(tmdb_id=self.movie.tmdb_id)[0]
            new_data["plot"] = tmovie.data.get("plot")
            new_data["director"] = tmovie.data.get("Director")
            new_data["country"] = tmovie.data.get("Country")
            new_data["runtime"] = tmovie.data.get("Runtime")
            new_data["website"] = tmovie.data.get("Website")
        else:
            new_data["plot"] = data.get("Plot")
            new_data["director"] = data.get("Director")
            new_data["country"] = data.get("Country")
            new_data["runtime"] = data.get("Runtime")
            new_data["website"] = data.get("Website")
        if self.movie.imdb_rating:
            new_data["imdb_rating"] = str(self.movie.imdb_rating)

        return {k:v for k,v in new_data.items() if v!=None}


    def resolve_videos(self, info):
        qs = self.movie.videos.all()
        return qs


    def resolve_director(self, info):
        qs = Crew.objects.filter(movie=self.movie, job="d")
        if qs.count()>=1:
            return [x.person for x in qs]

        elif qs.count()==0:
            if self.movie.data.get("Director"):
                if Person.objects.filter(name=self.movie.data.get("Director"), job="d").count()==1:
                    return Person.objects.filter(name=self.movie.data.get("Director"), job="d")
        else:
            return []


    def resolve_crew(self, info):
        qs = Crew.objects.filter(movie=self.movie, job__in=["a","d"]).exclude(person__poster__exact='')
        qs_list = list(qs)
        if not qs.filter(job="d").exists():
            if self.movie.director:
                if Crew.objects.filter(person=self.movie.director, job="d").exists():
                    qs_list.append( Crew.objects.filter(person=self.movie.director, job="d")[0] )
        return qs_list

    def resolve_isBookmarked(self,info, *_):
        if info.context.user.is_authenticated:
            user = info.context.user
            if user.profile in self.movie.bookmarked.only("username", "id").all():
                return True
        return False

    def resolve_isFaved(self,info, *_):
        if self.viewer and self.viewer in self.movie.liked.only("id", "username").all():
            return True
        return False

    def resolve_viewer(self, info):
        if self.viewer:
            return self.viewer
        return None

    def resolve_viewer_rating(self, info, *_):
        if info.context.user.is_authenticated:
            user= info.context.user
            return user.profile.ratings.get(str(self.id))
        else:
            return None

    def resolve_viewer_rating_date(self, info, *_):
        if info.context.user.is_authenticated:
            profile= info.context.user.profile
            try:
                return profile.rates.get(movie=self.movie).date
            except:
                return None

    def resolve_viewer_notes(self, info, *_):
        if info.context.user.is_authenticated:
            profile= info.context.user.profile
            try:
                return profile.rates.get(movie=self.movie).notes
            except:
                return ""

    def resolve_viewer_points(self, info, *_):
        if info.context.user.is_authenticated:
            profile= info.context.user.profile
            return len(profile.ratings.items())
        return 0
    
    def resolve_appears(self, info):
        qs = self.movie.lists.filter(list_type="df").defer("movies")
        return qs



class MainPageType(graphene.ObjectType, SEOType):
    movies = graphene.List(CustomMovieType)
    lists = graphene.List(CustomListType)
    persons = graphene.List(DirectorPersonMixType)


    def resolve_movies(self, info, *_):
        mqs = Movie.objects.filter(main_page=True).values_list("slug", flat=True)
        return [CustomMovieType(slug=x) for x in mqs]
        


    def resolve_lists(self, info, *_):
        lqs =  List.objects.filter(main_page=True).values_list("slug", flat=True)
        return [CustomListType(slug=x) for x in lqs]



    def resolve_persons(self, info, *_):
        pqs = Person.objects.filter(main_page=True).values_list("slug", flat=True)
        return Person.objects.filter(slug__in=pqs)




class AdvanceSearchType(graphene.ObjectType):
    quantity = graphene.Int()
    advance_query_result = graphene.List(MovieType)



    def __init__(self,kwargs):
        self.movie_name = kwargs.get("movie_name")
        self.year = kwargs.get("year")
        self.min_year = kwargs.get("min_year")
        self.max_year = kwargs.get("max_year")
        self.min_rating = kwargs.get("min_rating")
        self.max_rating = kwargs.get("max_rating")
        self.tag_movielens_ids = kwargs.get("tag_movielens_ids")
        self.tag_custom_ids = kwargs.get("tag_custom_ids")

        self.first = kwargs.get("first")
        self.skip = kwargs.get("skip")


    def advance_query(self):        
        min_year = self.min_year if self.min_year!=None else 1800
        max_year = self.max_year if self.max_year!=None else 2025
        year = self.year 
        min_rating = self.min_rating if self.min_rating!=None else 1
        max_rating = self.max_rating if self.max_rating!=None else 10

        movielens_ids = self.tag_movielens_ids
        custom_ids = self.tag_custom_ids


        #print(year, min_year, max_year, min_rating, max_rating, first, skip)
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
        else:
            qs = Movie.objects.all().defer("summary", "director", "data")


        if year!=None:
            qs = qs.filter(year=year)
        elif min_year!=None and max_year!=None:
            qs = qs.filter(year__gte=min_year, year__lte=max_year)

        #MIN-MAX YEAR FILTER

        #IMDB RATING FILTER
        qs = qs.filter(imdb_rating__gte=min_rating, imdb_rating__lte=max_rating)
        qs = qs.order_by("-year")
        self.quantity = qs.count()
        
        return qs


    def resolve_advance_query_result(self, info):
        query = self.advance_query()
        #PAGINATE
        if self.first!=None and self.skip!=None:
            return query[self.skip : self.first + self.skip]
        #FIRST PAGE
        return query[:50]

    def resolve_quantity(self, info):
        if self.quantity:
            return self.quantity
        return 0






class CustomSearchType(graphene.ObjectType):
    movies = graphene.List(MovieType)
    length = graphene.Int()
    viewer = graphene.Field(ProfileType)
    def __init__(self, search, first=None, skip=None, viewer=None):
        self.search = search
        self.first = first
        self.skip = skip
        self.count = 0
        self.viewer = viewer

    def resolve_length(self,info):
        return self.count

    def resolve_movies(self, info, **kwargs):
        first = self.first
        skip = self.skip
        search = self.search
        words = multi_word_search(search)
        if len(words)==1:
            filter = ( Q(name__icontains=words[0]) )
            result = Movie.objects.defer(*movie_defer).filter(filter)
            self.count += result.count()
            if first:
                return result[skip : skip + first]
            else:
                return result

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
            self.count += result.count()
            if first:
                return result[ skip : skip + first ]

            else:
                return result

    def resolve_viewer(self):
        return self.viewer



"""
class CustomPersonType(graphene.ObjectType):
    person = graphene.Field(DirectorPersonMixType)
    watch_quantity = graphene.Int()

    def __init__(self,id=None,slug=None, viewer=None, watch_quantity=None):
        if slug:
            self.slug = slug
            self.person = Person.objects.filter(slug=slug).first()
            self.id = self.person.id
        elif id:
            self.id = id
            self.person = Person.objects.filter(id=id).first()
            self.slug= self.person.slug
        if watch_quantity:
            self.watch_quantity = watch_quantity
"""


"""


class PersonaInterface(graphene.Interface):
    user = graphene.Field("gql.types.UserType", required=True)
    recommendations = graphene.List(RecommendationType)
    directors_most = graphene.List(DirectorPersonMixType)
    
    feed = graphene.List(ActivityType)

    def resolve_recommendations(self, info, *_):
        records = Recommendation.get_recommendations(profile=self.user.profile)
        return records

    def resolve_directors_most(self, info):
        from collections import Counter
        cqs = Crew.objects.filter(movie__id__in=list(self.user.profile.ratings.keys()), job="d")
        director_list = [x.person for x in cqs]
        mosts = Counter(director_list).most_common(5)
        return [d[0] for d in mosts]

    def resolve_feed(self, info, *_, **kwargs):
        target_profiles_qs = Follow.objects.select_related("target_profile").filter(profile=self.user.profile,
            typeof="u").only("profile","target_profile", "typeof")
        target_profiles = [x.target_profile for x in target_profiles_qs]

        return Activity.objects.filter(profile__in=target_profiles)[:20]

    #deprecated
    def resolve_followingRatings(self, info):
        followed_profiles = Follow.objects.select_related("target_profile").filter(profile=self.user.profile, typeof="u").defer("liste", "person", "topic")
        if followed_profiles.exists():
            fp = [x.target_profile for x in followed_profiles]
            print(fp)
            qsr = Rating.objects.filter(profile__in=fp).order_by("-created_at")[:20]
            return qsr
        return []

class FollowType(DjangoObjectType):
    =  graphene.List(PersonType)

    class Meta:
        model = Follow

def resolve_poster(self, info, *_):
        if self.poster and hasattr(self.poster, "url"):
            return self.poster.url
        else:
            if self.data.get("tmdb_poster_path"):
                return self.data.get("tmdb_poster_path")
            else:
                return "https://s3.eu-west-2.amazonaws.com/cbs-static/static/images/directors-default.jpg" 
"""