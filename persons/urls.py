from django.conf.urls import url
from django.urls import path, re_path
from . import views
from django.contrib import auth
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path("ratings", views.RatingList.as_view(), name="ratings"),
    path("profile/", views.profile, name="profile"),
    path("favorites/", views.favorites, name="favorites"),
    path("draft/", views.draft, name="draft"),
    path("ajax/validate_username/", views.validate_username, name='validate_username'),
    path("calculations", views.calculations, name="calculations"),
] +  static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
