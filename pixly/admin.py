from django.contrib import admin
from .models import Contact
# Register your models here.
@admin.register(Contact)
class ContactAdmin(admin.ModelAdmin):
    list_display = ('name', "created_at",)
    list_display_links = ("name",)
    search_fields = ('name', )
    readony_fields = ("message",)
