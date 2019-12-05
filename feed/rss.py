from django.contrib.syndication.views import Feed
from django.urls import reverse
from items.models import Topic, List


class LatestEntriesFeed(Topic):
    title = "The Movie Lists that You Should Look and Watch"
    link = "/rss/"
    description = "The great movie lists about interesting topics"

    def items(self):
        return Topic.objects.order_by('-updated_at')[:5]

    def item_title(self, item):
        return item.seoTitle

    def item_description(self, item):
        return item.summary

    # item_link is only needed if NewsItem has no get_absolute_url method.
    def item_link(self, item):
        return reverse('topic', args=[item.slug])