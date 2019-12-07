from django.db import models
from django.contrib.syndication.views import Feed
from items.models import List, Topic, Movie
from persons.profile import Profile
from django.urls import reverse
from django_mysql.models import (JSONField, SetTextField, ListTextField, SetCharField)
from django.utils.functional import cached_property
from django.conf import settings
from feedgen.feed import FeedGenerator


class TopicFeed(Feed):
    title = "Topic Film Lists"
    link = "/topics"
    description = "Updates on changes and additions to police beat central."
    author_name = 'Can Burak S.' # Hard-coded author name.
    author_email = 'canburaks@pixly.app' # Hard-coded author email.
    author_link = 'https://pixly.app/user/canburaks' # Hard-coded author URL.
    item_author_name = 'Can Burak S.' # Hard-coded author name.
    item_author_link = 'https://pixly.app/user/canburaks' # Hard-coded author URL.
    item_categories = ("movie", "film list") # Hard-coded categories.

    def items(self):
        return Topic.objects.order_by('-updated_at')[:5]

    def item_title(self, item):
        return item.seo_title

    def item_description(self, item):
        return item.summary

    def item_pub_date(self, item):
        return item.updated_at

    # item_link is only needed if NewsItem has no get_absolute_url method.
    def item_link(self, item):
        return f"/topic/{item.slug}"

    def item_pubdate(self, item):
        return item.updated_at

    def item_enclosure_url(self, item):
        return item.cover_poster.url

    def item_enclosure_length(self, item):
        return 1000

    def item_enclosure_mime_type(self, item):
        return "image/jpg"

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['foo'] = 'bar'
        return context