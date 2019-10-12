from django.contrib.sitemaps import Sitemap
from items.models import Movie, List, Video
from persons.models import Person, Director, Crew
from persons.profile import Profile
from django.urls import reverse
from django.db.models import Q
from django.db.models.functions import Length
from django.conf import settings
from django.views.generic import TemplateView
from django.urls import path, include, re_path
from pprint import pprint

#----------------------------------------------------------------------------
# CUSTOM SELECTED PAGES FOR PRE-RENDER

movie__slugs = [
    "movie/once-upon-a-time-in-hollywood-2019",
    "movie/midsommar-2019",
    "movie/john-wick-chapter-3-parabellum-2019",
    "movie/long-shot-2019",
    "movie/portrait-of-a-lady-on-fire-2019",
    "movie/toy-story-4-2019",
    "movie/us-2019",
    "movie/the-matrix-1999",
    "movie/joker-2019",
    "movie/marriage-story-2019",
    "movie/ad-astra-2019",
    "movie/suspiria-2018",
    "movie/the-favourite-2018",
    "movie/roma-2018",
    "movie/get-out-2017",
    "movie/on-body-and-soul-2017",
    "movie/ex-machina-2015",
    "movie/the-grand-budapest-hotel-2014",
    "movie/whiplash-2014",
    "movie/the-wolf-of-wall-street-2013",
    "movie/her-2013",
    "movie/enter-the-void-2009",
    "movie/inception-2010",
    "movie/the-dark-knight-2008",
    "movie/v-for-vendetta-2006",
    "movie/hotel-rwanda-2004",
    "movie/kill-bill-vol-1-2003",
    "movie/old-boy-2003",
    "movie/city-of-god-2002",
    "movie/the-lord-of-the-rings-the-fellowship-of-the-ring-2001",
    "movie/amelie-2001",
    "movie/beautiful-mind-a-2001",
    "movie/waking-life-2001",
    "movie/eerie-2018",
    "movie/the-legend-of-secret-pass-2010",
    "movie/the-social-network-2010",
    "movie/thoroughbreds-2018",
    "movie/13-assassins-2010",
    "movie/endless-love-2014",
    "movie/the-da-vinci-code-2006",
    "movie/midnight-cowboy-1969",
    "movie/lilo-stitch-2002",
    "movie/it-2017",

    "movie/mektoub-my-love-intermezzo-2019",
    "movie/john-wick-2014",
    "movie/all-ladies-do-it-1992",
    "movie/mektoub-my-love-2017",
    "movie/godzilla-king-of-the-monsters-2019",
    "movie/the-house-that-jack-built-2018",
    "movie/olympus-has-fallen-2013",
    "movie/dark-phoenix-2019",
    "movie/incredibles-2-2018",
    "movie/the-conjuring-2013",
    "movie/the-conjuring-2-2016",
    "movie/glass-2019",
    "movie/i-feel-pretty-2018",
    "movie/the-spectacular-now-2013",
    "movie/the-nice-guys-2016",
    "movie/great-expectations-2012",
    "movie/mars-attacks-1996",
    "movie/alien-covenant-2017",
    "movie/gone-baby-gone-2007",
    "movie/grimsby-2016",
    "movie/robocop-2014",
    "movie/the-lincoln-lawyer-2011",
    "movie/alice-in-wonderland-2010",
    "movie/boro-the-caterpillar-2018",
    "movie/beats-2019",
    "movie/493141-beats-2019",
    "movie/teorema-1968",
    "movie/high-noon-2009",
    "movie/the-sword-in-the-stone-1963",
    "movie/beuys-2017",
    "movie/porco-rosso-1992",
    "movie/dead-leaves-2004",
    "movie/shortbus-2006",
    "movie/zodiac-2007",
    "movie/instant-family-2018",
    "movie/american-pie-1999",
    "movie/about-cherry-2012",
    "movie/eat-pray-love-2010",
    "movie/kung-fu-panda-2008",
    "movie/me-before-you-2016",
    "movie/interstellar-2014",
    "movie/ready-player-one-2018",
]

#[print(f"https://pixly.app/movie/{ms}") for ms in movie__slugs]
person__slugs = [
    "person/ingmar-bergman-6648",
    "person/alfred-hitchcock-2636",
    "person/stanley-kubrick-240",
    "person/david-lynch-5602",
    "person/martin-scorsese-1032",
    "person/quentin-tarantino-138",
    "person/francis-ford-coppola-1776",
    "person/david-fincher-7467",
    "person/jean-luc-godard-3776",
    "person/jim-jarmusch-4429",
    "person/paul-thomas-anderson-4762",
    "person/michelangelo-antonioni-15189",
    "person/sofia-coppola-1769",
    "person/andrei-tarkovsky-8452",
    "person/darren-aronofsky-6431",
    "person/wes-anderson-5655",
    "person/nuri-bilge-ceylan-56214",
    "person/alfonso-cuaron-11218",
    "person/michael-haneke-6011",
    "person/yorgos-lanthimos-122423",
    "person/christopher-nolan-525",
    "person/wong-kar-wai-12453",
    "person/brad-pitt-287",
    "person/keanu-reeves-6384",
    "person/tom-hanks-31",
    "person/leonardo-dicaprio-619",
]
liste_slugs =[
      "list/all-palme-dor-winners-cannes-film-festival/1",
      "list/all-golden-bear-winners-berlin-film-festival/1",
      "list/all-golden-lion-winners-venice-film-festival/1",
      "list/our-selection/1",
      "list/imdb-top-250/1",
      "list/sight-sounds-legendary-list-directors-top-100/1",
      "list/quentin-tarantinos-favourite-movies-from-1992-to-2009/1",
      "list//stanley-kubricks-list-of-top-10-films/1",
      "list/nuri-bilge-ceylans-top-10-favorite-films/1",
      "list/david-finchers-26-favorite-films/1",
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



custom_movie_pages = page_template_generator( movie__slugs)
custom_person_pages = page_template_generator(person__slugs)
custom_list_pages = page_template_generator( liste_slugs)
custom_url_pages = custom_movie_pages + custom_person_pages + custom_list_pages

#pprint(custom_url_pages)

#----------------------------------------------------------------------------


class ListSitemap(Sitemap):
    changefreq = "monthly"
    priority = 0.9
    def items(self):
        lists =  List.objects.all().only("id", "name", "slug", "summary").order_by("id")
        filtered_list = [x for x in lists if len(x.summary) > settings.LIST_MIN_SUMMARY]
        return filtered_list
    
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
        mqs_mini = Movie.objects.filter(slug__in=slugs).only("id", "slug", "name", "year")
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
    changefreq = "yearly"
    priority = 0.8
    def items(self):
        statics = [
            "","/", "/directors/1", "/collections"
        ]
        return statics

    def location(self, item):
        return item



"""
class ProfileHomeSitemap(Sitemap):
    changefreq = "weekly"
    priority = 0.8
    def items(self):
        return Profile.objects.all().only("id", "username").order_by("id")
    def location(self, item):
        return f"/{item.username}/dashboard/"
"""