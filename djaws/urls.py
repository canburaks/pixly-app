"""Pro URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/2.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import auth



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
from djaws.sitemaps import (MovieSitemap, DirectorSitemap, StaticSitemap, ProfilePageSitemap,
    ListSitemap,TopicSitemap, custom_url_pages)

from django.contrib.sitemaps import views
from django.contrib.sitemaps import ping_google
from django.views.decorators.cache import cache_page
from django.urls import path, include, re_path
from pprint import pprint

from django.http import HttpResponseRedirect, HttpResponse, HttpResponseNotFound, Http404
from django.conf.urls import handler400, handler403, handler404, handler500
#django.views.defaults.page_not_found()
from django.shortcuts import render
from django.views.defaults import page_not_found
from django.contrib.sitemaps import Sitemap
from django.urls import path, include, re_path
#from pixly.indexing import deindex_url_patterns
from pixly.lib import is_ascii, to_english_chars, save_json, get_json
from .feed import CollectionsFeed, PythonFeed
def raw_404(request):
  response = HttpResponse("Not Found", status=404)
  response["status"] = 404
  return response

handler404 = raw_404


sitemaps = {
    'static': StaticSitemap(),
    #'user': ProfilePageSitemap(),
    "lists":ListSitemap(),
    'movie': MovieSitemap(),
    'person': DirectorSitemap(),
    "topic": TopicSitemap()
}
#removesitemaps = { "remove": RemoveSitemap()}

json_pathnames = get_json("pixly/404.json")
def make_url_pattern():
    url_patterns = []
    for url in json_pathnames:
        try:
            single_path = re_path(rf'^{url}$', lambda x: HttpResponse("404 Not Found",
            content_type="text/plain", status=404), name="deindex")
            url_patterns.append(single_path)
        except:
            continue
    return url_patterns
deindex_url_patterns = make_url_pattern()


class RemoveLinkClass:
    def __init__(self, link):
        self.link = link

class RemoveSitemap(Sitemap):
    changefreq = "daily"
    priority = 0.9
    def items(self):
        url_patterns = [RemoveLinkClass(link=f"/{path}") for path in json_pathnames ]
        return url_patterns

    def location(self, item):
        return item.link


urlpatterns = [
    path("404", handler404),
    path("movie/242", handler404),
    path(f'termsofservice', TemplateView.as_view(template_name=f"others/terms_of_service.html")),
    path(f'privacy', TemplateView.as_view(template_name=f"others/privacy.html")),
    path(f'rss/specificfeeds-verification-code.html', TemplateView.as_view(template_name=f"others/specificfeeds-verification-code.html")),

    #facebook bussiness
    path(f'qxlz5o8q9j8y9kqeehnnz9kfx2mce5.html', TemplateView.as_view(template_name=f"others/qxlz5o8q9j8y9kqeehnnz9kfx2mce5.html")),

    re_path(r'^sitemap.xml', cache_page(300)(sitemap), {'sitemaps': sitemaps}, name='django.contrib.sitemaps.views.sitemap'),
    #re_path(r'^remove-sitemap.xml', cache_page(10)(sitemap), {'sitemaps': removesitemaps}, name='django.contrib.sitemaps.views.sitemap'),

    re_path(r'^robots.txt', TemplateView.as_view(template_name="robots.txt"), name="robots_file"),
    path("ads.txt", TemplateView.as_view(template_name="others/ads.txt")),

    #re_path(r'^robots.txt', lambda x: HttpResponse("User-Agent: *\nSitemap: https://pixly.app/sitemap.xml\nDisallow:",
    #        content_type="text/plain"), name="robots_file"),
            
    re_path(r'^.well-known/brave-rewards-verification.txt', lambda x: HttpResponse("This is a Brave Rewards publisher verification file.\n\nDomain: pixly.app\nToken: b8b10bb0d60345f4f49ec7839609e9c92a9799ed95004ce17065b097604f0161",
            content_type="text/plain"), name="robots_file"),


    path('admin/filebrowser/', site.urls),
    path('grappelli/', include('grappelli.urls')), # grappelli URLS

    path('admin/', admin.site.urls),


    re_path(r'^graphql', csrf_exempt(FileUploadGraphQLView.as_view(graphiql=True))),
    re_path(r'^gql', csrf_exempt(GraphQLView.as_view(graphiql=True))),
    re_path(r'^ckeditor/', include('ckeditor_uploader.urls')), 
]

#print(deindex_url_patterns)
urlpatterns = urlpatterns + custom_url_pages + deindex_url_patterns + [
    path('rss/great-film-collections', CollectionsFeed()),
    path("rss/pixly-technical-tutorial-and-articles", PythonFeed()),
    path("/", TemplateView.as_view(template_name="prerendered/index.html")),
    path("", TemplateView.as_view(template_name="prerendered/index.html")),
    #*deindex_url_patterns,
    re_path(r'^(?:.*)/?$',TemplateView.as_view(template_name="prerendered/200.html")),  
    #path("", TemplateView.as_view(template_name="prerendered/404.html")), #bcs 404 returns to main-page
    #re_path(r'^(?:.*)/?$',TemplateView.as_view(template_name="prerendered/200.html")), #200.html is original - not prerendered page template 
]
def logout_view(request):
  auth.logout(request)
  # Redirect to a success page.
  return HttpResponseRedirect("/logout/")



#ping_google()
"""

