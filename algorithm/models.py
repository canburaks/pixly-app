from django.db import models
import os, sys, inspect
import random
#import numpy as np
from django.core.cache import cache
cmd_subfolder = os.path.realpath(os.path.abspath(os.path.join(os.path.split(inspect.getfile( inspect.currentframe() ))[0],"cython")))
if cmd_subfolder not in sys.path:
    sys.path.insert(0, cmd_subfolder)



import calculations as af
from algorithm import custom_functions as cbs
from items.models import Movie

# Define the Ms class for movie similarity calculations
class Ms():
    def __init__(self, movie_id):
        """Initialize with a movie ID, ensuring correct format."""
        from items.models import Movie
        if isinstance(movie_id, Movie):
            self.movie_id = "m{}".format(movie_id.id)
        elif isinstance(movie_id, int ):
            self.movie_id = "m{}".format(movie_id)
        elif isinstance(movie_id, str) and not movie_id.startswith("m"):
            self.movie_id = "m{}".format(movie_id)
        elif isinstance(movie_id, str) and movie_id.startswith("m"):
            self.movie_id = movie_id

    @property
    def userset(self):
        """Retrieve the set of users who have interacted with the movie."""
        return cache.get(self.movie_id)
    
    def commons(self, other_movie):
        """Find common users between two movies."""
        return np.intersect1d(np.array(self.userset), np.array(other_movie.userset))

    def commons_length(self, other_movie):
        """Calculate the number of common users between two movies."""
        return np.intersect1d(np.array(self.userset), np.array(other_movie.userset)).shape[0]
    
    @classmethod
    def user_collection(cls,movie_id1, movie_id2, common_users):
        """Collect user data for two movies based on common users."""
        movie_i = movie_id1.split("m")[1]
        movie_j = movie_id2.split("m")[1]
        collection = []
        for user_id in common_users:
            user = Rs(user_id)
            u_variance = user.variance
            if  u_variance==0:
                continue
            ubar = user.average
            ui = user.ratings.get(movie_i)
            uj = user.ratings.get(movie_j)
            if ubar and ui and uj:
                collection.append((ubar, ui, uj))
            else:
                continue
        return collection
    
    def pearson(self, other_movie, minimum_common=200):
        if self.commons_length(other_movie)>=minimum_common:
            commons = self.commons(other_movie)
            collection = Ms.user_collection(self.movie_id, other_movie.movie_id, commons )
            return af.acs(collection)
        else:
            print("Nopt enough users for calculation of two movies")

    

