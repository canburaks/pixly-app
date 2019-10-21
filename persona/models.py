from django.contrib.auth.models import User
from django.db import models
from django.db import models
from django.conf import settings
from django.db.models import IntegerField, Model
from django_mysql.models import SetCharField, SetTextField, JSONField
from django.db.models.signals import post_save
from collections import namedtuple
from archive import custom_functions as cbs
from archive.models import UserArchive, MovieArchive, MovSim
from persons.profile import Profile
from items.models import Movie, Rating
from archive.custom_functions import chronometer
from django.db.models import Q
from tqdm import tqdm
import os, sys, inspect
from pprint import pprint

"""
cmd_subfolder = os.path.realpath(os.path.abspath(os.path.join(os.path.split(inspect.getfile( inspect.currentframe() ))[0],"cython")))
if cmd_subfolder not in sys.path:
    sys.path.insert(0, cmd_subfolder)
"""

from django.utils.functional import cached_property
from django.core.cache import cache
import time
from archive.models import cc
# Create your models here.
from archive import custom_functions as cbs
from .myqueue import MyQueue

print_log = False


class Persona(Model):
    id = models.IntegerField(primary_key=True, unique=True) # !!! User Id !!! if can
    # user can be null for future deleting accounts
    user = models.OneToOneField(settings.AUTH_USER_MODEL, verbose_name=("user"),on_delete=models.SET_NULL, null=True)

    similars_dummy = JSONField(default=dict) # {"157":{ "mean": 3.14,"quntity":18, "similarity":0.25 }}
    similars_real = JSONField(default=dict) # {"157":{ "mean": 3.14,"quntity":18, "similarity":0.25 }}


    def __str__(self):
        return str(self.user.id)


    def print_info(self, text):
        if print_log==True:
            new_text = f"Persona user_id:{self.id} --> " + text
            print(new_text)


    @property
    def profile(self):
        return self.user.profile

    @property
    def ratings(self):
        return self.user.profile.ratings

    @property
    def movieset(self):
        return self.profile.int_movieset
        

    def values(self, c=True):
        values = list(self.ratings.values())
        if c:
            return cc.carray(values)
        return values

    def get_mean(self):
        return round(cc.mean(self.values()), 3)



    def update_recommendation(self, target, rating):
        import datetime
        movie, movie_id = cbs.target_type_checker(target, object_type="Movie")
        rec_qs = Recommendation.objects.filter(profile = self.profile, movie = movie)
        if rec_qs.exists():
            for record in rec_qs:
                record.is_watched = True
                record.watched_at = datetime.datetime.now()
                record.rating = rating
                record.save()

    
    def filter_movieset_by_rating(self, rating):
        return {int(k) for k,v in self.ratings.items() if v == rating }

    def get_latest_ratings(self, num=20,min_rating=4, only_id=True):
        qs = Rating.objects.filter(profile = self.profile, rating__gte = min_rating).select_related("movie"
                ).defer("notes", "date").order_by("-created_at")[:num]
        if only_id==True:
            return [x.movie.id for x in qs]
        return qs

    def create_prediction_record(self, movie_id, prediction, check_history=True):
        movie_qs = Movie.objects.filter(id = movie_id).only("id", "name", "year").first()
        current_points = len(self.ratings.keys())

        #CHECK IS PROFILE RATE MOVIE BEFORE 
        if movie_id in self.movieset:
            self.print_info(f"Error: Profile already rated movie id:{movie_id}. Returned None")
            return None

        #CHECK IF THERE IS EXISTING RECOMMENDATION RECORD 
        rec_qs = Recommendation.objects.filter(profile=self.profile, movie = movie_qs)
        if rec_qs.exists() and check_history==True:
            if current_points - rec_qs[0].points <= 20:
                self.print_info(f"Error: There is already a recommendation record about movie id:{movie_id}. Returned None")
                return None
            elif current_points - rec_qs[0].points >= 20:
                record = rec_qs[0]
                record.prediction = prediction
                record.points = current_points
                record.save()
                return True
        try:
            record = Recommendation(movie = movie_qs, profile = self.profile, prediction = prediction, points = current_points)
            record.save()
            self.print_info(f"Recommendation record with movie_id:{movie_id} created")
        except:
            self.print_info(f"ERROR!!! Recommendation record with movie_id:{movie_id} can not created")
        return True

    #@chronometer
    def scan_movies_by_id(self, movie_id, min_dummy_sim=0.3, min_movie_sim=0.40):
        will_be_predict = set()
        
        similar_movie_ids = MovSim.get_similar_movie_ids(movie_id = movie_id, min_similarity=min_movie_sim)
        for x in similar_movie_ids:
            will_be_predict.add(x)

        will_be_predict = will_be_predict.difference(self.movieset)

        # PREDICTION
        for movie_id_p in will_be_predict:
            prediction = self.prediction(movie_id_p,  min_similarity=min_dummy_sim)
            if prediction>0:
                self.create_prediction_record(movie_id = movie_id_p, prediction = prediction, check_history = True)
        print("Scan movies by id is FINISHED")
    
    @chronometer
    def scan_movies_by_rating(self, rating, min_dummy_sim=0.3, min_movie_sim=0.40):
        #print("<------- MOVIE SCAN----------------------->\n")
        movie_ids_with_specific_rating = self.filter_movieset_by_rating(rating)
        #print(f"{len(movie_ids_with_specific_rating)} number of movies with rated {rating} stars will be scanned")
        
        will_be_predict = set()

        # SIMILAR MOVIES 
        for movie_id in movie_ids_with_specific_rating:
            try:
                similar_movie_ids = MovSim.get_similar_movie_ids(movie_id = movie_id, min_similarity=min_movie_sim)
                for x in similar_movie_ids:
                    will_be_predict.add(x)
            except:
                continue
        #print(f"Found {len(will_be_predict)} number of similar movies.\n")
        #EXCLUDE ALREADY RATED MOVIES
        will_be_predict = will_be_predict.difference(self.movieset)

        #print(f"When rated movies excluded. {len(will_be_predict)} will be predicted")

        # PREDICTION
        #print("Prediction part will start.")
        for movie_id_p in will_be_predict:
            if movie_id_p:
                prediction = self.prediction(movie_id_p,  min_similarity=min_dummy_sim)
                if prediction>0 :
                    self.create_prediction_record(movie_id = movie_id_p, prediction = prediction)
        print("Scan movies by ratings is FINISHED")


    def scan_movies_queue(self, rating=5):
        MyQueue.put(self.scan_movies_by_rating, rating)
        #print("Threaded function started and going on background")
        return "Done"

    #@chronometer
    def prediction(self, movie_id, min_similarity=0.10, min_quantity=15 ,min_neighbours=5, max_neighbours=20):
        ##########################################################################3
        #--------ADJUSTING SIMILAR USERS AND DUMMY USERS---------------------#
        #--------real users-------------------------------------------------#
        movie_archive = MovieArchive.objects.get(movie_id=movie_id)
        filtered_real = {str(x):self.similars_real.get(str(x))  for x in movie_archive.userset if str(x) in self.similars_real.keys() }
        
        #make list for sampling otherwise dictionary can not be indexed
        sample_real_keys = list(filtered_real.keys())[:20]
        #make dictionary again 
        sample_real_users = {str(x):filtered_real.get(x)  for x in sample_real_keys}
        #print("Paired real users: ", len(sample_real_users.keys()))

        #-----for adjusting number of dummy and real user------------------#
        real_user_quantity = len(sample_real_users.keys())
        dummy_user_quantity = max_neighbours - real_user_quantity
        #print("required dummy quantity",dummy_user_quantity )

        #-------dummy users------------------------------------------------#
        filtered_dummies = {str(x):self.similars_dummy.get(str(x)) \
                for x in movie_archive.dummyset \
                    if (str(x) in self.similars_dummy.keys() \
                        and self.similars_dummy.get(str(x)).get("similarity") >= min_similarity \
                        and self.similars_dummy.get(str(x)).get("quantity") >= min_quantity ) }

        if len(filtered_dummies)< min_neighbours - real_user_quantity:
            return -1

        filtered_dummies = cbs.dummy_selection(filtered_dummies, min_quantity, dummy_user_quantity)

                    
        #pprint(filtered_dummies)
        #sort with highest similarity
        sorted_filtered = sorted(filtered_dummies.items(), key=lambda x: x[1].get("similarity"), reverse=True)
        sample_dummy_keys = [x[0] for x in sorted_filtered][ : dummy_user_quantity]
        #sample_dummy_keys = list(filtered_dummies.keys())[:dummy_user_quantity]
        ####################################

        sample_dummy_users = {str(x):filtered_dummies.get(x)  for x in sample_dummy_keys }
        #add dummy user ratings to sample_dummy_users
        dummy_ratings = UserArchive.objects.filter(user_type="d", user_id__in=sample_dummy_keys).values("user_id", "ratings")
        #print("some of dummy ratings query", dummy_ratings[:2])
        for dr in dummy_ratings:
            dr_id = str(dr.get("user_id"))
            dr_rating = dr.get("ratings").get(str(movie_id))
            sample_dummy_users.get(dr_id).update({"rating":dr_rating})
        #print("Paired dummy users: ", len(sample_dummy_users.keys()))
        #pprint(sample_dummy_users)

        #break function if there is not enough users
        if (real_user_quantity + len(sample_dummy_users.keys()))<min_neighbours:
            #print("There is not enough dummy and real users. Less than ", min_neighbours)
            return -1
        ##############################################################################
        #CALCULATION OF PREDICTION
        #make an array of ratings, mean values and similarities for prediction
        v_ratings = []
        v_bars = []
        v_sims = []
        t1 = time.time()
        #Real user parameters
        if real_user_quantity>0:
            for user_id, user_dict in sample_real_users.items():
                persona_rating = Persona.objects.get(id=int(user_id)).ratings.get(str(movie_id))
                #print("real user target movie rating: " persona_rating)
                v_ratings.append(persona_rating)
                v_bars.append(float(user_dict.get("mean")))
                v_sims.append(float(user_dict.get("similarity")))
        t2 = time.time()
        #print("real users values appended to prediction arrays in ", t2- t1, " seconds")
        #Dummy user parameters
        for dummy_id, dummy_dict in sample_dummy_users.items():
            #dummy_rating = UserArchive.objects.get(user_id=int(dummy_id), user_type="d").ratings.get(str(movie_id))
            #print("dummy user target movie rating: " persona_rating)
            v_ratings.append(dummy_dict.get("rating"))
            v_bars.append(float(dummy_dict.get("mean")))
            v_sims.append(float(dummy_dict.get("similarity")))
        t3 = time.time()
        #print("dummy users values appended to prediction arrays in ", t3- t2, " seconds")

        m_score = cc.mean_score(cc.carray(v_ratings), cc.carray(v_bars), cc.carray(v_sims))
        t4 = time.time()
        #print("score was calculated in ", t4- t3, " seconds")

        if m_score==-10:
            #print("zero division in mean score calculation")
            return -1
        #print("mscore", m_score)
        result = self.get_mean() + m_score
        return cbs.post_prediction(result)


    #@chronometer
    def scan_dummy(self, min_quantity=10, min_similarity=0.25):
        
        """
        <------------------NOTES----------------------------->
        dummy_list_dict object will saved to redis in 2 part because of memory and connection limits.
        dummy1, dummy2
        """ 

        print("<---- -----SCANNING DUMMY USERS--------->")
        import json
        similarity_type_dict = {} # it will be placed as {"u":std} or {"d":{std}}
        
        #print("First part of dummy users started")
        dummy_user1 = cache.get("dummy1")
        for udict in dummy_user1:
            #common movie id set(int)
            #1 common_movies = me.intersection_with_set(udict.get("movieset"))
            common_movies = cc.intersection_with_dict(self.ratings, udict.get("ratings"))
            #print("common movie length", len(common_movies))
            #check if min quantity reqirement is satisfied
            if len(common_movies)>min_quantity:
                ubar = self.get_mean()
                #print("self mean", ubar)
                vbar = udict.get("mean")
                #print("dummy mean", vbar)
                #create array of ratings that commonly rated wrt same movies in order 
                uvalues =  cc.carray([v for k,v in self.ratings.items() if k in common_movies])
                vvalues =  cc.carray([v for k,v in udict.get("ratings").items() if k in common_movies])
                #Calculate Pearson Similarity
                similarity = cc.pearson(uvalues, vvalues, ubar, vbar)
                #print("similarity", similarity)
                #check if similarity is satisfying
                if similarity<min_similarity:
                    continue
                similarity_type_dict[udict.get("user_id")] = {
                    "quantity":len(common_movies),
                    "mean":round(vbar, 3) ,
                    "similarity":round(similarity,3)
                    }
        #print(f"First part of dummy users was finished.Found {len(similarity_type_dict.keys())} dummy user.")
        #print("Reference is deleting now.")
        del dummy_user1


        #print("Second part of dummy users started")
        dummy_user2 = cache.get("dummy2")
        for udict in dummy_user2:
            #common movie id set(int)
            #1 common_movies = me.intersection_with_set(udict.get("movieset"))
            common_movies = cc.intersection_with_dict(self.ratings, udict.get("ratings"))
            #print("common movie length", len(common_movies))
            #check if min quantity reqirement is satisfied
            if len(common_movies)>min_quantity:
                ubar = self.get_mean()
                #print("self mean", ubar)
                vbar = udict.get("mean")
                #print("dummy mean", vbar)
                #create array of ratings that commonly rated wrt same movies in order 
                uvalues =  cc.carray([v for k,v in self.ratings.items() if k in common_movies])
                vvalues =  cc.carray([v for k,v in udict.get("ratings").items() if k in common_movies])
                #Calculate Pearson Similarity
                similarity = cc.pearson(uvalues, vvalues, ubar, vbar)
                #print("similarity", similarity)
                #check if similarity is satisfying
                if similarity<min_similarity:
                    continue
                similarity_type_dict[udict.get("user_id")] = {
                    "quantity":len(common_movies),
                    "mean":round(vbar, 3) ,
                    "similarity":round(similarity,3)
                    }
        #print(f"Second part of dummy users was finished.Found total {len(similarity_type_dict.keys())} dummy user.")
        #print("Reference is deleting now.")
        del dummy_user2


        print("similar dummy users are sorting and saving now.")
        #first sort
        sorted_dummy_dict = sorted(similarity_type_dict.items(), key=lambda x: x[1]["similarity"], reverse=True)
        #second: sorting returns tuple --> make it dictionary again
        self.similars_dummy = {x[0]:x[1] for x in sorted_dummy_dict}
        self.save()
        print(f"{len(self.similars_dummy.keys())} number of similar dummy users were set.")
        print("<----------FINISHED: SCANNING DUMMY USERS---------------->")

    #@chronometer
    def scan_real(self, min_quantity=10, min_similarity=0.20):
        print("<-------SCANNING REAL USERS----------------->\n")
        all_users = Persona.objects.all().exclude(id=self.id).defer("similars_dummy")
        similars_real_dict = {}
        for real_persona in all_users:
            #common movie id set(int)
            #1 common_movies = me.intersection_with_set(udict.get("movieset"))
            common_movies = cc.intersection_with_dict(self.ratings, real_persona.ratings)
            #print("common movie length", len(common_movies))
            #check if min quantity reqirement is satisfied
            if len(common_movies)>min_quantity:
                ubar = self.get_mean()
                #print("self mean", ubar)
                vbar = real_persona.get_mean()
                #print("dummy mean", vbar)
                #create array of ratings that commonly rated wrt same movies in order 
                uvalues =  cc.carray([v for k,v in self.ratings.items() if k in common_movies])
                vvalues =  cc.carray([v for k,v in real_persona.ratings.items() if k in common_movies])
                #Calculate Pearson Similarity
                similarity = cc.pearson(uvalues, vvalues, ubar, vbar)
                #print("similarity", similarity)
                #check if similarity is satisfying
                if similarity<min_similarity:
                    continue
                similars_real_dict[str(real_persona.id)] = {
                    "quantity":len(common_movies),
                    "mean":round(vbar, 3) ,
                    "similarity":round(similarity,3)
                    }
        #first sort
        sorted_real_personas = sorted(similars_real_dict.items(), key=lambda x: x[1]["similarity"], reverse=True)
        #second: sorting returns tuple --> make it dictionary again
        self.similars_real = { x[0]:x[1] for x in sorted_real_personas}
        self.save()
        print("<--------------FINISHED: SCANNING REAL USERS--------------------------->")

    @classmethod
    def scan_profiles(cls):
        from persons.profile import Profile
        num = 0
        for p in Profile.objects.all().only("id", "username", "user", "ratings"):
            if p.points >= 40:
                cls.objects.update_or_create( user = p.user, id= p.user.id )
                num += 1
        print(f"{num} number of Persona created.")




