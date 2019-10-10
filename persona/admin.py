from django.contrib import admin
from .models import Persona, Recommendation
from persons.profile import Profile, Follow

# Register your models here.
@admin.register(Recommendation)
class RecommendationAdmin(admin.ModelAdmin):
    list_display = ("user__id",'username', "movie__name", "movie__id", "prediction", "created_at")
    search_fields = ("movie__name", "movie__id" )

    def username(self, obj):
        return obj.profile.username

    def user__id(self, obj):
        return obj.profile.user.id
    
    def movie__name(self, obj):
        return obj.movie.name

    
    def movie__id(self, obj):
        return obj.movie.id