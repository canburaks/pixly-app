from django.conf.urls import url
from django.urls import path, re_path
from . import views
from django.contrib import auth
from django.conf import settings
from django.conf.urls.static import static
from .models import Movie, Book, List
urlpatterns = [
    path("editor/", views.MovieListView.as_view(), name="movies"),
    path("movies/", views.AllMovieList.as_view(), name="allmovies"),
    path("imdb/", views.IMDBList.as_view(), name="imdb250"),
    #path("", views.List200, name="movies"),
    #re_path(r'^publishers/$', views.ListView.as_view(model=List)),
    path("<int:movie_id>", views.movie_detail, name="movie-detail"),
    path("search", views.movie_search, name="movie-search"),
    path("create_rating", views.create_rating, name="create_rating"),
]+ static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
