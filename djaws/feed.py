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

    def items(self):
        return Topic.objects.order_by('-updated_at')[:5]

    def item_title(self, item):
        return item.seo_title

    def item_description(self, item):
        return item.summary

    # item_link is only needed if NewsItem has no get_absolute_url method.
    def item_link(self, item):
        return f"/topic/{item.slug}"