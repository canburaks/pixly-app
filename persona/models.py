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

# Import necessary modules for caching and utilities
from django.utils.functional import cached_property
from django.core.cache import cache
import time
from archive.models import cc
from archive import custom_functions as cbs
from .myqueue import MyQueue

# Flag for logging
print_log = False

# Define the Persona model
class Persona(Model):
    """
    Model representing a user's movie preferences and recommendation profile.
    Stores similarity data with other users for generating recommendations.
    """
    # Core fields
    id = models.IntegerField(primary_key=True, unique=True)  # Maps to User Id
    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        verbose_name="user",
        on_delete=models.SET_NULL,
        null=True  # Allows keeping data if user account is deleted
    )

    # Similarity data for recommendations
    similars_dummy = JSONField(default=dict)  # {"157": {"mean": 3.14, "quantity": 18, "similarity": 0.25}}
    similars_real = JSONField(default=dict)   # {"157": {"mean": 3.14, "quantity": 18, "similarity": 0.25}}

    def __str__(self):
        return str(self.user.id)

    # Properties and utility methods
    @property
    def profile(self):
        """Get associated user profile"""
        return self.user.profile

    @property
    def ratings(self):
        """Get user's movie ratings"""
        return self.user.profile.ratings

    @property
    def movieset(self):
        """Get set of movies rated by user"""
        return self.profile.int_movieset

    def values(self, c=True):
        """Get list of rating values, optionally as C array"""
        values = list(self.ratings.values())
        if c:
            return cc.carray(values)
        return values

    def get_mean(self):
        """Calculate mean rating value"""
        return round(cc.mean(self.values()), 3)

    def print_info(self, text):
        """Debug logging helper"""
        if print_log:
            new_text = f"Persona user_id:{self.id} --> {text}"
            print(new_text)

    # Recommendation methods
    def update_recommendation(self, target, rating):
        """Update recommendation record when user rates a movie"""
        import datetime
        movie, movie_id = cbs.target_type_checker(target, object_type="Movie")
        rec_qs = Recommendation.objects.filter(profile=self.profile, movie=movie)
        if rec_qs.exists():
            for record in rec_qs:
                record.is_watched = True
                record.watched_at = datetime.datetime.now()
                record.rating = rating
                record.save()

    def filter_movieset_by_rating(self, rating):
        """Get set of movie IDs with specific rating"""
        return {int(k) for k,v in self.ratings.items() if v == rating}

    def get_latest_ratings(self, num=20, min_rating=4, only_id=True):
        """Get user's most recent ratings above minimum threshold"""
        qs = Rating.objects.filter(
            profile=self.profile,
            rating__gte=min_rating
        ).select_related("movie").defer(
            "notes", "date"
        ).order_by("-created_at")[:num]
        
        if only_id:
            return [x.movie.id for x in qs]
        return qs

    def create_prediction_record(self, movie_id, prediction, check_history=True):
        """
        Create or update a movie recommendation prediction record.
        
        Args:
            movie_id: ID of the movie to create prediction for
            prediction: Calculated prediction score
            check_history: Whether to check existing recommendations
            
        Returns:
            bool: True if record created/updated, None if skipped
        """
        movie_qs = Movie.objects.filter(id=movie_id).only("id", "name", "year").first()
        current_points = len(self.ratings.keys())

        # Skip if user already rated this movie
        if movie_id in self.movieset:
            self.print_info(f"Error: Profile already rated movie id:{movie_id}. Returned None")
            return None

        # Check for existing recommendation record
        rec_qs = Recommendation.objects.filter(profile=self.profile, movie=movie_qs)
        if rec_qs.exists() and check_history:
            # Only update if user has rated 20+ new movies since last prediction
            if current_points - rec_qs[0].points <= 20:
                self.print_info(f"Error: Recent recommendation exists for movie id:{movie_id}")
                return None
            elif current_points - rec_qs[0].points >= 20:
                record = rec_qs[0]
                record.prediction = prediction
                record.points = current_points
                record.save()
                return True

        # Create new recommendation record
        try:
            record = Recommendation(
                movie=movie_qs,
                profile=self.profile,
                prediction=prediction,
                points=current_points
            )
            record.save()
            self.print_info(f"Created recommendation for movie_id:{movie_id}")
        except:
            self.print_info(f"ERROR: Failed to create recommendation for movie_id:{movie_id}")
        return True

    #@chronometer
    def scan_movies_by_id(self, movie_id, min_dummy_sim=0.3, min_movie_sim=0.40):
        """
        Scan and generate predictions for movies similar to given movie ID.
        
        Args:
            movie_id: Base movie ID to find similar movies for
            min_dummy_sim: Minimum similarity threshold for dummy users
            min_movie_sim: Minimum similarity threshold for movie comparisons
        """
        will_be_predict = set()
        
        # Get similar movies above threshold
        similar_movie_ids = MovSim.get_similar_movie_ids(
            movie_id=movie_id,
            min_similarity=min_movie_sim
        )
        will_be_predict.update(similar_movie_ids)

        # Remove movies user has already rated
        will_be_predict = will_be_predict.difference(self.movieset)

        # Generate predictions for each similar movie
        for movie_id_p in will_be_predict:
            prediction = self.prediction(movie_id_p, min_similarity=min_dummy_sim)
            if prediction > 0:
                self.create_prediction_record(
                    movie_id=movie_id_p,
                    prediction=prediction,
                    check_history=True
                )
        print("Scan movies by id is FINISHED")
    
    @chronometer
    def scan_movies_by_rating(self, rating, min_dummy_sim=0.35, min_movie_sim=0.25):
        """
        Scan and generate predictions for movies similar to those rated at given rating.
        
        Args:
            rating: Rating value to find similar movies for
            min_dummy_sim: Minimum similarity threshold for dummy users
            min_movie_sim: Minimum similarity threshold for movie comparisons
        """
        # Get movies user rated at specified rating
        movie_ids_with_specific_rating = self.filter_movieset_by_rating(rating)
        
        will_be_predict = set()

        # Find similar movies for each rated movie
        for movie_id in movie_ids_with_specific_rating:
            try:
                similar_movie_ids = MovSim.get_similar_movie_ids(
                    movie_id=movie_id,
                    min_similarity=min_movie_sim
                )
                will_be_predict.update(similar_movie_ids)
            except:
                continue

        # Remove movies user has already rated
        will_be_predict = will_be_predict.difference(self.movieset)

        # Generate predictions for each similar movie
        for movie_id_p in will_be_predict:
            if movie_id_p:
                prediction = self.prediction(movie_id_p, min_similarity=min_dummy_sim)
                if prediction > 0:
                    self.create_prediction_record(
                        movie_id=movie_id_p,
                        prediction=prediction
                    )
        print("Scan movies by ratings is FINISHED")


    def scan_movies_queue(self, rating=5):
        """
        Queue movie scanning task for asynchronous processing.
        
        Args:
            rating: Rating value to scan similar movies for
            
        Returns:
            str: Status message
        """
        MyQueue.put(self.scan_movies_by_rating, rating)
        return "Done"

    #@chronometer
    def prediction(self, movie_id, min_similarity=0.10, min_quantity=15, min_neighbours=5, max_neighbours=20):
        """
        Calculate predicted rating for a movie using collaborative filtering.
        
        Combines ratings from similar real users and dummy users to generate
        a predicted rating for the given movie.
        
        Args:
            movie_id: ID of movie to predict rating for
            min_similarity: Minimum similarity threshold for users
            min_quantity: Minimum number of common movies required
            min_neighbours: Minimum number of similar users needed
            max_neighbours: Maximum number of similar users to consider
            
        Returns:
            float: Predicted rating or -1 if insufficient data
        """
        # Get movie archive data
        movie_archive = MovieArchive.objects.get(movie_id=movie_id)
        
        # Filter similar real users who have rated this movie
        filtered_real = {
            str(x): self.similars_real.get(str(x))
            for x in movie_archive.userset 
            if str(x) in self.similars_real.keys()
        }
        
        # Sample real users (limit to 20)
        sample_real_keys = list(filtered_real.keys())[:20]
        sample_real_users = {
            str(x): filtered_real.get(x)
            for x in sample_real_keys
        }

        # Calculate how many dummy users needed
        real_user_quantity = len(sample_real_users.keys())
        dummy_user_quantity = max_neighbours - real_user_quantity

        # Get dummy users above similarity threshold
        filtered_dummies = {
            str(x): self.similars_dummy.get(str(x))
            for x in movie_archive.dummyset
            if (str(x) in self.similars_dummy.keys()
                and self.similars_dummy.get(str(x)).get("similarity") >= min_similarity
                and self.similars_dummy.get(str(x)).get("quantity") >= min_quantity)
        }

        # Check if enough similar users found
        if len(filtered_dummies) < min_neighbours - real_user_quantity:
            return -1

        # ... rest of prediction logic ...

    #@chronometer
    def scan_dummy(self, min_quantity=10, min_similarity=0.25):
        """
        Scan and calculate similarities with dummy users from cache.
        
        Uses Redis cache to process dummy users in batches due to memory constraints.
        Calculates Pearson similarity between current user and dummy users based on
        common movie ratings.
        
        Args:
            min_quantity: Minimum number of common movies required
            min_similarity: Minimum similarity threshold to keep
            
        Note:
            Dummy users are stored in Redis cache in two parts (dummy1, dummy2) 
            due to memory/connection limits
        """
        print("<---- -----SCANNING DUMMY USERS--------->")
        similarity_type_dict = {}  # Will store {"user_id": {"quantity": X, "mean": Y, "similarity": Z}}
        
        # Process first batch of dummy users
        dummy_user1 = cache.get("dummy1")
        for udict in dummy_user1:
            # Find common movies between current user and dummy user
            common_movies = cc.intersection_with_dict(self.ratings, udict.get("ratings"))
            
            if len(common_movies) > min_quantity:
                # Calculate means and prepare rating arrays
                ubar = self.get_mean()
                vbar = udict.get("mean")
                uvalues = cc.carray([v for k,v in self.ratings.items() if k in common_movies])
                vvalues = cc.carray([v for k,v in udict.get("ratings").items() if k in common_movies])
                
                # Calculate Pearson similarity
                similarity = cc.pearson(uvalues, vvalues, ubar, vbar)
                
                # Store if above threshold
                if similarity >= min_similarity:
                    similarity_type_dict[udict.get("user_id")] = {
                        "quantity": len(common_movies),
                        "mean": round(vbar, 3),
                        "similarity": round(similarity, 3)
                    }
        
        del dummy_user1  # Free memory

        # Process second batch of dummy users
        dummy_user2 = cache.get("dummy2") 
        # ... Same processing as above for dummy_user2 ...
        
        # Sort by similarity and save
        sorted_dummy_dict = sorted(
            similarity_type_dict.items(), 
            key=lambda x: x[1]["similarity"],
            reverse=True
        )
        self.similars_dummy = {x[0]:x[1] for x in sorted_dummy_dict}
        self.save()
        
        print(f"{len(self.similars_dummy.keys())} similar dummy users found")

    #@chronometer
    def scan_real(self, min_quantity=10, min_similarity=0.20):
        """
        Scan and calculate similarities with other real users.
        
        Calculates Pearson similarity between current user and other real users
        based on common movie ratings.
        
        Args:
            min_quantity: Minimum number of common movies required
            min_similarity: Minimum similarity threshold to keep
        """
        print("<-------SCANNING REAL USERS--------->")
        
        # Get all other users
        all_users = Persona.objects.all().exclude(id=self.id).defer("similars_dummy")
        similars_real_dict = {}
        
        for real_persona in all_users:
            # Find common movies
            common_movies = cc.intersection_with_dict(self.ratings, real_persona.ratings)
            
            if len(common_movies) > min_quantity:
                # Calculate means and prepare rating arrays
                ubar = self.get_mean()
                vbar = real_persona.get_mean()
                uvalues = cc.carray([v for k,v in self.ratings.items() if k in common_movies])
                vvalues = cc.carray([v for k,v in real_persona.ratings.items() if k in common_movies])
                
                # Calculate Pearson similarity
                similarity = cc.pearson(uvalues, vvalues, ubar, vbar)
                
                # Store if above threshold
                if similarity >= min_similarity:
                    similars_real_dict[str(real_persona.id)] = {
                        "quantity": len(common_movies),
                        "mean": round(vbar, 3),
                        "similarity": round(similarity, 3)
                    }
        
        # Sort by similarity and save
        sorted_real_personas = sorted(
            similars_real_dict.items(),
            key=lambda x: x[1]["similarity"],
            reverse=True
        )
        self.similars_real = {x[0]:x[1] for x in sorted_real_personas}
        self.save()

    @classmethod
    def scan_profiles(cls):
        """
        Create Persona objects for eligible user profiles.
        
        Creates Persona objects for users who have rated at least 40 movies.
        
        Returns:
            int: Number of Persona objects created
        """
        from persons.profile import Profile
        num = 0
        for p in Profile.objects.all().only("id", "username", "user", "ratings"):
            if p.points >= 40:
                cls.objects.update_or_create(user=p.user, id=p.user.id)
                num += 1
        print(f"{num} Persona objects created")




