from django.db import models
from django.conf import settings
from django.contrib.auth.models import User
from django.db.models.signals import post_save
from django_mysql.models import JSONField
from django.core.cache import cache
from .profile import Profile, Follow, Activity
from .abstract import SocialMedia, SEO,MainPage
import requests


JOB = (
    ('d', 'Director'),
    ('a', 'Actor/Actress'),
    ('w', 'Writer'),
    ('e', 'Editor'),
    ('f','Director of Photography'),#Cinematography
)


def person_image_upload_path(instance, filename):
    return "person/{0}/pictures/{1}".format(instance.person.id,filename)

def person_poster_upload_path(instance, filename):
    return "person/{0}/pictures/{1}".format(instance.id,filename)

def director_square_poster_upload_path(instance, filename):
    return "person/{0}/pictures/square/{1}".format(instance.id,filename)

def director_cover_poster_upload_path(instance, filename):
    return "person/{0}/pictures/cover/{1}".format(instance.id,filename)

def url_image(url, filename):
    from django.core import files
    from io import BytesIO
    import requests
    
    response = requests.get(url)
    fp = BytesIO()
    fp.write(response.content)
    return filename, files.File(fp)

def get_poster_url(self):
    if self.data.get("tmdb_poster_path"):
        return self.data.get("tmdb_poster_path")
    else:
        try:
            plinks = self.tmdb.poster_links()
            if plinks.get("tmdb_poster_path"):
                return plinks.get("tmdb_poster_path")
        except:
            return None

