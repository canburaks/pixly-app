from django.contrib import admin
from .models import Post
from .models import  Tag




# Register your models here.
@admin.register(Post)
class PostAdmin(admin.ModelAdmin):
    list_display = ("id", "author","header")
    #inlines = [TagInline,]
    #raw_id_fields = ('author', "tag",)
    fields = ["id", "header", "summary","text", "active","image", "post_type","author", "slug"]
