from django.conf import settings
#from django_hosts import patterns, host
#from django.conf import settings
#from django.contrib.sites.models import Site
#from django.contrib import admin
#from django.urls import path, include, re_path,include
#from django.conf.urls.static import static
#from django.views.generic import RedirectView
#from django.views.decorators.csrf import csrf_exempt
##from django.contrib.auth import login, logout
#from django.contrib.auth.views import login, logout
#
#from graphene_django.views import GraphQLView
#from persons.views import HomeList
#from django.views.generic import TemplateView
#from django.contrib import auth
#from filebrowser.sites import site
#from graphene_file_upload.django import FileUploadGraphQLView
#from django.http import HttpResponse
#from django.contrib.sitemaps.views import sitemap
#from djaws.sitemaps import MovieSitemap, DirectorSitemap, StaticSitemap, ProfilePageSitemap, ListSitemap
#from django.contrib.sitemaps import views
#from django.contrib.sitemaps import ping_google
#from django.views.decorators.cache import cache_page
from django_hosts import patterns, host

from blog import urls as blog_urls


host_patterns = patterns('',
    host(r'blog', blog_urls, name='blog'),
    host(r'www', settings.ROOT_URLCONF, name='www'),
    host(r'', settings.ROOT_URLCONF, name='default'),
)