# Define the Rs class for user similarity calculations
class Rs():
    def __init__(self, user_id):
        """Initialize with a user ID."""
        self.ratings = cache.get(user_id)
    


    @property
    def movieset(self):
        """Retrieve the set of movies the user has interacted with."""
        return np.array([x for x in self.ratings.keys()], dtype=np.uint32)

    @property
    def average(self):
        """Calculate the average rating given by the user."""
        return af.mean(self.ratings)
    
    @property
    def variance(self):
        """Calculate the variance of the user's ratings."""
        return af.variance(self.ratings)
    
    @property
    def stdev(self):
        """Calculate the standard deviation of the user's ratings."""
        return af.stdev(self.ratings)

    def commons(self,other_user):
        """Find common movies between two users."""
        umovies = self.movieset
        vmovies = other_user.movieset
        return np.intersect1d(umovies, vmovies)
    
    def commons_length(self, other_user):
        """Calculate the number of common movies between two users."""
        return np.intersect1d( self.movieset, other_user.movieset).shape[0] 
    
    def vector(self, common_movies):
        """Generate a vector of ratings for common movies."""
        return np.array([self.ratings.get(str(x)) for x in common_movies ], dtype=np.float64)
    
    def normalized_vector(self, common_movies):
        """Generate a normalized vector of ratings for common movies."""
        self_vector = self.vector(common_movies)
        mean_vector = np.full(len(common_movies), self.average)
        return self_vector - mean_vector

    def pearson(self, other_user):
        """Calculate the Pearson correlation coefficient between two users."""
        common_movies = self.commons(other_user)
        if len(common_movies)>0:
            self_vector = self.vector(common_movies)
            other_vector = other_user.vector(common_movies)
            ubar = self.average
            vbar = self.average
            return af.pearson(self_vector, other_vector, ubar, vbar)
        else:
            return 0

    def final_calculation(self,list_of_highly_correlated_users, movie_id, zscore):
        """Perform the final calculation for movie recommendations."""
        print("zcore:{}".format(zscore))
        if zscore==True:
            # [ [average, stdev, rating_of_target_movie, correlation],[]...]
            userlist = [ [x[0].average, x[0].stdev, x[0].ratings.get(movie_id), x[1]] for x in list_of_highly_correlated_users]
            result = af.z_final(userlist) * self.stdev
            print("final zcore calculation=>")
            print(result)
            return result

        else:
            # [ [average, rating_of_target_movie, correlation],[]...]
            userlist = [ [x[0].average, x[0].ratings.get(movie_id), x[1]] for x in list_of_highly_correlated_users]
            result = af.final(userlist)
            print("final  calculation=>")
            print(result)
            return result


    def prediction(self,movie, zscore=False):
        """Predict the rating a user would give to a movie."""
        if isinstance(movie, Movie):
            movid = str(movie.id)
        elif isinstance(movie, int):
            movid = str(movie)
        elif isinstance(movie, str):
            movid = movie
        else:
            print("no movie id")
        movie_all_userset = Ms(movie).userset

        #get sample of users if population are great 
        movie_userset = cbs.random_sample(movie_all_userset, 8000)

        print("{} of users that rated target movie".format(len(movie_userset)))
        users_that_have_commons = {}
        for user_id in movie_userset:
            rs_user = Rs(user_id)
            #check if variance is zero
            if rs_user.variance==0:
                continue

            if len(movie_userset)>7000:
                minimum_common_threshold = 24
            elif len(movie_userset)>2000 and len(movie_userset)<7000:
                minimum_common_threshold = 19
            else:
                minimum_common_threshold = 12
            
            if self.commons_length(rs_user)>minimum_common_threshold:
                users_that_have_commons.update({ rs_user:self.commons_length(rs_user) })

        #neighbours_that_max_shared = sorted(users_that_have_commons.items(), key=lambda x:x[1], reverse=True)[:300]

        # Sort neigbours by their number number of shared movies
        neighbours_that_max_shared = cbs.sort_dict(users_that_have_commons)[:300]
        print("Neighbours that brought:{}".format(len(neighbours_that_max_shared)))
        
        users_with_pearson = {}
        for neighbour in neighbours_that_max_shared:
            correlation = self.pearson(neighbour[0])
            if correlation>0.2:
                users_with_pearson.update({ neighbour[0] : correlation })
        
        #highest_correlated_users = sorted(users_with_pearson.items(), key=lambda x:x[1], reverse=True)[:20]

        #Sort neighbours by their correlation
        highest_correlated_users = cbs.sort_dict(users_with_pearson)[:25]

        print("{} number of Highest correlated person".format(len(highest_correlated_users)))
        prediction_result = self.average + self.final_calculation(highest_correlated_users, str(movid), zscore)
        print("Prediction Result".format(prediction_result))
        if prediction_result>5 or prediction_result<=0:
                return 0
        else:
            return prediction_result
        """
        elif (prediction_result>=4.4) and (prediction_result<4.6):
            return 4.2
        elif (prediction_result>=4.6) and (prediction_result<4.8):
            return 4.3
        elif (prediction_result>=4.8) and (prediction_result<5):
            return 4.4
        elif prediction_result==5:
            return 4.5
        return prediction_result - 0.2
        """


