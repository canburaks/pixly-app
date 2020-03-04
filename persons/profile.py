from django.db import models
from django.conf import settings
from django.contrib.auth.models import User
from django.db.models.signals import post_save
from django_mysql.models import (JSONField, SetTextField, ListTextField, SetCharField)
from django_countries.fields import CountryField
from imagekit.models import ImageSpecField
from imagekit.processors import ResizeToFill
from archive.custom_functions import threaded
from django.core.exceptions import ObjectDoesNotExist
from persona.myqueue import MyQueue
from archive import custom_functions as cbs
from .abstract import SocialMedia, SEO
from collections import Counter
from pixly.lib import is_email_registered
import json
cc = cbs.cc

FOLLOW_TYPE = (
    ('u', 'Profile'),
    ('p', 'Person'),
    ('l', 'Liste'),
    ('t', 'Topic'),
)

def avatar_upload_path(instance, filename):
    return "avatars/{0}/{1}".format(instance.id,filename)

scan_recommendations = False

class Profile(SocialMedia, SEO):

    user = models.OneToOneField(settings.AUTH_USER_MODEL,
        verbose_name=("user"),on_delete=models.CASCADE)
    username = models.CharField(max_length=40, null=True, unique=True)
    name = models.CharField(max_length=40, null=True, blank=True)
    bio = models.CharField(default="...", max_length=140, null=True, blank=True)
    country = CountryField(blank=True, null=True)
    avatar = models.ImageField(upload_to=avatar_upload_path, blank=True, null=True)
    
    email = models.EmailField(max_length=50, null=True)
    joined = models.DateField(auto_now_add=True, null=True)
    born = models.DateField(null=True, blank=True)
    is_premium = models.BooleanField(default=False)



    # have ratings gte 40
    active = models.BooleanField(default=False)

    ratings = JSONField(default=dict, blank=True, null=True)
    bookmarks = models.ManyToManyField("items.Movie", related_name="bookmarked", blank=True, null=True)
    videos = models.ManyToManyField("items.Video", related_name="fav", blank=True, null=True)
    liked_movies = models.ManyToManyField("items.Movie", related_name="liked", blank=True, null=True)

    # -----Cognito----- 
    cognito_registered = models.BooleanField(default=False)
    cognito_verified = models.BooleanField(default=False)
    # add notes
    cognito_status = models.CharField(max_length=100, null=True, blank=True)

    # Cognito Tokens
    cognito_tokens = JSONField(default=dict, blank=True, null=True)
    #------------------------------
    should_change_password = models.BooleanField(default=False)

    #Social Media
    connected_with_facebook = models.BooleanField(default=False)
    registered_with_facebook = models.BooleanField(default=False)

    def __str__(self):
        return self.username

    @property
    def is_verified(self):
        if cognito_registered or registered_with_facebook:
            return True
        return False

    #for authenticated users only
    def get_or_create_social_account(self):
        from persons.profile import Social
        if not Social.objects.filter(profile=self).exists():
            info_obj = Social.objects.create(profile=self)
            self.connected_with_facebook = True
            self.save()
            print(f"new social accounts created for existing user: {self.username}")
            return info_obj
        return Social.objects.filter(profile=self).first()
        
    def get_statistics_object(self, force=False):
        from persons.profile import Statistics
        if not Statistics.objects.filter(profile=self).exists():
            mean = self.get_mean()
            stats_obj = Statistics(profile=self, mean=mean )
            stats_obj.calculate(force=force)
            stats_obj.save()
            return stats_obj

        stats_obj = Statistics.objects.filter(profile=self).first()
        stats_obj.calculate(force=force)
        return stats_obj

    def print_info(self, text):
        new_text = f"profile username:{self.username} --> " + text
        print(new_text)

    #in order to bulk update, does not save
    def set_seo_description_keywords(self, save=True):
        name = self.name if self.name != None else self.username
        description_text = f"{name}'s Pixly Profile; favourite movies, bookmarks, watchlist, favorite directors, "
        words = []
        keywords = ["Personal Cinema History", "Cinema Taste", name, "Favourite Movies"]
        
        description_text += "following people, "
        description_text += "followers, "
        
        self.seo_description = description_text
        self.seo_keywords = ", ".join(keywords)
        self.save()

    def rated_movie_list(self):
        qs = self.rates.select_related("movie").only("movie", "movie_id", "profile").all()
        ml = [x.movie for x in qs]
        return ml

    def follow_profile(self, target_profile):
        Follow.follow_profile(profile=self, target_profile=target_profile)

    def follow_person(self, target_person):
        Follow.follow_person(profile=self, person=target_person)

    def follow_topic(self, target_topic):
        Follow.follow_topic(profile=self, topic=target_topic)

    def follow_list(self, target_list):
        Follow.follow_liste(profile=self, liste=target_list)

    def rating_movieset(self):
        return self.rates.values_list("movie_id", flat=True)

    @property
    def int_movieset(self):
        return {int(x) for x in self.ratings.keys()}

    @property
    def token(self):
        from graphql_jwt import shortcuts
        return shortcuts.get_token(self.user)

    @property
    def points(self):
        return len(self.ratings.keys())
    
    def get_mean(self):
        values = cc.carray(list(self.ratings.values()))
        return round(cc.mean(values), 3)

    def isBookmarked(self,target):
        return target in self.bookmarks.all()

    def bookmarking(self, target, item="Movie"):
        from persons.profile import Activity
        if item=="Movie":
            if target not in self.bookmarks.all():
                self.bookmarks.add(target)
                self.save()
                Activity.objects.create(profile=self, action="bm", movie_id=target.id)
            elif target in self.bookmarks.all():
                self.bookmarks.remove(target)
                activity_qs = Activity.objects.filter(profile=self, action="bm", movie_id=target.id)
                activity_qs.delete()
                self.save()

    def fav(self, target, type):
        if type.lower().startswith("v"):
            if target not in self.videos.all():
                self.videos.add(target)
                self.save()
                Activity.objects.create(profile=self, action="lv", movie_id=target.id)
            elif target in self.videos.all():
                self.videos.remove(target)
                self.save()

        elif type.lower().startswith("m"):
            if target not in self.liked_movies.all():
                self.liked_movies.add(target)
                self.save()
                Activity.objects.create(profile=self, action="lm", movie_id=target.id)
            elif target in self.liked_movies.all():
                self.liked_movies.remove(target)
                activity_qs = Activity.objects.filter(profile=self, action="lm", movie_id=target.id)
                activity_qs.delete()
                self.save()


    def create_persona(self):
        # returns persona, create
        from persona.models import  Persona
        self_p = Persona.objects.create(id = self.user.id, user = self.user)
        return self_p
    
    @property
    def persona(self):
        from persona.models import Persona
        if self.points<40:
            self.print_info("has less than 40 ratings.(profile.persona function)")
            return None
        else:
            return Persona.objects.filter(user=self.user, id=self.user.id).defer("similars_dummy").first()

    def promote(self):
        if self.points>=40:
            self.set_seo_description_keywords()
            MyQueue.put(self.sync_movie_archives)
            print("*")
            MyQueue.put(self.sync_persona, full=True, create=True)
            print("*")
            MyQueue.put(self.scan_movies_by_rating, 5)
            print("*")
            MyQueue.put(self.scan_movies_by_rating, 4.5)
            print("*")
            MyQueue.put(self.scan_movies_by_rating, 4)
            self.sync_active_status()
            return True

    def rate(self, target, rate, **kwargs):
        from items.models import Rating, Movie
        from archive.models import UserArchive, MovieArchive
        notes = kwargs.get("notes")
        date = kwargs.get("date")
        movie_id = target.id     
        
        # Update profile.ratings       
        self.ratings.update({str(movie_id):float(rate)})
        self.save()

        #<---------------PROFILE RATING------------------------------------->
        self.print_info(f" movie id:{movie_id}, rating:{rate}, notes:{notes}, diary_date:{date}, new_points:{self.points}")
        
        r , created = Rating.objects.update_or_create(profile=self, movie=target)
        r.rating = rate
        r.notes = notes
        r.date = date
        r.save()
        print("created?",created)
        #<--------------------------------------------------------------->

        #<---------------PROMOTING------------------------------------->
        # WHEN PROFILE REACHED 40 RATING PROMOTE IT
        if len(self.ratings.keys())==40 and scan_recommendations:
            self.print_info("has reached exactly 40 points. NOW PROMOTING!!!")
            #threaded(self.promote)
            #MyQueue.put(self.promote)

            print("<--------PROMOTING---------------->")
            self.promote()
            self.sync_active_status()
            print("<----------------------------------->")
        #<--------------------------------------------------------------->


        #<---------------ACTIVE RATING------------------------------------->
        #IF PROFILE HAVE MORE THAN 40 RATINGS
        if len(self.ratings.keys())>40 and scan_recommendations:
            print("<----------ACTIVE RATING--------------------->")
            #threaded(self.active_rate, movie_id=movie_id, rating=rate )            
            
            # MovieArchive objects
            ma = MovieArchive.objects.filter(movie_id=movie_id).only("movie_id", "userset")[0]
            ma.userset.add(self.user.id)
            ma.save()

            #UPDATE IF PREVIOUS RECOMMENDATION IS EXISTS
            if self.persona:
                self.persona.update_recommendation(target, rate)

            #SCAN MOVIES IF RATING IS HIGHER THAN MEAN
            if rate >= 4:
                MyQueue.put(self.scan_movies_by_id, movie_id)

            # Persona objects
            if self.points>=40 and self.points//10==0:
                #only scan real users 
                self.print_info("points has increased by 10. Real users will be scanned.")
                MyQueue.put(self.sync_persona, full=False, create=True)
            elif self.points>=40 and self.points//20==0:
                #scan both dummy and real users
                self.print_info("points has increased by 20. New full scan will start.")
                MyQueue.put(self.sync_persona, full=True, create=True)
                MyQueue.put(self.scan_movies_by_rating, 5)
                MyQueue.put(self.scan_movies_by_rating, 4.5)
                MyQueue.put(self.scan_movies_by_rating, 4)
                MyQueue.put(self.scan_movies_by_rating, 3.5)

            print("<------------------------------------------------>")
        #<--------------------------------------------------------------->

        print("<------------------------------------------>")
        return r

    def get_recommendations(self):
        from persona.models import Recommendation
        return Recommendation.objects.filter(profile = self, prediction__gte = 4)

    def predict(self, target,zscore=False):
        from persona.models import Recommendation
        if self.can_predict(target):
            qs_check = Recommendation.objects.filter(profile = self, movie = target).order_by("-created_at")
            if qs.exists():
                record = qs.first()
                return record.prediction
            else:
                prediction =  self.persona.prediction(target.id)
                if prediction > 0.1:
                    self.persona.create_prediction_record(target.id, prediction)
                return prediction
        elif str(target.id) in self.ratings.keys():
            return self.ratings.get(target.id)
        else:
            return 0

    def can_predict(self, target):
        #CHECK RATED BEFORE
        if str(target.id) in self.ratings.keys():
            #print("Profile already rated the movie( self.can_predict) )")
            return False
        if self.points <= 40:
            #print("Profile has less than 40 points( self.can_predict) )")
            return False
        elif self.persona != None:
            return True
        
    def sync_movie_archives(self, force=False):
        from archive.models import MovieArchive
        # FORCE mode: Look all movies that includes user id. Then remove redundants
        # CHECK
        movie_archive_qs = MovieArchive.objects.filter(movie_id__in=self.int_movieset).only("movie_id", "userset")
        movie_archive_qs_ids = set(movie_archive_qs.values_list("movie_id", flat=True))
        if force==False:
            if movie_archive_qs_ids==self.int_movieset:
                self.print_info("MovieArchive movies already up to date.")
            else:
                #---------UPDATE RATED MOVIES-------------------------->
                    movie_archive_qs = MovieArchive.objects.filter(movie_id__in=self.int_movieset).only("movie_id", "userset")
                    for movie_archive in movie_archive_qs:
                        movie_archive.userset.add(int(self.user.id))
                        movie_archive.save()
                    self.print_info("MovieArchive movies was updated.")
            #----------UPDATE ALL MOVIE ARCHIVE OBJECTS------------->
        elif force==True:
            #check All MovieArchive that have my id
            movie_archive_qs_full = MovieArchive.objects.filter(userset__contains=self.user.id).defer("dummyset")
            movie_ids_have_me = set(movie_archive_qs_full.values_list("movie_id", flat=True))

            #not_update = self.int_movieset.intersection(movie_ids_have_me)
            will_update = self.int_movieset.difference(movie_ids_have_me)
            will_drop = movie_ids_have_me.difference(self.int_movieset)
            # DROP 
            if len(will_drop)>0:
                drop_qs = movie_archive_qs_full.filter(movie_id__in = will_drop)
                for d in drop_qs:
                    d.userset.remove(self.user.id)
                    d.save()
                self.print_info(f"has been dropped from userset of {len(will_drop)} movies.")
            # ADD
            if  len(will_update)>0:
                add_qs = MovieArchive.objects.filter(movie_id__in=will_update).only("movie_id", "userset")
                for ma in add_qs:
                    ma.userset.add(self.user.id)
                    ma.save()
                self.print_info(f"has been dropped from userset of {len(will_drop)} movies.")
        self.print_info("sync with MovieArchive objects finished.")

    def sync_rating_objects(self, force=False):
        from items.models import Rating, Movie
        qs_rating = Rating.objects.filter(profile=self).select_related("movie")
        qs_rating_movie_ids = set(qs_rating.values_list("movie__id", flat=True))
        if qs_rating_movie_ids==self.int_movieset:
            self.print_info("All ratings up to date.")
        else:
            will_delete = qs_rating_movie_ids.difference(self.int_movieset)
            if len(will_delete)>0:
                qs_rating.filter(movie__id__in = will_delete).delete()
            will_create = self.int_movieset.difference(qs_rating_movie_ids)
            if len(will_create)>0:
                for movie_id in will_create:
                    my_r = self.ratings.get(str(movie_id))
                    movie_obj = Movie.objects.get(id=movie_id)
                    Rating.objects.create(profile=self, movie=movie_obj, rating=float(my_r))

            #CHECK RATING VALUES OF EXISTINGS
            if force==True:
                will_checked = qs_rating_movie_ids.intersection(self.int_movieset)
                for movie_id in will_checked:
                    my_r = float(self.ratings.get(str(movie_id)))
                    record = Rating.objects.get(profile=self, movie__id=movie_id)
                    if my_r != float(record.rating):
                        record.rating = my_r
                        record.save()
        self.print_info("sync with item.rating objects finished.")

    def sync_persona(self, full=False, create=False):
        from persona.models import  Persona
        if self.persona!=None:
            self_p = self.persona
            self_p.scan_real()
            if full==True:
                self_p.scan_dummy()
            self_p.save()
            self.print_info("Persona object was updated with scan.")

        elif self.persona == None and create == True:
            self_p = self.create_persona()
            self_p.scan_real()
            if full==True:
                self_p.scan_dummy()
            self.print_info("Persona object was created and updated with scan.")

    def sync_active_status(self):
        self.active = True if self.points>39 else False
        self.print_info(f"Active status set to {self.active}.")
        self.save()
        return self.active

    def scan_movies_by_id(self, movie_id):
        if self.persona:
            print("Similar movies will be scanned by given movie id.")
            self.persona.scan_movies_by_id(movie_id=movie_id)
            return True
        else:
            self.print_info("There is no corresponding Persona object.")
            return False

    def scan_movies_by_rating(self, rating):            
        if self.persona:
            print("Similar movies will be scanned by given rating.")
            self.persona.scan_movies_by_rating(rating=rating)
            return True
        else:
            self.print_info("There is no corresponding Persona object.")
            return False


    def full_scan(self, queue=True, scan_movies=False):
        if queue:
            if scan_movies:
                MyQueue.put(self.scan_movies_by_rating, 5)
                MyQueue.put(self.scan_movies_by_rating, 4.5)
        else:
           self.sync_rating_objects(force = True)
           self.sync_movie_archives(force = True)
           self.sync_persona(full = True, create = True)
           self.sync_active_status()

    def delete_rate(self, target):
        from items.models import Rating, Movie
        from archive.models import UserArchive, MovieArchive
        movie, movie_id = cbs.target_type_checker(target)
        print("Deletion info:\n")
        print(f"movie id:{movie_id}, user_id:{self.user.id} and username:{self.username}\n\n")
        if self.ratings.get(str(movie_id)):
            del self.ratings[str(movie_id)]
            self.save()
            print("Rating deleted from profile.ratings")
        else:
            print(f"There no movie with id:{movie_id} in profile.ratings")

        # RATING OBJECT
        if Rating.objects.filter(movie=movie, profile=self).exists():
            Rating.objects.filter(movie=movie, profile=self)[0].delete()
            print("Rating was deleted from Rating objects.")

        #MOVIEARCHIVE
        mqs = MovieArchive.objects.filter(movie_id=movie_id).defer("dummyset")
        if mqs.count()==1:
            ma = mqs[0]
            if self.user.id in ma.userset:
                ma.userset.remove(self.user.id)
                ma.save()
                print("Rating is deleted from userset of MovieArchive object.")

        # 40 RATING THRESHOLD CHECK
        self.sync_active_status()

    def pre_delete_user(self):
        rating_qs = self.rates.all()
        movies = [x.movie for x in  rating_qs]
        for movie in movies:
            try:
                self.delete_rate(movie)
            except:
                continue
        self.ratings = {}
        self.save()

    def __delete_recommendations(self):
        from persona.models import Recommendation
        rec_qs = Recommendation.objects.filter(profile = self)
        rec_qs.delete()


