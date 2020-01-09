from django.db import models
from items.models import List, Topic, Movie
from persons.profile import Profile
from django.urls import reverse
from django_mysql.models import (JSONField, SetTextField, ListTextField, SetCharField)
from django.utils.functional import cached_property
from django.conf import settings
from feedgen.feed import FeedGenerator



def horizontal_upload_path(instance, filename):
    return "rss/{0}/cover/{1}".format(instance.slug,filename)


FEED_TYPE = (
    ('liste', "List"),
    ("topic", "Topic"),
    ("blog", "Blog Post"),
    ("movie", "Movie"),
)


class RSSFeed(models.Model):
    slug = models.SlugField(max_length=100, unique=True,primary_key=True)
    topic = models.OneToOneField(Topic, related_name='feed', on_delete=models.CASCADE, null=True, blank=True)
    liste = models.OneToOneField(List, related_name='feed', on_delete=models.CASCADE, null=True, blank=True)

    title = models.CharField(max_length=70, null=True, blank=True)
    tag = ListTextField(default = list(),base_field=models.CharField(max_length=60), null=True, blank=True)

    feed_type = models.CharField(max_length=6, choices=FEED_TYPE, null=True, blank=True)
    pathname = models.CharField(max_length=50, null=True, blank=True,help_text="page url without domain part.")
    cover_poster = models.ImageField(blank=True, upload_to=horizontal_upload_path, help_text="minimum 500px for the shorter dimension")

    is_published = models.BooleanField(default=False)
 
    created_at = models.DateTimeField(auto_now_add=True, null=True, blank = True)
    updated_at = models.DateTimeField(auto_now=True, null=True, blank = True)

    def __str__(self):
        return self.slug
    
    @classmethod
    def generate_id(cls):
        qs = cls.objects.all().order_by("id")
        if qs.exists():
            return qs.last().id + 1
        return 1
  
    @property
    def tags(self):
        return self.tags

    @property
    def description(self):
        if self.feed_type.startswith("t"):
            return self.topic.summary
        elif self.feed_type.startswith("l"):
            return self.liste.summary

    @property
    def updated_at(self):
        if self.feed_type.startswith("t"):
            return self.topic.updated_at
        elif self.feed_type.startswith("l"):
            return self.liste.updated_at

  

    @classmethod
    def create_from_topic(cls):
        published_parent_items = Topic.objects.filter(is_published=True).values_list("slug", flat=True)
        print(published_parent_items)
        for t_slug in published_parent_items:
            t = Topic.objects.filter(slug=t_slug).first()
            feed_post, created = cls.objects.update_or_create(slug=t_slug)
            feed_post.topic=t
            feed_post.title=t.seo_title
            feed_post.feed_type="topic"
            feed_post.pathname=f"/topic/{t.slug}"
            feed_post.save()

            status = "created" if created else "updated"
            print(f"RSS Feed {status} from Topic:{t.slug}")
        print("Done. Don't forget to add cover poster and make the feed items published")

    @classmethod
    def create_from_list(cls):
        published_parent_items = List.objects.filter(is_published=True).values_list("slug", flat=True)
        for l_slug in published_parent_items:
            l = List.objects.filter(slug=l_slug).first()

            feed_post, created = cls.objects.update_or_create(slug=l_slug)
            feed_post.slug=l.slug
            feed_post.liste=l
            feed_post.title=l.seo_title
            feed_post.feed_type="liste"
            feed_post.pathname=f"/list/{l.slug}"
            feed_post.save()

            status = "created" if created else "updated"
            print(f"RSS Feed {status} from List:{l.slug}")
        print("Done. Don't forget to add cover poster and make the feed items published")