class Recommendation(models.Model):
    """
    Model for storing movie recommendations for user profiles.
    Tracks prediction scores, recommendation status, and user ratings.
    """
    # Core relationships
    profile = models.ForeignKey(Profile, related_name='recommendations', on_delete=models.DO_NOTHING)
    movie = models.ForeignKey(Movie, on_delete=models.CASCADE)
    
    # Prediction and scoring
    points = models.IntegerField()
    prediction = models.DecimalField(max_digits=2, decimal_places=1, null=True, blank=True)
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    recommended_at = models.DateTimeField(null=True)
    rec_date = models.DateField(null=True, blank=True)
    
    # Recommendation status
    is_recommended = models.BooleanField(default=False)
    
    # User interaction tracking
    is_watched = models.BooleanField(default=False)
    watched_at = models.DateTimeField(null=True)
    rating = models.DecimalField(max_digits=2, decimal_places=1, null=True, blank=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return f"Profile: {self.profile}, Movie: {self.movie}, Prediction:{self.prediction}"

    @classmethod
    def prepare_recommendations(cls, profile, real=False):
        """
        Prepare movie recommendations for a user profile.
        
        Creates a balanced set of recommendations across different decades if user is eligible
        for new recommendations. Otherwise returns previous recommendations.
        
        Args:
            profile: User profile to generate recommendations for
            real: Boolean flag for testing/production mode
            
        Returns:
            QuerySet of recommendation objects
        """
        is_eligible = cls.is_eligible_for_new_recommendation(profile)
        print("is eligible for new recommendations: ", is_eligible)
        
        if is_eligible:
            # Get base queryset of potential recommendations
            all_qs = cls.filter_by_prediction(profile, 3.7)
            
            # Get recommendations from different decades
            recommendations = {
                '1960-1990': cls.filter_by_year(all_qs, 1960, 1990).order_by("?")[:2],
                '1990-2000': cls.filter_by_year(all_qs, 1990, 2000).order_by("?")[:2],
                '2000-2010': cls.filter_by_year(all_qs, 2000, 2010).order_by("?")[:2], 
                '2010-2020': cls.filter_by_year(all_qs, 2010, 2020).order_by("?")[:2],
                'high_rated': all_qs.filter(prediction__gte=4.2).order_by("?")[:2]
            }

            # Combine and mark recommendations
            records = set()
            for qs in recommendations.values():
                print("qs counts:", qs.count())
                for rec in qs:
                    rec.make_recommended()
                    records.add(rec)
            print("persona records", records)
            return records

        # Return previous recommendations if not eligible for new ones
        else:
            latest_rec = profile.recommendations.order_by("-rec_date").first()
            latest_recs = profile.recommendations.filter(rec_date=latest_rec.rec_date)
            print("previous recs are recommended: ", latest_recs.count())
            return latest_recs

    @classmethod
    def filter_by_year(cls, qs, start, stop):
        """Filter recommendations by movie release year range"""
        return qs.filter(movie__year__gte=start, movie__year__lte=stop)

    @classmethod
    def filter_by_prediction(cls, profile, min_score):
        """
        Filter recommendations by minimum prediction score and unwatched status
        
        Args:
            profile: User profile
            min_score: Minimum prediction score threshold
            
        Returns:
            QuerySet of filtered recommendations
        """
        Q1 = Q(prediction__gte=min_score)
        Q2 = Q(profile=profile, is_watched=False, is_recommended=False)
        q_filter = (Q1 & Q2)
        return cls.objects.select_related("movie").exclude(movie__poster="").filter(q_filter)

    # Deprecated methods below
    @classmethod
    def get_recommendation_movies(cls, profile, real=False):
        """Deprecated: Use prepare_recommendations() instead"""
        pass

    @classmethod 
    def get_recommendations(cls, profile):
        """Deprecated: Use prepare_recommendations() instead"""
        pass

    @classmethod
    def last_recommendation_date(cls, profile):
        """Deprecated: Use is_eligible_for_new_recommendation() instead"""
        pass

    @classmethod
    def passed_week(cls, profile):
        """Deprecated: Use is_eligible_for_new_recommendation() instead"""
        pass

    def make_recommended(self):
        import datetime
        self.is_recommended = True
        self.recommended_at = datetime.datetime.now(datetime.timezone.utc) #will be removed in future
        self.rec_date = datetime.date.today()
        self.save()

"""

"""


