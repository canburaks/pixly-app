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
static_slugs =[
    "collections",

]
movie__slugs = [
    "movie/joker-2019",
    "movie/marriage-story-2019",
    "movie/ad-astra-2019",
    "movie/once-upon-a-time-in-hollywood-2019",
    "movie/midsommar-2019",
    "movie/john-wick-chapter-3-parabellum-2019",
    "movie/long-shot-2019",
    "movie/portrait-of-a-lady-on-fire-2019",
    "movie/toy-story-4-2019",
    "movie/us-2019",
    "movie/the-matrix-1999",
    "movie/taxi-driver-1976",
    "movie/ida-2013",
    "movie/the-seventh-seal-1957",
    "movie/life-is-beautiful-1997",
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
    "movie/marley-2012",
    "movie/the-white-ribbon-2009",
    "movie/enter-the-void-2009",
    "movie/the-dark-knight-rises-2012",
    "movie/life-of-pi-2012",
    "movie/the-hobbit-an-unexpected-journey-2012",
    "movie/inception-2010",
    "movie/black-swan-2010",
    "movie/the-kings-speech-2010",
    "movie/the-dark-knight-2008",
    "movie/v-for-vendetta-2006",
    "movie/hotel-rwanda-2004",
    "movie/kill-bill-vol-1-2003",
    "movie/old-boy-2003",
    "movie/the-lord-of-the-rings-the-return-of-the-king-2003",
    "movie/city-of-god-2002",
    "movie/the-lord-of-the-rings-the-fellowship-of-the-ring-2001",
    "movie/amelie-2001",
    "movie/beautiful-mind-a-2001",
]

#[print(f"https://pixly.app/movie/{ms}") for ms in movie__slugs]
person__slugs = [
    "person/brad-pitt-287",
    "person/leonardo-dicaprio-6193",
    "person/keanu-reeves-6384",
    "person/tom-hanks-31",
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



custom_static_pages = page_template_generator( static_slugs )
custom_movie_pages = page_template_generator( movie__slugs)
custom_person_pages = page_template_generator(person__slugs)
custom_list_pages = page_template_generator( liste_slugs)
custom_url_pages = custom_static_pages + custom_movie_pages + custom_person_pages + custom_list_pages

#pprint(custom_url_pages)

#----------------------------------------------------------------------------


def movie_filter(imdb_rating=8, summary_limit=settings.LIST_MIN_SUMMARY):
    from django.db.models.functions import Length
    mqs_ids =  Movie.objects.filter(active=True, slug__isnull=False,imdb_rating__gt=imdb_rating
        ).order_by("-year").values_list("id", flat=True)
    #director filter
    cqs_ids = Crew.objects.filter(job="d").select_related("movie").values_list("movie__id", flat=True)
    #intersection
    movie_ids = set(list(mqs_ids)).intersection(set(list(cqs_ids)))
    #new movies
    for new_id in Movie.objects.filter(year__gte=2019, videos__isnull=False).values_list("id", flat=True):
        movie_ids.add(new_id)
    #list movies
    for l in List.objects.prefetch_related("movies").all().only("movies__id"):
        for m in l.movies.all():
            movie_ids.add(m.id)
    movie_have_long_summary = Movie.objects.annotate(text_len=Length('summary')).filter(text_len__gt=summary_limit, id__in=movie_ids, imdb_rating__gt=7).exclude(poster="").only("id", "name", "slug", "created_at", "updated_at")
    return movie_have_long_summary


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
    changefreq = "yearly"
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
        active_directors_ids = Person.objects.filter(active=True).values_list("id", flat=True)
        #print(active_directors_ids)
        busy_persons =  Person.objects.filter(
            slug__isnull=False).exclude(poster=""
            ).order_by("-work_quantity").values_list("id", flat=True)[:500]
        director_ids = [*active_directors_ids, *busy_persons]
        return Person.objects.filter(id__in=director_ids).only("id", "slug")
    
    def location(self, item):
        return f"/person/{item.slug}"

class ProfilePageSitemap(Sitemap):
    changefreq = "yearly"
    priority = 0.2
    def items(self):
        return Profile.objects.all().only("id", "username").order_by("id")
    def location(self, item):
        return f"/user/{item.username}/"

class StaticSitemap(Sitemap):
    changefreq = "yearly"
    priority = 0.8
    def items(self):
        statics = [
            "/","/welcome", "/directors/1"
        ]
        for i in range(1,5,1):
            statics.append(f"/movies/{i}")
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