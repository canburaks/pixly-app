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
from django.conf.urls.static import static

from graphene_django.views import GraphQLView
from persons.views import HomeList
from django.views.generic import TemplateView
from django.contrib import auth
from filebrowser.sites import site
from django.views.static import serve

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

    re_path(r'^graphql', csrf_exempt(FileUploadGraphQLView.as_view(graphiql=True))),
    re_path(r'^gql', csrf_exempt(GraphQLView.as_view(graphiql=True))),
    re_path(r'^ckeditor/', include('ckeditor_uploader.urls')),
]

urlpatterns = urlpatterns + [
    #path('directors/1', TemplateView.as_view(template_name="build/directors/1/index.html")),
#
    #path('list', TemplateView.as_view(template_name="build/list/index.html")),

    #path('', TemplateView.as_view(template_name="build/404.html")),

    #react snap
    #re_path(r'^(?:.*)/?$',TemplateView.as_view(template_name="build/index-chunk.html")),
    #re_path(r'^(?:.*)/?$',TemplateView.as_view(template_name="build/404.html")),
    #path("collections", TemplateView.as_view(template_name="build/collections/index.html")),
    re_path(r'^(?:.*)/?$',TemplateView.as_view(template_name="index.html")),

    #for Webpack splitted output
    #re_path(r'^(?:.*)/?$', TemplateView.as_view(template_name="index-chunk.html")),

    #-Original 
    #re_path(r'^(?:.*)/?$', TemplateView.as_view(template_name="index.html"))

    #STATIC RENDERING
    #path('movie/<int:question_id>/vote/', views.vote, name='vote'),

] + static(settings.FRONTEND_FILE_STORAGE, document_root=settings.FRONTEND_FILE_STORAGE)



"""
ping_google()
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
