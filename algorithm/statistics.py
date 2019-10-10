from items.models import Rating, Movie
from persons.models import Profile, Person, Crew
import calculations as af

def dic_sort(dic, item="value", reverse=True):
    if item.lower().startswith("v"):
        if reverse:
            return sorted(dic.items(), key=lambda x:x[1], reverse=True)
        else:
            return sorted(dic.items(), key=lambda x:x[1], reverse=False)
    if item.lower().startswith("k"):
        if reverse:
            return sorted(dic.items(), key=lambda x:x[0], reverse=True)
        else:
            return sorted(dic.items(), key=lambda x:x[0], reverse=False)

class UserAnalytics():

    def __init__(self, profile):
        self.ratings = profile.ratings
        self.average = af.mean(self.ratings)
        self.variance = af.variance(self.ratings)
    

    def movie_ids(self, like=False):
        if like:
            movie_ids = [int(key) for key,value in self.ratings.items() if value>self.average]
        else:
            movie_ids = [int(key) for key,value in self.ratings.items()]
        return movie_ids
    
    def directors(self, like=False):
        return Crew.objects.select_related("movie", "person").filter(movie__id__in = self.movie_ids(like)
            ).values("person")
    
    def get_most(self,term, like=False):
        from collections import Counter
        if term.lower().startswith("year"):
            movie_ids = self.movie_ids(like)
            movie_qs = Movie.objects.filter(id__in=movie_ids).values("year")
            c = Counter([x.get("year") for x in  movie_qs])
            return c


"""
from algorithm.statistics import UserAnalytics
cbs = Profile.objects.get(id=1)
cua = UserAnalytics(cbs)
"""