class Social(models.Model):
    profile = models.OneToOneField(Profile, on_delete=models.CASCADE, null=True,
        blank=True, related_name="social", db_index=True)
    tutorial = models.BooleanField(default=True)

    facebook_data = JSONField(default=dict, blank=True, null=True)
    facebook_name = models.CharField(max_length=50, null=True, blank=True, unique=True)
    facebook_id = models.CharField(max_length=40, null=True, blank=True, unique=True)
    facebook_email = models.EmailField(max_length=50, null=True, unique=True)
    facebook_token = models.TextField(max_length=5000,null=True, blank=True)
    facebook_sign = models.TextField(max_length=5000,null=True, blank=True)

    twitter_data = JSONField(default=dict, blank=True, null=True)
    twitter_username = models.CharField(max_length=40, null=True, blank=True, unique=True)

    #for email clashes notes { facebook:False, twitter: True}
    email_clash = JSONField(default=dict, blank=True, null=True)


    def __str__(self):
        return self.profile.username

    @classmethod
    def check_with_facebook_email(cls, email):
        return cls.objects.filter(facebook_email=email).exists()
    
    @classmethod
    def get_with_facebook_email(cls, email):
        if cls.objects.filter(facebook_email=email).exists():
            return cls.objects.filter(facebook_email=email).first()
        return False
    
    def save_facebook_data(self, fb_data):
        #print("is fb_data string: ", isinstance(fb_data,str))
        fb_data = json.loads(fb_data) if isinstance(fb_data, str) else fb_data

        #pprint(fb_data["profile"])
        self.facebook_data = fb_data

        if fb_data.get("profile"):
            fb_profile = fb_data.get("profile")

            #check email clash for new accounts
            #print("1")
            if not self.facebook_id or not self.facebook_email:
                #print("2")
                have_email_clash = is_email_registered(fb_profile.get("email"))
                #print("have email clash: ", have_email_clash)
                self.email_clash["facebook"] = have_email_clash
                self.profile.connected_with_facebook = True

            # set fb data
            self.facebook_email = fb_profile.get("email")
            self.facebook_name = fb_profile.get("name")
            self.facebook_id = fb_profile.get("id")

        #print("3")
        # set token details
        if fb_data.get("tokenDetail"):
            #print("4")
            token_data = fb_data.get("tokenDetail")
            self.facebook_token = token_data.get("accessToken")
            self.facebook_sign = token_data.get("signedRequest")
        #print("facebook data is saved")
        self.save()


