from django.contrib.sitemaps import Sitemap
from blog.models import Post
from django.urls import reverse

class PostSitemap(Sitemap):
    changefreq = "daily"
    priority = 0.9
    def items(self):
        lists =  Post.objects.filter(active=True).only("id", "slug").order_by("id")
        return lists
    
    def location(self, item):
        return f"/post/{item.slug}"


class StaticSitemap(Sitemap):
    changefreq = "weekly"
    priority = 0.8
    def items(self):
        statics = [ "/" ]
        return statics

    def location(self, item):
        return item
