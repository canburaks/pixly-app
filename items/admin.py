from django.contrib import admin
from import_export.admin import ImportExportModelAdmin
from .models import Video, VideoList, List, Movie, Topic, TopicItem, Article, Rating, Prediction, Tag, Award, Quote,MovieGroup
from archive.models import ContentSimilarity
from persons.models import Crew
from items.resources import TagResource, VideoResource
from django import forms

class VideoMovieInline(admin.TabularInline):
    model = Video.related_movies.through
    #filter_horizontal = ("id",)
    #extra =1

class TagInline(admin.TabularInline):
    model = Tag.related_movies.through

class TagVideoInline(admin.TabularInline):
    model = Tag.related_videos.through
    #raw_id_fields = ("tag",  )
    exclude = ("related_movies","related_lists", )

class TagTopicInline(admin.StackedInline):
    model = Tag.topics.through
    #raw_id_fields = ("tag",  )
    #exclude = ("related_movies","related_lists", )

class MovieTagInline(admin.StackedInline):
    model = Movie.tags.through
    #raw_id_fields = ("tag",  )
    #exclude = ("related_movies","related_lists", )

     


class CrewInline(admin.TabularInline):
    model = Crew
    #readonly_fields = ('get_person_name',)
    raw_id_fields = ("person",)
    #list_display = ("person__name",)
    fields = ("job","person",  )
    exclude = ("data",)
    def get_person_name(self, obj):
        print(obj)
        return "retrun"

class ContentSimilarInline(admin.TabularInline):
    model = ContentSimilarity
    #readonly_fields = ('get_person_name',)
    raw_id_fields = ("similars",)
    #list_display = ("person__name",)
    #fields = ("job","person",  )
    #exclude = ("data",)


class CrewStackInline (admin.StackedInline):
    model = Crew
    #readonly_fields = ("person__name",)
    raw_id_fields = ("person",)
    #list_display = ("person__name",)
    fields = ("job","person",  )
    exclude = ("data",)
    def get_person_name(self, obj):
        #print(obj)
        return "retrun"

class ListMovieInline(admin.TabularInline):
    model = List.movies.through

class TopicMovieInline(admin.TabularInline):
    model = Topic.movies.through

class ArticleMovieInline(admin.TabularInline):
    model = Article.related_movies.through

class ArticleMovieInline(admin.TabularInline):
    model = Article.related_movies.through


#####################################################################
## TOPICS

class TopicItemStackInline(admin.StackedInline):
    model = TopicItem
    #readonly_fields = ("person__name",)
    raw_id_fields = ("movie","persons")
    #list_display = ("person__name",)
    fields = ("header","movie", "rank", "html_content", "cover_poster", "poster", "persons" )
    ordering = ("rank",)
    

class TagTopicInline(admin.StackedInline):
    model = Tag.topics.through
    #raw_id_fields = ("tag",  )
    #exclude = ("related_movies","related_lists", )

@admin.register(Topic)
class TopicAdmin(admin.ModelAdmin):
    list_display = ("id", "main_page" ,"slug",'name', "summary", "content", "searchable","is_newest")

    raw_id_fields = ['movies','persons', "tags", "quotes"]
    fields = (
        "id", "slug", "name", "short_name", "seo_title", "seo_description",
        "is_ordered", "main_page", "is_newest", "important_page", "searchable",
        "is_article","is_published","show_html_content2",
        "summary", "html_content","html_content2","html_content3", "movies", "quotes",
        "poster", "cover_poster", "hero_poster", "references",
    )
    inlines = [TopicItemStackInline]


@admin.register(TopicItem)
class TopicItemsAdmin(admin.ModelAdmin):
    list_display = ("movie", "rank", "topic")
    raw_id_fields = ['movie',]


################################################################################
@admin.register(MovieGroup)
class MovieGroupAdmin(admin.ModelAdmin):
    list_display = ("slug", "name")
    raw_id_fields = ['movies', "topics",]

class MovieGroupStackInline(admin.StackedInline):
    model = MovieGroup
    #readonly_fields = ("person__name",)
    raw_id_fields = ("movies","topics")
    #list_display = ("person__name",)
    fields = ("slug", "name", "html_content",  "movies", "topics", "cover_poster", "poster", )
    ordering = ("slug",)