class Person(SocialMedia, SEO, MainPage):

    id = models.CharField(primary_key=True, max_length=9,
        help_text="Use Imdb Id, if exists. " + 
        "Otherwise use prefix 'pp' with 7 digit number. \n" + 
        "E.g: \n If Imdb Id=nm0000759  than enter 'nm0000759' as Id.\n" + 
        "Otherwise: enter like 'pp0000001' or 'pp1700001'.(2letter(pp) + 7digit)")
    tmdb_id = models.IntegerField(null=True, blank=True)
    name = models.CharField(max_length=40)
    slug = models.SlugField(max_length=100, null=True, blank=True, unique=True)

    bio = models.CharField(max_length=6000, null=True)
    short_bio = models.CharField(max_length=1000, null=True, blank=True)

    job = models.CharField(max_length=len(JOB), choices=JOB, null=True, blank=True,)

    born = models.DateField(null=True, blank=True)
    died = models.DateField(null=True, blank=True)
    data = JSONField(blank=True,null=True)# {"job": ["director","writer", etc.]}
    active = models.BooleanField(default=False, help_text="if ready for show on web page make it true")
    poster = models.ImageField(blank=True, upload_to=person_poster_upload_path)
    square_poster = models.ImageField(blank=True, upload_to=director_square_poster_upload_path)
    cover_poster = models.ImageField(blank=True, upload_to=director_cover_poster_upload_path)
    #sum of all jobs in crew models
    work_quantity = models.IntegerField(null=True, blank=True)

    def __str__(self):
        return self.slug

    def add_slug(self):
        from django.utils.text import slugify
        try:
            convert = f"{self.name}"
            self.slug = slugify(convert)
            self.save()
        except:
            convert = f"{self.tmdb_id} {self.name}"
            self.slug = slugify(convert)
            self.save()

    @property
    def directed(self):
        from persons.models import Crew
        cqs = Crew.objects.filter(person=self, job="d").select_related("movie").only(
                "movie__slug", "movie__name", "movie__id", "job", "person"
            ).order_by("-movie__imdb_rating")
        return cqs
        
    @property
    def played(self):
        from persons.models import Crew
        cqs = Crew.objects.filter(person=self, job="a").select_related("movie").only(
                "movie__slug", "movie__name", "movie__id", "job", "person"
            ).order_by("-movie__imdb_rating")
        return cqs

    @property
    def wrote(self):
        from persons.models import Crew
        cqs = Crew.objects.filter(person=self, job="w").select_related("movie").only(
                "movie__slug", "movie__name", "movie__id", "job", "person"
            ).order_by("-movie__imdb_rating")
        return cqs


    @classmethod
    def images_all(cls):
        image_set = []
        aws = settings.MEDIA_URL
        actives = cls.objects.filter(active = True)
        first200 = cls.objects.filter(active = False, job="d").order_by("tmdb_id")[:100]
        for a in actives:
            if a.poster and len(a.poster) >5:
                image_set.append(f"{aws}{a.poster}")
        for o in first200:
            if o.poster and len(o.poster) >5:
                image_set.append(f"{aws}{o.poster}")
        print(image_set)
        return image_set

    @staticmethod
    def autocomplete_search_fields():
        return ("id__iexact","tmdb_id__iexact", "name__icontains",)

    @property
    def tmdb(self):
        from gql.tmdb_class import Person as TP
        if self.tmdb_id:
            return TP(self.tmdb_id)


    #def save_poster_from_url(self, force=False):
    #    from gql.functions import url_image, get_poster_url
    #    if force==False:
    #        if self.poster and hasattr(self.poster, "url"):
    #            print("Person already have poster")
    #            pass
    #        else: 
    #            if get_poster_url(self):
    #                poster_url = get_poster_url(self)
    #                filename = "{}-poster.jpg".format(self.id)
    #                self.poster.save(*url_image(poster_url, filename))
    #            else:
    #                print("1-person poster url could not found")
    #    elif force==True:
    #        poster_url = get_poster_url(self)
    #        if poster_url:
    #            filename = "{}-poster.jpg".format(self.id)
    #            self.poster.save(*url_image(poster_url, filename))
    #            print("poster saved")
    #        else:
    #            print("2-person poster url could not found")


    #update existing person (first 75000 handled 26/08/2019 tmdb_id)
    def update_from_tmdb(self):
        tmdb_person = self.tmdb
        tmdb_data = tmdb_person.extended_details()
        if tmdb_data.get("place_of_birth"):
            self.data["place_of_birth"] = tmdb_data.get("place_of_birth")

        imdb_id = tmdb_data.get("imdb_id")
        if (self.imdb == None ) and (imdb_id != None):
            self.imdb = f"https://www.imdb.com/title/{imdb_id}"
        
        bio = tmdb_data.get("biography")
        if self.bio and bio and (len(bio) > len(self.bio)):
            self.bio = bio

        homepage = tmdb_data.get("homepage")
        if self.homepage == None and  homepage != None:
            self.homepage = homepage

        ext_ids = tmdb_data.get("external_ids")
        if ext_ids:
            if self.facebook == None and (ext_ids.get("facebook_id") != None and len(ext_ids.get("facebook_id")) > 3):
                fb_id = ext_ids.get("facebook_id")
                self.facebook = f"https://www.facebook.com/{fb_id}"

            if self.twitter == None and (ext_ids.get("twitter_id") != None and len(ext_ids.get("twitter_id")) > 3):
                tw_id = ext_ids.get("twitter_id")
                self.facebook = f"https://www.twitter.com/{tw_id}"

            if self.instagram == None and (ext_ids.get("instagram_id") != None and len(ext_ids.get("instagram_id")) > 3):
                insta_id = ext_ids.get("instagram_id")
                self.facebook = f"https://www.instagram.com/{insta_id}" 
        self.save()


    #create new person
    @classmethod
    def create_from_tmdb(cls, tmdb_id):
        from gql.tmdb_class import Person as TP
        tmdb_person = TP(tmdb_id)
        tmdb_data = tmdb_person.extended_details()
        new_p_dict = {}
        new_p_dict["id"] = tmdb_data.get("imdb_id")
        new_p_dict["tmdb_id"] = tmdb_id
        new_p_dict["name"] = tmdb_data.get("name")
        new_p_dict["bio"] = tmdb_data.get("biography")
        
        ext_ids = tmdb_data.get("external_ids")
        homepage = tmdb_data.get("homepage")
        ext_ids["homepage"] = homepage

        new_data = {"external_ids": ext_ids, "homepage":homepage}
        new_p_dict["data"] = new_data

        new_person = cls(**new_p_dict)
        new_person.save()
        print("New Person created")


        poster_path = tmdb_data.get("poster_path")
        if poster_path:
            poster_base_url = "https://image.tmdb.org/t/p/w185"# + "poster_path"
            poster_url = poster_base_url + poster_path
            poster_filename = f"{new_person.id}-poster.jpg"
            new_person.poster.save(*url_image(poster_url, poster_filename))
            print("poster saved")
        return new_person

    #in order to do bulk update, does not save
    def set_seo_description_keywords(self, save=True):
        from items.models import Tag
        # KEYWORDS
        final_keywords =[f"{self.name}; filmography"]
        if self.bio and len(self.bio) > 100:
            final_keywords.append("Biography")
        if self.poster:
            final_keywords.append("Photos")
        # DESCRIPTION
        final_text = ""
        words = []
        cqs = Crew.objects.filter(person=self)
        if cqs.filter(job="d").count() > 0 and cqs.filter(job="a").count() > 0:
            words.append(f"{self.name}'s filmography; acted movies and  movies that are directed by {self.name} ")
        elif cqs.filter(job="d").count() > 0 and  cqs.filter(job="a").count() == 0:
            words.append(f"movies that are directed by {self.name}")
        elif cqs.filter(job="d").count() == 0 and cqs.filter(job="a").count() > 0:
            words.append(f"{self.name}'s acted movies")
        if self.related_lists.filter(list_type="df").count() > 0:
            words.append(f"favourite movie lists of the director")
        if self.facebook or self.twitter or self.instagram:
            words.append("social media accounts.")
            final_keywords.append("Social Media Accounts")
        final_text = " ,".join(words)
        #check video content   f"Various stuff about {self.name} like; " 
        pvqs = self.videos.filter(tags__isnull=False)
        if pvqs.count() > 0:
            final_keywords.append("Videos")
            video_words = []
            video_tags = Tag.objects.filter(related_videos__in=pvqs).values_list("slug", flat=True)
            if "conversation" in video_tags:
                video_words.append(f"coversation")
                final_keywords.append("Video Conversation")
            if "interview" in video_tags:
                video_words.append(f"interview")
                final_keywords.append("Video Interview")
            if "film-review" in video_tags:
                video_words.append(f"film review")
                final_keywords.append("Review")
            if "video-essay" in video_tags:
                video_words.append(f"video essay")
                final_keywords.append("Video Essays")
            if len(video_words) > 0:
                if len(video_words) >1 :
                    video_partial_text = " ,".join(video_words[:-1]).capitalize() + " and " + video_words[-1]
                    final_text = final_text + " " + video_partial_text + f" about {self.name}"
                else:
                    final_text = final_text + f" about {self.name}"
        #check characters
        if len(final_text)< 140:
            if self.directed.count() > self.played.count():
                directeds = [x.movie.name for x in self.directed[:3]]
                directed_text = f" Films directed by {self.name} are " + ", ".join(directeds) + "..."
                final_text = final_text + directed_text
                self.seo_description = final_text + "."
                self.seo_keywords = ", ".join(final_keywords)
                if save:
                    self.save()
                #print(self.seo_description)
                #print(self.seo_keywords)
                return (self.seo_description, self.seo_keywords)
            else:
                acteds = [x.movie.name for x in self.directed[:3]]
                acted_text = f"Movies that {self.name} was played on are " + ", ".join(acteds) + "..."
                final_text = final_text + acted_text
                self.seo_description = final_text + "."
                self.seo_keywords = ", ".join(final_keywords)
                if save:
                    self.save()
                #print(self.seo_description)
                #print(self.seo_keywords)
                return (self.seo_description, self.seo_keywords)
        self.seo_description = final_text + "."
        self.seo_keywords = ", ".join(final_keywords)
        if save:
            self.save()
        #print(self.seo_description)
        #print(self.seo_keywords)
        return (self.seo_description, self.seo_keywords)

    def set_richdata(self, save=True):
        from gql.rich_data import RichData
        rdf = RichData.create_person_data(self)
        if len(rdf.keys()) > 3:
            self.richdata = rdf
        if save:
            self.save()