class Statistics(models.Model):
    profile = models.OneToOneField(Profile, on_delete=models.CASCADE, null=True,
        blank=True, related_name="statistics", db_index=True)

    mean = models.DecimalField(null=True, blank=True, max_digits=4, decimal_places=3)

    #for checkout calculation is needed or not
    previous_points = models.IntegerField(default=0)

    #bleows are non-distincts
    director_ids = ListTextField(base_field=models.CharField(max_length=12), null=True, blank=True)
    actor_ids = ListTextField(base_field=models.CharField(max_length=12), null=True, blank=True)
    list_ids = ListTextField(base_field=models.IntegerField(), null=True, blank=True)
    genre_slugs = ListTextField(base_field=models.CharField(max_length=20), null=True, blank=True)
    tag_slugs = ListTextField(base_field=models.CharField(max_length=20), null=True, blank=True)

    #distinct values
    director_num =  models.IntegerField(default=0)
    actor_num = models.IntegerField(default=0)
    tag_num = models.IntegerField(default=0)
    genre_num = models.IntegerField(default=0)

    def __str__(self):
        return self.profile.username

    def most_lists(self, quantity=6):
        return Counter(self.list_ids).most_common(quantity)

    def most_directors(self, quantity=6):
        return Counter(self.director_ids).most_common(quantity)

    def most_actors(self, quantity=6):
        return Counter(self.actor_ids).most_common(quantity)

    def most_tags(self, quantity=6):
        return Counter(self.tag_slugs).most_common(quantity)
    
    def most_genres(self, quantity=6):
        return Counter(self.genre_slugs).most_common(quantity)

    def calculate(self, force=False):
        if self.previous_points != self.profile.points or force==True:
            try:
                self.set_crew_ids()
                self.set_tag_and_genre_slugs()
                self.set_list_ids()
                self.previous_points = self.profile.points
                self.save()
            except:
                print(f"Error! Statistics calclate_values --> {self.profile.username}")

    def get_all_crews_qs(self):
        # Return queryset of all crews from profile's ratings
        from persons.models import Crew
        movie_ids = self.profile.ratings.keys()
        cqs = Crew.objects.select_related("person").filter(
            movie__id__in=movie_ids, job__in=["D", "A"]).only(
            "person__id", "job")
        return cqs

    def set_crew_ids(self):
        cqs = self.get_all_crews_qs()
        #directors
        cqs_directors = cqs.filter(job="D")
        d_ids = [x.person.id for x in cqs_directors if x.id != None]
        self.director_ids = d_ids
        self.director_num = len(set(d_ids))

        #actors
        cqs_actors = cqs.filter(job="A")
        a_ids = [x.person.id for x in cqs_actors if x.id != None]
        self.actor_ids = a_ids
        self.actor_num = len(set(a_ids))
        self.save()
        print(f"{self.profile.username} crew ids and crews_num were set.")

    #genre tags
    def set_tag_and_genre_slugs(self):
        from items.models import Tag, Movie
        tag_slugs = []
        genre_slugs = []
        genre_list = Tag.objects.filter(genre_tag=True).values_list("slug", flat=True)
        movie_ids = self.profile.ratings.keys()
        mqs = Movie.objects.filter(id__in=movie_ids).prefetch_related("tags").values_list("tags__slug", flat=True)
        for slug in mqs:
            if slug != None:
                tag_slugs.append(slug)
                if slug in genre_list:
                    genre_slugs.append(slug)
        self.tag_slugs = tag_slugs
        self.tag_num = len(set(tag_slugs))

        self.genre_slugs = genre_slugs
        self.genre_num = len(set(genre_slugs))

        self.save()
        print(f"{self.profile.username} tag and genre slugs and tag and genre num were set.")


    def set_list_ids(self):
        from items.models import List, Movie
        movie_ids = self.profile.ratings.keys()
        mqs = Movie.objects.filter(id__in=movie_ids).prefetch_related("lists").values_list("lists__id", flat =True)

        self.list_ids = [x for x in mqs if x != None]
        self.save()
        print(f"{self.profile.username} list ids was set.")


