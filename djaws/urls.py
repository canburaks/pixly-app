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
    ListSitemap, custom_url_pages)

from django.contrib.sitemaps import views
from django.contrib.sitemaps import ping_google
from django.views.decorators.cache import cache_page
from django.urls import path, include, re_path
from pprint import pprint





def logout_view(request):
  auth.logout(request)
  # Redirect to a success page.
  return HttpResponseRedirect("/logout/")

sitemaps = {
    'static': StaticSitemap(),
    #'user': ProfilePageSitemap(),
    "lists":ListSitemap(),
    'movie': MovieSitemap(),
    'person': DirectorSitemap()
}

urlpatterns = [
    path(f'termsofservice', TemplateView.as_view(template_name=f"others/terms_of_service.html")),
    path(f'privacy', TemplateView.as_view(template_name=f"others/privacy.html")),

    path(f'qxlz5o8q9j8y9kqeehnnz9kfx2mce5.html', TemplateView.as_view(template_name=f"qxlz5o8q9j8y9kqeehnnz9kfx2mce5.html")),

    #re_path(r'^sitemap\.xml$', sitemap, {'sitemaps': sitemaps}, name='django.contrib.sitemaps.views.sitemap'),
    #path('sitemap.xml', views.index, {'sitemaps': sitemaps}),
    #path('<section>.xml', views.sitemap, {'sitemaps': sitemaps}, name='django.contrib.sitemaps.views.sitemap'),
    
    #re_path(r'^sitemap.xml', cache_page(360)(sitemap), {'sitemaps': sitemaps}, name='django.contrib.sitemaps.views.sitemap'),
    re_path(r'^slug-site-map.xml', cache_page(300)(sitemap), {'sitemaps': sitemaps}, name='django.contrib.sitemaps.views.sitemap'),
    #re_path(r'^sitemap.xml/', sitemap, {'sitemaps': sitemaps}, name='django.contrib.sitemaps.views.sitemap'),
    re_path(r'^robots.txt', lambda x: HttpResponse("User-Agent: *\nSitemap: https://pixly.app/slug-site-map.xml\nDisallow:",
            content_type="text/plain"), name="robots_file"),
            
    re_path(r'^.well-known/brave-rewards-verification.txt', lambda x: HttpResponse("This is a Brave Rewards publisher verification file.\n\nDomain: pixly.app\nToken: b8b10bb0d60345f4f49ec7839609e9c92a9799ed95004ce17065b097604f0161",
            content_type="text/plain"), name="robots_file"),

    #facebook bussiness
    path(f'qxlz5o8q9j8y9kqeehnnz9kfx2mce5.html', TemplateView.as_view(template_name=f"qxlz5o8q9j8y9kqeehnnz9kfx2mce5.html")),

    #re_path(r'^ads.txt', lambda x: HttpResponse("google.com, pub-9259748524746137, DIRECT, f08c47fec0942fa0",
    #    content_type="text/plain"), name="ads_file"),
    path("ads.txt", TemplateView.as_view(template_name="ads.txt")),

    path('admin/filebrowser/', site.urls),
    path('grappelli/', include('grappelli.urls')), # grappelli URLS
    path('admin/', admin.site.urls),

   # path(r'^logout/$', auth.logout, {'next_page': settings.LOGOUT_REDIRECT_URL}),

    #path(r'', TemplateView.as_view(template_name="index.html")),
    #path("",HomeList.as_view(), name="home"),



    re_path(r'^graphql', csrf_exempt(FileUploadGraphQLView.as_view(graphiql=True))),
    re_path(r'^gql', csrf_exempt(GraphQLView.as_view(graphiql=True))),
    re_path(r'^ckeditor/', include('ckeditor_uploader.urls')),
]
#if True Create React App settings will render
#otherwise webpack code splitted
CRA = False
SNAP = True
##########################################################################3
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



##########################################################################3

    # first static sites
if CRA==False and SNAP == True:
    #urlpatterns = urlpatterns + list_paths + person_paths
    
    #movie_paths = static_movie_path()
    #urlpatterns = urlpatterns + list_paths + person_paths + movie_paths
    
    
    #list_paths = static_list_path()
    #person_paths = static_person_path()
    urlpatterns = urlpatterns + custom_url_pages
    pprint(custom_url_pages)
    #pass

##########################################################################3

if CRA:
    urlpatterns = urlpatterns + [

    #react snap
    #re_path(r'^(?:.*)/?$',TemplateView.as_view(template_name="build/index.html")),
    
    #for Webpack splitted output
    #re_path(r'^(?:.*)/?$', TemplateView.as_view(template_name="index-chunk.html")),

    #-Original 
    #re_path(r'^(?:.*)/?$', TemplateView.as_view(template_name="index.html"))
    re_path(r'^(?:.*)/?$', TemplateView.as_view(template_name="index.html"))
]
if not CRA:

    urlpatterns = urlpatterns + [
    #path('directors/1', TemplateView.as_view(template_name="build/directors/1/index.html")),
#
    #path('list', TemplateView.as_view(template_name="build/list/index.html")),

    #path('', TemplateView.as_view(template_name="build/404.html")),

    #react snap
    #re_path(r'^(?:.*)/?$',TemplateView.as_view(template_name="build/index-chunk.html")),
    #re_path(r'^(?:.*)/?$',TemplateView.as_view(template_name="build/404.html")),
    path("collections", TemplateView.as_view(template_name="build/collections/index.html")),

    path("/", TemplateView.as_view(template_name="index.html")),
    re_path(r'^(?:.*)/?$',TemplateView.as_view(template_name="build/200.html")),

    #for Webpack splitted output
    #re_path(r'^(?:.*)/?$', TemplateView.as_view(template_name="index-chunk.html")),

    #-Original 
    #re_path(r'^(?:.*)/?$', TemplateView.as_view(template_name="index.html"))

    #STATIC RENDERING
    #path('movie/<int:question_id>/vote/', views.vote, name='vote'),

]



ping_google()
"""
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
