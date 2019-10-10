from django.test import TestCase
"""
# Create your tests here.
def testql(id, choice, r=False):
    if choice==1:
        qs = List.objects.get(id=id).movies.defer("imdb_id",
                        "tmdb_id","actors","data","ratings_dummy","director","summary",
                        "tags","ratings_user")
    elif choice==2:
        ls = List.objects.only("movies").get(id=id)
        qs = Movie.objects.filter(lists=ls).defer("imdb_id",
                    "imdb_rating","tmdb_id","actors","data",
                    "ratings_dummy","director","summary",
                    "tags","ratings_user")
    elif choice==3:
        ls = List.objects.only("movies").get(id=id)
        qs = Movie.objects.defer("imdb_id",
                    "imdb_rating","tmdb_id","actors","data",
                    "ratings_dummy","director","summary",
                    "tags","ratings_user").filter(lists=ls)
    elif choice==4:
        ls = List.objects.prefetch_related("movies").get(id=1)
        qs = Movie.objects.defer("imdb_id",
                    "imdb_rating","tmdb_id","actors","data",
                    "ratings_dummy","director","summary",
                    "tags","ratings_user").filter(lists=ls)
    elif choice==5:
        ls = List.objects.only("movies").get(id=id)
        qs = Movie.objects.defer("imdb_id",
                    "imdb_rating","tmdb_id","actors","data",
                    "ratings_dummy","director","summary",
                    "tags","ratings_user").filter(id__in=ls__movies__id)
    if r==True:
        return qs[:3]

"""