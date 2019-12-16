from django.contrib.sitemaps import Sitemap
from items.models import Movie, List, Video, Tag, Topic
from persons.models import Person, Director, Crew
from persons.profile import Profile
from django.urls import reverse
from django.db.models import Q
from django.db.models.functions import Length
from django.conf import settings
from django.views.generic import TemplateView
from django.urls import path, include, re_path
from pprint import pprint
import json
from pixly.lib import get_json
#----------------------------------------------------------------------------
# CUSTOM SELECTED PAGES FOR PRE-RENDER
allowed_urls_dict = get_json("./allowed_urls.json")
#print("allowed", allowed_urls_dict.get("movie")[0][1:])

movie__slugs = [x[1:] for x in allowed_urls_dict.get("movie")]

person__slugs = [x[1:] for x in allowed_urls_dict.get("person")]

liste__slugs = [x[1:] for x in allowed_urls_dict.get("list")]

topic__slugs = [x[1:] for x in allowed_urls_dict.get("topic")]

blog__slugs = [x[1:] for x in allowed_urls_dict.get("blog")]
#print(movie__slugs,person__slugs,liste__slugs, topic__slugs, blog__slugs )
#print(topic__slugs)
static__slugs = blog__slugs + [
    "explore",
    "advance-search",
    "directors/1",
]


def page_template_generator(routes):
    new_paths = []
    for route in routes:
        try:
            new_path = path(route, TemplateView.as_view(template_name=f"prerendered/{route}/index.html"))
            new_paths.append(new_path)
        except:
            continue
    return new_paths


custom_movie_pages =  page_template_generator(movie__slugs)
custom_person_pages = page_template_generator(person__slugs)
custom_list_pages =   page_template_generator(liste__slugs)
custom_topic_pages =   page_template_generator(topic__slugs)
custom_static_pages =   page_template_generator(static__slugs)

home_page = [path("/", TemplateView.as_view(template_name=f"prerendered/index.html")), path("", TemplateView.as_view(template_name=f"prerendered/index.html"))]
custom_url_pages = custom_movie_pages + custom_person_pages + custom_list_pages + custom_topic_pages + custom_static_pages + home_page


#pprint(custom_url_pages)

#----------------------------------------------------------------------------
class TopicSitemap(Sitemap):
    changefreq = "yearly"
    priority = 0.9
    def items(self):
        slugs = [x.replace("topic/", "").strip() for x in topic__slugs]
        topics =  Topic.objects.filter(slug__in=slugs).only("id", "slug")
        #print(topics.count())
        return topics
    
    def location(self, item):
        #print("/topic/{item.slug}")
        return f"/topic/{item.slug}"


class ListSitemap(Sitemap):
    changefreq = "yearly"
    priority = 0.9
    def items(self):
        slugs = [x.replace("list/", "").strip().replace("/1", "").strip() for x in liste__slugs]
        lists =  List.objects.filter(slug__in=slugs).only("id", "slug")
        return lists
    
    def location(self, item):
        return f"/list/{item.slug}/1"


class MovieSitemap(Sitemap):
    changefreq = "weekly"
    #slugs = [x.split("movie/")[1] for x in movie__slugs]
    priority = 0.9
    def items(self):
        #print(movie__slugs)
        slugs = [x.split("movie/")[1] for x in movie__slugs]
        #print(slugs)
        #mqs = movie_filter()
        mqs_mini = Movie.objects.filter(slug__in=slugs).only("id", "slug")
        #print(mqs_mini)
        return mqs_mini  

    def location(self, item):
        return f"/movie/{item.slug}"



class DirectorSitemap(Sitemap):
    changefreq = "yearly"
    priority = 0.6
    def items(self):
        slugs = [x.split("person/")[1] for x in person__slugs]
        mqs_mini = Person.objects.filter(slug__in=slugs).only("id", "slug", "name")
        return mqs_mini
    
    def location(self, item):
        return f"/person/{item.slug}"

class ProfilePageSitemap(Sitemap):
    changefreq = "yearly"
    priority = 0.2
    def items(self):
        return Profile.objects.all().only("id", "username").order_by("id")
    def location(self, item):
        return f"/user/{item.username}"

class StaticSitemap(Sitemap):
    changefreq = "monthly"
    priority = 0.4
    def items(self):
        stat_slug = [f"/{x}" for x in static__slugs]
        #print(stat_slug)
        statics = stat_slug + [
            "/people/1",
            "/rss/great-film-collections",
            "/termsofservice", "/privacy", "", "/"
        ]
        return statics

    def location(self, item):
        return item