class Follow(models.Model):
    profile = models.ForeignKey(Profile, on_delete=models.CASCADE, related_name="following")
    
    target_profile = models.ForeignKey(Profile, on_delete=models.CASCADE,  null=True,
            blank=True, related_name="followers")
    person = models.ForeignKey("persons.Person", on_delete=models.CASCADE,  null=True,
            blank=True, related_name="followers")
    liste = models.ForeignKey("items.List", on_delete=models.CASCADE,  null=True,
            blank=True, related_name="followers")
    topic = models.ForeignKey("items.Topic", on_delete=models.CASCADE,  null=True,
            blank=True, related_name="followers")

    typeof = models.CharField(max_length=1, choices=FOLLOW_TYPE)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = (("profile","target_profile"), ("profile", "person"),
                ("profile", "liste"), ("profile","topic"),)

    def __str__(self):
        if self.target_profile:
            target =  self.target_profile.username
        elif self.person:
            target = self.person.name
        elif self.liste:
            target = self.liste.name
        elif self.topic:
            target = self.topic.name
        
        return "{}---{}".format(self.profile.username, target)

    @classmethod
    def follow_profile(cls, profile, target_profile):
        from persons.profile import Activity
        qs = cls.objects.filter(profile=profile, target_profile=target_profile)
        if qs.count()==0:
            cls(profile=profile, target_profile=target_profile, typeof="u").save()
        else:
            unfollow = qs[0]
            activity = Activity.objects.filter(profile=profile,target_profile_username=target_profile.username, action="fu")
            if activity.exists():
                activity.delete()
            unfollow.delete()

    @classmethod
    def follow_person(cls, profile, person):
        qs = cls.objects.filter(profile=profile, person=person)
        if qs.count()==0:
            cls(profile=profile, person=person, typeof="p").save()
        else:
            unfollow = qs[0]
            activity = Activity.objects.filter(profile=profile,person_id=person.id, action="fp")
            if activity.exists():
                activity.delete()
            unfollow.delete()

    @classmethod
    def follow_liste(cls, profile, liste):
        qs = cls.objects.filter(profile=profile, liste=liste)
        if qs.count()==0:
            cls(profile=profile, liste=liste, typeof="l").save()
        else:
            unfollow = qs[0]
            activity = Activity.objects.filter(profile=profile,liste_id=liste.id, action="fl")
            if activity.exists():
                activity.delete()
            unfollow.delete()

    @classmethod
    def follow_topic(cls, profile, topic):
        qs = cls.objects.filter(profile=profile, topic=topic)
        if qs.count()==0:
            cls(profile=profile, topic=topic, typeof="t").save()
        else:
            unfollow = qs[0]
            unfollow.delete()


