from django.db import models
from django.contrib.syndication.views import Feed
from items.models import List, Topic, Movie
from rss.models import RSSFeed, PythonRSSFeed
from persons.profile import Profile
from django.urls import reverse
from django_mysql.models import (JSONField, SetTextField, ListTextField, SetCharField)
from django.utils.functional import cached_property
from django.conf import settings
from feedgen.feed import FeedGenerator


class CollectionsFeed(Feed):
    title = "Great Film Collections and Lists"
    link = "/rss/great-film-collections"
    description = "The Great Lists of Film Collections"
    author_name = 'Can Burak S.' # Hard-coded author name.
    author_email = 'canburaks@pixly.app' # Hard-coded author email.
    author_link = 'https://pixly.app/user/canburaks' # Hard-coded author URL.
    item_author_name = 'Can Burak S.' # Hard-coded author name.
    item_author_link = 'https://pixly.app/user/canburaks' # Hard-coded author URL.
    item_categories = ("movies", "movie lists", "film collections") # Hard-coded categories.

    def items(self):
        return RSSFeed.objects.filter(is_published=True).exclude(cover_poster="")

    def item_title(self, item):
        return item.title

    def item_description(self, item):
        return item.description

    def item_pub_date(self, item):
        return item.created_at

    # item_link is only needed if NewsItem has no get_absolute_url method.
    def item_link(self, item):
        return item.pathname

    def item_pubdate(self, item):
        return item.created_at

    def item_enclosure_url(self, item):
        return item.cover_poster.url

    def item_enclosure_length(self, item):
        return item.cover_poster.size

    def item_enclosure_mime_type(self, item):
        return "image/jpg"

    def item_categories(self, item):
        if len(item.tag)>0:
            return item.tag
        return ("movies", "movie lists", "film collections")


class PythonFeed(Feed):
    title = "Pixy - Technical Articles About Python and Django"
    link = "/rss/pixly-technical-tutorial-and-articles"
    description = "Python Django Tutorial and Articles"
    author_name = 'Can Burak S.' # Hard-coded author name.
    author_email = 'canburaks@pixly.app' # Hard-coded author email.
    author_link = 'https://pixly.app/user/canburaks' # Hard-coded author URL.
    item_author_name = 'Can Burak S.' # Hard-coded author name.
    item_author_link = 'https://pixly.app/user/canburaks' # Hard-coded author URL.
    item_categories = ("python",  "django", "django-react") # Hard-coded categories.

    def items(self):
        return PythonRSSFeed.objects.filter(is_published=True)

    def item_title(self, item):
        return item.title

    def item_description(self, item):
        return item.post.summary

    def item_pub_date(self, item):
        return item.created_at

    # item_link is only needed if NewsItem has no get_absolute_url method.
    def item_link(self, item):
        return item.pathname

    def item_pubdate(self, item):
        return item.created_at

    def item_enclosure_url(self, item):
        return item.post.cover.url

    def item_enclosure_length(self, item):
        return item.post.cover.size

    def item_enclosure_mime_type(self, item):
        return "image/jpg"

    def item_categories(self, item):
        if len(item.tag)>0:
            return item.tag
        return ("django", "python-django", "django-spa")