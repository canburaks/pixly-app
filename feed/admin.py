from django.contrib import admin

from .models import RSSFeed
# Register your models here.
@admin.register(RSSFeed)
class RSSFeedAdmin(admin.ModelAdmin):
    list_display = ('slug', "pathname","is_published",)


# Register your models here.
#@admin.register(FeedPostItem)
#class FeedPostItemAdmin(admin.ModelAdmin):
#    list_display = ('title', "link", "pub_date",)