class Crew(models.Model):
    movie = models.ForeignKey("items.Movie", related_name="crews", on_delete=models.CASCADE)
    person = models.ForeignKey(Person, on_delete=models.CASCADE)
    job = models.CharField(max_length=len(JOB), choices=JOB, null=True, blank=True)
    data = JSONField(blank=True,null=True)#
    character = models.TextField(max_length=100, null=True, blank=True)

    def __str__(self):
        return self.person.name
    class Meta:
        unique_together = ("person","movie", "job")

    @property
    def person_name(self):
        return self.person.name

JOB = (
    ('d', 'Director'),
    ('a', 'Actor/Actress'),
    ('w', 'Writer'),
    ('e', 'Editor'),
    ('f','Director of Photography'),#Cinematography
)






##########################################################################################

#######################################################################################
# DIRECTOR PROXY MODEL
class DirectorManager(models.Manager):
    def get_queryset(self):
        return super(DirectorManager, self).get_queryset().filter(job='d')

    def create(self, **kwargs):
        kwargs.update({'job': 'd'})
        return super(DirectorManager, self).create(**kwargs)

class Director(Person):
    objects = DirectorManager()
    class Meta:
        proxy = True
#####################################################################################

# ACTOR PROXY MODEL
class ActorManager(models.Manager):
    def get_queryset(self):
        return super(ActorManager, self).get_queryset().filter(job='a')

    def create(self, **kwargs):
        kwargs.update({'job': 'a'})
        return super(ActorManager, self).create(**kwargs)

class Actor(Person):
    objects = ActorManager()
    class Meta:
        proxy = True
######################################################################################