# STATIC PATH GENERATORS
def static_list_path():
    from django.db.models.functions import Length
    from items.models import List
    summary_limit = settings.LIST_MIN_SUMMARY
    lqs = List.objects.annotate(text_len=Length('summary')).filter(
            text_len__gt=summary_limit, list_type__in=["df", "fw" "ms"]).only("slug", "id")
    pprint(lqs)
    new_paths = []
    for liste in lqs:
        try:
            new_path = path(f'list/{liste.slug}/1',
                    TemplateView.as_view(
                        template_name=f"build/list/{liste.slug}/1/index.html"
                        ))
            new_paths.append(new_path)
            #print(new_path)
        except:
            continue
    new_paths.append(path(f'list/{liste.slug}/1',TemplateView.as_view(template_name=f"build/list/{liste.slug}/1/index.html")))

    #print(new_paths)
    return new_paths

def static_person_path():
    from persons.models import Person
    pqs = Person.objects.filter(active=True).only("slug", "id")
    new_paths = []
    for person in pqs:
        try:
            new_path = path(f'person/{person.slug}',
                    TemplateView.as_view(
                        template_name=f"build/person/{person.slug}/index.html"
                        ))
            #print(new_path)
            new_paths.append(new_path)
        except:
            continue
    return new_paths

def static_movie_path():
    from .sitemaps import movie_filter
    mqs = movie_filter()
    new_paths = []
    for movie in mqs:
        try:
            new_path = path(f'movie/{movie.slug}',
                    TemplateView.as_view(
                        template_name=f"build/movie/{movie.slug}/index.html"
                        ))
            new_paths.append(new_path)
        except:
            continue
    return new_paths

if settings.DEBUG:
    import debug_toolbar
    urlpatterns = [
        path('__debug__/', include(debug_toolbar.urls)),

        # For django versions before 2.0:
        # url(r'^__debug__/', include(debug_toolbar.urls)),

    ] + urlpatterns
"""

"""
urlpatterns = [
    path('admin/', admin.site.urls),

    path('api/v1/', include('api.urls')),
    #path('accounts/', include('allauth.urls')),
    path("",views.HomeList.as_view(), name="home"),
    path('users/', include('persons.urls')),
    path('movies/', include('items.urls')),
] + static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)

urlpatterns += [
    re_path(r'^signup/$', accounts_views.signup, name='signup'),
    re_path(r'^login/$', auth_views.LoginView.as_view(template_name='registration/login.html'), name='login'),
    path("dashboard/", views.HomeList.as_view(), name="dashboard"),
    re_path(r'^logout/$', auth_views.LogoutView.as_view(), name='logout'),
]
"""
