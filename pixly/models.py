from django.db import models
from django.conf import settings
from django.contrib.auth.models import User
from django.db.models.signals import post_save
from django_mysql.models import JSONField

from archive.custom_functions import threaded
from django.core.exceptions import ObjectDoesNotExist
from persona.myqueue import MyQueue
from archive import custom_functions as cbs
from persons.profile import Profile

# Create your models here.

class Contact(models.Model):
    ip = models.CharField(max_length=60, null=True, blank=True)
    profile = models.ForeignKey(Profile, on_delete=models.CASCADE, null=True, blank=True)
    name = models.CharField(max_length=60)
    email = models.EmailField(max_length=50)
    message = models.CharField(default="...", max_length=5000, editable=False)

    created_at = models.DateTimeField(auto_now_add=True, null=True)

    def __str__(self):
        return self.name