@admin.register(Movie)
class MovieAdmin(admin.ModelAdmin):
    list_display = ("id",'name',"year","release" ,"imdb_id","tmdb_id", "imdb_rating","created_at")
    raw_id_fields = ['tags',]
    readony_fields = ("homepage", "twitter","facebook", "instagram", "imdb",)
    exclude = ('data', "director")
    list_filter = ("main_page", "important_page")
    inlines = [TagInline,CrewStackInline,ContentSimilarInline]
    search_fields = ('name', "tmdb_id", 'id', )



#####################################################################
@admin.register(Award)
class AwardAdmin(admin.ModelAdmin):
    list_display = ("year", "award" ,"movie","person")

    raw_id_fields = ["movie",'movies', "person", 'persons',]
# Register your models here.
@admin.register(List)
class ListAdmin(admin.ModelAdmin):
    list_display = ("id",'name', "owner", "updated_at", "content")
    raw_id_fields = ['movies', "owner", "related_persons"]
    list_select_related = ('owner',)
    list_filter = ('list_type', "is_newest")
    #exclude = ('related_persons',)
    autocomplete_lookup_fields = {
        'm2m': ['movies', ],
    }

@admin.register(VideoList)
class VideoListAdmin(admin.ModelAdmin):
    list_display = ("id",'name', "owner")
    raw_id_fields = ['videos', "owner", "related_persons"]
    list_select_related = ('owner',)
    list_filter = ('name',)
    #exclude = ('related_persons',)
    autocomplete_lookup_fields = {
        'm2m': ['videos', ],
    }



@admin.register(Video)
class VideoAdmin(ImportExportModelAdmin):
    list_display = ("id",'title',"link")
    search_fields = ('id','title', )
    raw_id_fields = ['related_movies', 'related_persons',]
    inlines = [TagVideoInline,]
    resource_class = VideoResource

    autocomplete_lookup_fields = {
#        'fk': ['related_fk'],
        'm2m': ['related_persons',"related_movies", ],
    }


"""
""" 

@admin.register(Rating)
class RatingAdmin(admin.ModelAdmin):
    list_display = ("profile",'movie',"rating", "created_at",)
    search_fields = ('profile',"movie", 'rating', )


@admin.register(Prediction)
class PredictionAdmin(admin.ModelAdmin):
    list_display = ("profile",'movie',"prediction", "created_at","profile_points")



@admin.register(Tag)
class TagAdmin(admin.ModelAdmin):
    list_display = ("pk","custom_id",'movielens_id',"tmdb_id","slug",
        "award_tag", "base_tag","character_tag","topic_tag",
        "genre_tag", "geo_tag","phenomenal_tag",
        "series_tag", "subgenre_tag","theme_tag", "video_tag",)

    fields = ("custom_id",'movielens_id',"tmdb_id","tmdb_id_2","netflix_id","name","summary", "tag_type","topic_tag",
        "discipline_type","object_type","slug","related_movies",
        "award_tag", "base_tag","character_tag", "documentary_tag", "era_tag",
        "form_tag","genre_tag", "geo_tag","historical_person_tag",  
        "phenomenal_tag","series_tag", "subgenre_tag","theme_tag", "video_tag","parent_genres","adult_tag",)

    readonly_fields = ("pk",)
    search_fields = ('name',"slug")
    raw_id_fields = ['related_movies',]
    list_filter = ('tag_type',"object_type","topic_tag",
        "award_tag", "base_tag","character_tag", "documentary_tag", "era_tag",
        "form_tag","genre_tag", "geo_tag","historical_person_tag",  "phenomenal_tag",
        "series_tag", "subgenre_tag","theme_tag", "video_tag",)

    #resource_class = TagResource
    

    def self_id(self, obj):
        return obj.id


@admin.register(Quote)
class QuoteAdmin(admin.ModelAdmin):
    list_display = ("id","text","owner_name", "person", "movie",)

    fields =  ("id","text","owner_name", "person", "movie","reference_notes", "reference_link")

    search_fields = ('text','movie',"owner_name", "person" )
    raw_id_fields = ['movie',"person", "topics"]
    #resource_class = TagResource
    