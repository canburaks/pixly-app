from django.contrib import admin
from .models import Post
from .models import  Tag




# Register your models here.
@admin.register(Post)
class PostAdmin(admin.ModelAdmin):
    list_display = ("id", "author","header")
    #inlines = [TagInline,]
    #raw_id_fields = ('author', "tag",)
    fields = ["seo_title", "seo_short_description", "seo_description", "wiki", "slug",
        "id", "header", "summary","active", "post_type","author","text"]
