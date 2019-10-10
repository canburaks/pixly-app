from django.conf import settings
from django_hosts import patterns, host
from django.conf import settings
from django.contrib.sites.models import Site
from django.contrib import admin
from django.urls import path, include, re_path,include
from django.conf.urls.static import static
from django.views.generic import RedirectView
from django.views.decorators.csrf import csrf_exempt
#from django.contrib.auth import login, logout
from django.contrib.auth.views import login, logout

from graphene_django.views import GraphQLView
from persons.views import HomeList
from django.views.generic import TemplateView
from django.contrib import auth
from filebrowser.sites import site
from graphene_file_upload.django import FileUploadGraphQLView
from django.http import HttpResponse
from django.contrib.sitemaps.views import sitemap
from djaws.sitemaps import MovieSitemap, DirectorSitemap, StaticSitemap, ProfilePageSitemap, ListSitemap
from django.contrib.sitemaps import views
from django.contrib.sitemaps import ping_google
from django.views.decorators.cache import cache_page
from .sitemaps import StaticSitemap, PostSitemap

sitemaps = {
    'static': StaticSitemap(),
    "posts":PostSitemap(),
}

urlpatterns = [
    #re_path(r'^sitemap\.xml$', sitemap, {'sitemaps': sitemaps}, name='django.contrib.sitemaps.views.sitemap'),
    #path('sitemap.xml', views.index, {'sitemaps': sitemaps}),
    #path('<section>.xml', views.sitemap, {'sitemaps': sitemaps}, name='django.contrib.sitemaps.views.sitemap'),
    re_path(r'^robots.txt', lambda x: HttpResponse("User-Agent: *\nSitemap: https://blog.pixly.app/sitemap.xml\nDisallow:",
            content_type="text/plain"), name="robots_file"),
            

    re_path(r'^ads.txt', lambda x: HttpResponse("google.com, pub-9259748524746137, DIRECT, f08c47fec0942fa0",
        content_type="text/plain"), name="ads_file"),

    #re_path(r'^sitemap.xml', cache_page(32400)(sitemap), {'sitemaps': sitemaps}, name='django.contrib.sitemaps.views.sitemap'),
    re_path(r'^sitemap.xml', sitemap, {'sitemaps': sitemaps}, name='django.contrib.sitemaps.views.sitemap'),
    re_path(r'^graphql', csrf_exempt(FileUploadGraphQLView.as_view(graphiql=True))),
    re_path(r'^gql', csrf_exempt(GraphQLView.as_view(graphiql=True))),
    re_path(r'^', TemplateView.as_view(template_name="blog/index.html")),

    #re_path(r'^', lambda x: HttpResponse("Hello",content_type="text/plain"), name="robots_file"),
]