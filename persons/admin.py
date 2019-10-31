from django.contrib import admin
from .models import Person, Director,Actor,  Crew, SocialMedia
from .profile import Profile, Follow, Activity, LogEntry, Info
from items.models import Video, Movie
# Register your models here.

class VideoPersonInline(admin.TabularInline):
    model = Video.related_persons.through
    raw_id_fields = ("video", )
    exclude = ("related_movies", )


class MoviePersonInline(admin.TabularInline):
    model = Movie


@admin.register(Profile)
class ProfileAdmin(admin.ModelAdmin):
    list_display = ("user",'username', "id", "user__id", "joined", "points")
    readony_fields = ("homepage", "twitter","facebook", "instagram", "imdb",)
    raw_id_fields = ['bookmarks', "videos", "liked_movies"]
    fields = ["user",'username', "email","cognito_status",
                "cognito_registered", "cognito_tokens",]

    def user__id(self, obj):
        return obj.user.id
    def points(self, obj):
        return len(obj.ratings.keys())
    

@admin.register(Person)
class PersonAdmin(admin.ModelAdmin):
    list_display = ("id",'name', "born", "died",)
    list_filter = ('active',)
    list_display_links = ("name",)
    search_fields = ('name', 'id', )
    inlines = [VideoPersonInline,]
    raw_id_fields = ["videos", ]
    readony_fields = ("homepage", "twitter","facebook", "instagram", "imdb",)

@admin.register(Crew)
class CrewAdmin(admin.ModelAdmin):
    list_display = ('person',"movie","job", "person_name")
    #fields = ("person_name", )
    #inlines = [ImagePersonInline,]

    list_display_links = ("person_name",)
    raw_id_fields = ["person", "movie"]
    search_fields = ('person__name', 'movie__name', )

    autocomplete_lookup_fields = {
        'fk': ['movie', "person"],
        #'m2m': ['related_persons',"related_movies", "related_topics", ],
    }


@admin.register(Director)
class DirectorAdmin(admin.ModelAdmin):
    list_display = ("id",'name',)
    list_filter = ('active',)
    search_fields = ('name', 'id', )

@admin.register(Actor)
class ActorAdmin(admin.ModelAdmin):
    list_display = ("id",'name',)
    search_fields = ('name', 'id', )


#@admin.register(PersonImage)
#class PersonImageAdmin(admin.ModelAdmin):
#    list_display = ("id","person","info","image" )
#    readony_fields = ("homepage", "twitter","facebook", "instagram", "imdb",)


@admin.register(LogEntry)
class LogEntryAdmin(admin.ModelAdmin):
    list_display = ("username", "action", "created_at", "ip")


@admin.register(Activity)
class ActivityAdmin(admin.ModelAdmin):
    list_display = ("profile", "action","target_profile_username", "movie_id", "person_id","liste_id", "created_at")


@admin.register(Info)
class InfoAdmin(admin.ModelAdmin):
    list_display = ("profile", "facebook_name","facebook_id", "facebook_email")
    fields = ["profile", "facebook_name","facebook_id", "facebook_email", "twitter_data",
            "facebook_data", "facebook_token"]