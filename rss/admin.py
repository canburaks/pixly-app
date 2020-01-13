from django.contrib import admin

from .models import RSSFeed, PythonRSSFeed
# Register your models here.
@admin.register(RSSFeed)
class RSSFeedAdmin(admin.ModelAdmin):
    list_display = ('slug', "pathname","is_published",)
    #fields = ("slug", "topic", "liste", "title", "tag", "feed_type", "pathname", "cover_poster","is_published", "updated_at")

@admin.register(PythonRSSFeed)
class RSSFeedAdmin(admin.ModelAdmin):
    list_display = ('slug', "pathname","is_published",)
    #fields = ("slug", "post", "title", "tag","pathname", "cover_poster","is_published", "updated_at", "created_at")


# Register your models here.
#@admin.register(FeedPostItem)
#class FeedPostItemAdmin(admin.ModelAdmin):
#    list_display = ('title', "link", "pub_date",)
