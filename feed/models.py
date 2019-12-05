from django.db import models
from items.models import List, Topic, Movie
from persons.profile import Profile
from django.urls import reverse
from django_mysql.models import (JSONField, SetTextField, ListTextField, SetCharField)
from django.utils.functional import cached_property
from django.conf import settings
from feedgen.feed import FeedGenerator


def vertical_upload_path(instance, filename):
    return "rss/{0}/large-{1}".format(instance.id,filename)

def horizontal_upload_path(instance, filename):
    return "rss/{0}/cover/{1}".format(instance.id,filename)

def item_vertical_upload_path(instance, filename):
    return "rss/item/{0}/large-{1}".format(instance.id,filename)

def item_horizontal_upload_path(instance, filename):
    return "rss/item/{0}/cover/{1}".format(instance.id,filename)




class FeedPost(models.Model):
    id = models.IntegerField(primary_key=True)
    slug = models.SlugField(max_length=100, null=True, blank=True, unique=True)

    title = models.CharField(max_length=400)
    link = models.URLField(blank=True, null=True)
    page_link = models.URLField(blank=True, null=True)
    description = models.TextField(max_length=300,null=True, blank=True, help_text="It should " +
            "generally contain 300 or more characters to provide an attractive, informative summary. ")
    pub_date = models.DateTimeField(null=True, blank=True)

    xml_content = models.TextField(max_length=50000,null=True, blank=True)

    creator = models.CharField(max_length=400, null=True, blank=True)

    poster = models.ImageField(blank=True, upload_to=vertical_upload_path)
    cover_poster = models.ImageField(blank=True, upload_to=horizontal_upload_path)

    movies = models.ManyToManyField(Movie, related_name="parent_feeds", null=True, blank=True)

    is_published = models.BooleanField(default=False)
    
    def __str__(self):
        return self.title

    @classmethod
    def create_from_topic(cls,slug=slug, add_movies=True):
        tqs = Topic.objects.filter(slug=slug)
        if tqs.exists():
            topic = tqs.first()
            # if post exist update
            if cls.objects.filter(slug=topic.slug).exists():
                post = cls.objects.filter(slug=topic.slug).first()
                post.slug = topic.slug
                post.title = topic.seo_title
                post.link = f"https://pixly.app/rss/{topic.slug}"
                post.page_link = f"https://pixly.app/topic/{topic.slug}"
                post.description = topic.seo_description
                post.save()
                print("Found existing Rss feed post and updated.")
            # if not create new post
            else:
                if cls.objects.order_by("id").last():
                    available_id = cls.objects.order_by("id").last().id + 1
                else:
                    available_id = 1
                post_dict = {}
                post_dict["id"] = available_id
                post_dict["slug"] = topic.slug
                post_dict["title"] = topic.seo_title
                post_dict["link"] = f"https://pixly.app/rss/{topic.slug}"
                post_dict["page_link"] = f"https://pixly.app/topic/{topic.slug}"
                post_dict["description"] = topic.seo_description

                post = cls.objects.create(**post_dict)
                print("Rss Feed post created. Adding Movies")
            
            # add movies
            if add_movies:
                topic_movies = topic.movies.all().only("id", "slug")
                for movie in topic_movies:
                    post.movies.add(movie)        
            print("Done! Don't forget to add cover photo and make is_published=True")


    def feed(self):
        from datetime import datetime
        fg = FeedGenerator()
        fg.id(self.page_link)
        fg.title(self.title)
        fg.description(self.description)
        fg.link( href=self.link, rel='self' )
        
        #image
        fg.image(url=self.cover_poster.url, title=f"{self.title} Image", link=self.cover_poster.url,
            width=900, height=500
        )
        fg.enclosure(self.cover_poster.url, , 'audio/mpeg')

        #pub date
        if self.pub_date:
            fg.pubDate = self.pub_date
        else:
            fg.pubDate = datetime.now()
            
        fg.language("en")
        #fg.guid(self.link)
        return fg
    
    @classmethod
    def add_movie_entry(cls,feed, movie):
        if movie.has_cover:
            entry = feed.add_entry()
            entry.id(f"https://pixly.app/movie/{movie.slug}")
            entry.title(f"{movie.name} ({movie.year})")
            entry.description(movie.seo_description)
            entry.link(href=f"https://pixly.app/movie/{movie.slug}")

    def save_rss(self):
        feed = self.feed()
        all_movies = self.movies.order_by("-imdb_rating").only("id", "slug", "imdb_rating")
        for movie in all_movies:
            FeedPost.add_movie_entry(feed, movie)
        feed.rss_file(f"templates/xml/{self.slug}.xml")






global_feed_dict = {
    "title": "Pixly - AI Assisted Movie Recommendation, Film Catalogues, Similar Movies",
    "link": "https://pixly.app/",
    "description": "Discover best movies that fit your cinema taste.",
    "language": "en"
}



"""

class FeedPostItem(models.Model):
    slug = models.SlugField(primary_key=True, unique=True)
    movie = models.OneToOneField(Movie, null=True, blank=True, on_delete=models.DO_NOTHING)
    title = models.CharField(max_length=400)
    link = models.URLField(blank=True, null=True)
    description = models.TextField(max_length=300,null=True, blank=True, help_text="It should " +
            "generally contain 300 or more characters to provide an attractive, informative summary. ")
    pub_date = models.DateTimeField(null=True, blank=True)

    creator = models.CharField(max_length=400, null=True, blank=True)

    poster = models.ImageField(blank=True, upload_to=item_vertical_upload_path)
    cover_poster = models.ImageField(blank=True, upload_to=item_horizontal_upload_path)
    
    def __str__(self):
        return self.title
    
"""