EVENT_TYPE = (
    ('rm', 'rating-movie'),
    ('bm', 'bookmark-movie'),
    ("lm", "like-movie"),
    ("lv", "like-video"),
    ('fp', 'follow-person'),
    ('fu', 'follow-user'),
    ('fl', 'follow-list'),
)



class Activity(models.Model):
    profile = models.ForeignKey(Profile, on_delete=models.CASCADE, related_name="activities", db_index=True)

    action = models.CharField(max_length=2, choices=EVENT_TYPE)

    target_profile_username = models.CharField(max_length=40, null=True, blank=True)

    movie_id = models.IntegerField(null=True, blank=True)

    rating = models.DecimalField(max_digits=2, decimal_places=1, null=True, blank=True)

    person_id = models.CharField(max_length=19, null=True, blank=True)

    liste_id = models.IntegerField(null=True, blank=True)

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        if self.target_profile_username:
            target =  self.target_profile_username
        elif self.person_id:
            target = self.person_id
        elif self.liste_id:
            target = self.liste_id
        elif self.movie_id:
            target = self.movie_id
        
        return "{}--{}--{}".format(self.profile.username, self.action, target)



class LogEntry(models.Model):
    action = models.CharField(max_length=64)
    ip = models.GenericIPAddressField(null=True)
    username = models.CharField(max_length=256, null=True)
    created_at = models.DateTimeField(auto_now_add=True, null=True)


    def __str__(self):
        return '{3} {0} - {1} - {2}'.format(self.action, self.username, self.ip, self.created_at)



