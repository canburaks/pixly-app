from django.db import models
from django.conf import settings
from django.contrib.auth.models import User
from django.db.models.signals import post_save
from django_mysql.models import JSONField
from django.core.exceptions import ObjectDoesNotExist
from persons.profile import Profile
from items.models import Tag
from ckeditor.fields import RichTextField
from ckeditor_uploader.fields import RichTextUploadingField
from persons.abstract import SocialMedia, SEO, DateRecords, MainPage

POST_MAIN_TYPE = (
    ('t', "Tech"),
    ('c', "Cinema"),
    ('o', "Other"),

)
def post_poster_upload_path(instance, filename):
    return "posts/{0}/{1}".format(instance.id,filename)

# Create your models here.
class Post(SocialMedia, SEO, DateRecords, MainPage):
    id = models.IntegerField(primary_key=True)
    author = models.ForeignKey(Profile, related_name="posts", on_delete=models.CASCADE)

    header = models.CharField(max_length=300, null=True, blank=True)
    summary = models.TextField(max_length=500, null=True, blank=True, help_text="A brief summary of text")
    cover = models.ImageField(blank=True, upload_to=post_poster_upload_path)


    text = RichTextUploadingField(default="...", max_length=30000, null=True, blank=True, help_text="Only Content, Don't add H1 Heading")

    slug = models.SlugField(max_length=100, null=True, blank=True, unique=True)
    #tag = models.ManyToManyField(Tag, null=True, blank=True, related_name="posts")

    post_type = models.CharField(max_length=2, choices=POST_MAIN_TYPE, null=True, blank=True ,
                help_text="Type of post? (Tech, Cinema)")

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    data = JSONField(default=dict)
    active = models.BooleanField(default=False)

    def __str__(self):
        if not self.slug:
            self.add_slug()
        return self.header

    def add_slug(self):
        from django.utils.text import slugify
        try:
            self.slug = slugify(self.header)
            self.save()
        except:
            convert = f"{self.id} {self.header}"
            self.slug = slugify(convert)
            self.save()