class Recommendation(models.Model):
    profile = models.ForeignKey(Profile, related_name='recommendations', on_delete=models.DO_NOTHING)
    
    # The time at prediction done
    points = models.IntegerField()

    movie = models.ForeignKey(Movie,  on_delete=models.CASCADE)
    prediction = models.DecimalField(max_digits=2, decimal_places=1, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    is_recommended = models.BooleanField(default = False)
    recommended_at = models.DateTimeField(null=True)

    #When profile rate the movie
    is_watched = models.BooleanField(default=False)
    watched_at = models.DateTimeField(null=True)
    rating = models.DecimalField(max_digits=2, decimal_places=1, null=True, blank=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return "Profile: {}, Movie: {}, Prediction:{}".format(self.profile, self.movie,self.prediction)

    @classmethod
    def get_recommendation_movies(cls, profile, real=False):
        is_eligible = cls.passed_week(profile)
        if is_eligible or real==False:
            all_qs = cls.filter_by_prediction(profile, 3.7)
            y1960_1990 = cls.filter_by_year(all_qs, 1960, 1990).order_by("?")[:1]
            y1990_2000 = cls.filter_by_year(all_qs, 1990, 2000).order_by("?")[:1]
            y2000_2010 = cls.filter_by_year(all_qs, 2000, 2010).order_by("?")[:1]
            y2010_2020 = cls.filter_by_year(all_qs, 2010, 2020).order_by("?")[:2]
            year_qs = [y1960_1990, y1990_2000, y2000_2010, y2010_2020]
            movies = set()
            for year in year_qs:
                for rec in year:
                    movies.add(rec.movie)
            return movies

    @classmethod
    def get_recommendations(cls, profile, real=False):
        is_eligible = cls.passed_week(profile)
        if is_eligible or real==False:
            all_qs = cls.filter_by_prediction(profile, 3.7)
            #print("all_qs", all_qs.count(), all_qs)
            y1960_1990 = cls.filter_by_year(all_qs, 1960, 1990).order_by("?")[:1]
            #print("year_qs", y1960_1990, y1960_1990.count())
            y1990_2000 = cls.filter_by_year(all_qs, 1990, 2000).order_by("?")[:1]
            y2000_2010 = cls.filter_by_year(all_qs, 2000, 2010).order_by("?")[:1]
            y2010_2020 = cls.filter_by_year(all_qs, 2010, 2020).order_by("?")[:2]
            #print("year_qs", y2010_2020, y2010_2020.count())
            above42 = all_qs.filter(prediction__gte = 4.2).order_by("?")[:1]
            qs_sum = [y1960_1990, y1990_2000, y2000_2010, y2010_2020, above42]
            #print("eligible persona",len(qs_sum))
            records = set()
            for qs in qs_sum:
                #print("qs counts:",qs.count())
                for rec in qs:
                    #print("rec", rec, rec.is_recommended)
                    if rec.is_recommended == False:
                        rec.make_recommended()
                    records.add(rec)
            #print("persona records", records)
            return records
        elif not is_eligible:
            result =  Recommendation.objects.select_related("movie", "profile").filter(
                profile = profile, is_recommended=True, is_watched=False
                ).only("is_recommended", "is_watched", "prediction", "movie", "profile").order_by("-recommended_at")[:6]
            #print("persona",result)
            return result


    @classmethod
    def filter_by_year(cls,qs, start, stop ):
        new_qs =  qs.filter(movie__year__gte = start, movie__year__lte = stop )
        return new_qs

    @classmethod
    def filter_by_prediction(cls, profile, min ):
        Q1 = Q(prediction__gte = min)
        Q2 = Q(profile = profile, is_watched=False, is_recommended=False)
        q_filter = (Q1 & Q2)
        return cls.objects.select_related("movie").exclude(movie__poster="").filter(q_filter)

    @classmethod
    def last_recommendation_date(cls, profile):
        qs = cls.objects.filter(profile=profile, is_recommended=True,
            is_watched=False ).order_by("-created_at").first()
        if qs:
            return qs.recommended_at
        else:
            return None

    @classmethod
    def passed_week(cls, profile):
        import datetime
        time_delta = datetime.timedelta(days=7)
        last_date = cls.last_recommendation_date(profile)
        if last_date:
            now = datetime.datetime.now()
            diff =  now.date() - last_date.date()
            if diff > time_delta:
                return True
            return False
        elif last_date==None:
            return True

    def make_recommended(self):
        from datetime import datetime, timezone
        self.is_recommended = True
        self.recommended_at = datetime.now(timezone.utc)
        self.save()

"""

"""