#######################################################################################


def post_save_follow_signal(sender, instance, created, *args, **kwargs):
    if created:
        record_dict = {}
        try:
            if instance.typeof=="u":
                record_dict["action"] = "fu"
                record_dict["target_profile_username"] = instance.target_profile.username
            elif instance.typeof=="p":
                record_dict["action"] = "fp"
                record_dict["person_id"] = instance.person.id
            elif instance.typeof=="l":
                record_dict["action"] = "fl"
                record_dict["liste_id"] = instance.liste.id
            record_dict["profile"] = instance.profile
            a = Activity(**record_dict)
            a.save()
        except:
            print("Rating Signal failed.")

post_save.connect(post_save_follow_signal, sender=Follow)


def post_save_user_model_receiver(sender, instance, created, *args, **kwargs):
    if created:
        try:
            if (instance.first_name and instance.last_name):
                name = "{} {}".format(instance.first_name, instance.last_name)
            else:
                name=None
            p = Profile(user=instance, email=instance.email, username=instance.username,joined= instance.date_joined, name=name)
            p.save()
        except:
            print("Error:")



post_save.connect(post_save_user_model_receiver, sender=settings.AUTH_USER_MODEL)



######################################################################################

"""
Activity.objects.all().count()

bulk = []
qs = Rating.objects.select_related("movie", "profile").all()
for r in qs:
    bulk.append(Activity(profile=r.profile, action="rm", movie_id=r.movie.id, created_at=r.created_at, rating=r.rating))


fbulk = []
qs = Follow.objects.select_related("profile", "target_profile").filter(typeof="u")
for f in qs:
    fbulk.append(Activity(profile= f.profile, action="fu", target_profile_username=f.target_profile.username))

fbulk = []
qs = Follow.objects.select_related("profile", "target_profile").filter(typeof="u")
for f in qs:
    fbulk.append(Activity(profile= f.profile, action="fu", target_profile_username=f.target_profile.username))

Activity.objects.bulk_create(fbulk)
"""