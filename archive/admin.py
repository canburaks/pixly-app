from django.contrib import admin
from .models import TmdbMovie,ContentSimilarity

# Register your models here.
@admin.register(TmdbMovie)
class TmdbMovieAdmin(admin.ModelAdmin):
    list_display = ("tmdb_id", "movielens_id",'name',"imdb_id", "registered", "created_at")
    search_fields = ('name', 'imdb_id',"tmdb_id", 'movielens_id', )
    list_filter = ('registered',)


# Register your models here.
@admin.register(ContentSimilarity)
class ContentSimilarityAdmin(admin.ModelAdmin):
    list_display = ("movie",)
    search_fields = ("movie__name", "movie__id", )
