from django.contrib import admin
from .models import Contact
# Register your models here.
@admin.register(Contact)
class ContactAdmin(admin.ModelAdmin):
    list_display = ('email', "message", "created_at",)
    list_display_links = ("email",)
    search_fields = ('name', "email" )
    readony_fields = ("message",)
    fields = ("message", "email", "profile")
