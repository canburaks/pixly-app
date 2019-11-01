from django.db import models
from django.db.models import IntegerField, Model
from django_mysql.models import SetCharField, SetTextField, JSONField
from django.contrib.auth.models import User

from items.models import Movie
from persons.profile import Profile
from archive import custom_functions as cbs
from django.db.models import Q
from gql import tmdb_class
from gql.bs4 import parse_imdb_movie
import os, sys, inspect
cmd_subfolder = os.path.realpath(os.path.abspath(os.path.join(os.path.split(inspect.getfile( inspect.currentframe() ))[0],"cython")))
if cmd_subfolder not in sys.path:
    sys.path.insert(0, cmd_subfolder)
from django.views.decorators.csrf import csrf_exempt

import cfunc as cc

USER_TYPE = (("u", "user"), ("d", "dummy"))

def url_image(url, filename):
    from django.core import files
    from io import BytesIO
    import requests
    
    response = requests.get(url)
    fp = BytesIO()
    fp.write(response.content)
    return filename, files.File(fp)




class TmdbMovie(models.Model):
    tmdb_id = models.IntegerField(primary_key=True) #tmdb id
    movielens_id = models.IntegerField( null=True, blank=True, unique=True ) #movielens id
    imdb_id = models.CharField(max_length=9, null=True, blank=True)
    
    registered = models.BooleanField(default=False, blank=True)

    name = models.CharField(max_length=100, null=True, blank=True)
    data = JSONField(default=dict, blank=True)
    created_at = models.DateTimeField(auto_now_add=True, blank = True,null=True, editable=True)
    updated_at = models.DateTimeField(auto_now=True, null=True, blank = True)
    def __str__(self):
        return str(self.tmdb_id)
    
    @property
    def tmdb(self):
        return tmdb_class.Movie(self.tmdb_id)

    def get_omdb_data(self):
        import requests
        if self.imdb_id:
            url = ("http://www.omdbapi.com/?i={}&apikey=3f49586a".format(self.imdb_id))
            req = requests.get(url)
            return req.json()

    def set_omdb_data(self, force=False):
        omdb_data = self.get_omdb_data()
        if omdb_data:
            self.data.update({
                "plot": omdb_data.get("Plot"),
                "imdb_rating":omdb_data.get("imdbRating"),
                "imdb_votes" :omdb_data.get("imdbVotes"),
                "country" :omdb_data.get("Country"),
                "imdb_votes" :omdb_data.get("imdbVotes")
                })
        m_qs = TmdbMovie.objects.filter(movielens_id=self.movielens_id)
        if force and m_qs.exists():
                movie = m_qs.first()
                if omdb_data and omdb_data.get("imdbRating")!=None and omdb_data.get("imdbRating")!="N/A":
                    movie.imdb_rating = float(omdb_data.get("imdbRating"))
                    movie.save()
        self.save()

    def get_imdb_data(self):
        if self.imdb_id:
            try:
                rating, votes = parse_imdb_movie(self.imdb_id)
                return rating, votes
            except:
                return None, None

    def get_data(self):
        return self.tmdb.extended_details()

    
    def save_data(self):
        data = {}
        details = self.get_data()
        #<------------POSTERS--------------------->
        cover_base_url = "https://image.tmdb.org/t/p/w1280"
        poster_base_url = "https://image.tmdb.org/t/p/w185"# + "poster_path"
        poster_path = details.get("poster_path")
        poster_path = poster_base_url + poster_path if poster_path!=None else None
        if poster_path!=None:
            data["poster_url"] = poster_path
        cover_path = details.get("backdrop_path")
        cover_path = cover_base_url + cover_path if cover_path!=None else None
        if cover_path!=None:
            data["cover_url"] = cover_path

        #<-------------DETAILS--------------------->
        data["summary"] = details.get("overview")
        data["name"] = details.get("title")
        self.name = details.get("title")
        data["original_name"] = details.get("original_title")
        data["runtime"] = details.get("runtime")
        if details.get("imdb_id"):
            self.imdb_id = details.get("imdb_id")
            data["imdb_id"] = details.get("imdb_id")
            
        data["tmdb_id"] = self.tmdb_id
        release = details.get("release_date")
        data["release_date"] = release
        if release:
            str_year = release.split("-")[0]
            if len(str_year)==4:
                year = int(str_year)
                data["year"] = year

        #<----------VIDEOS---------------------->
        videos = details.get("videos")
        if videos:
            video_list = videos.get("results")
            if isinstance(video_list, list) and len(video_list)>0:
                youtube_filter = list(filter(lambda x: x.get("site")=="YouTube", video_list))
                category_filter = list(filter(lambda x: 
                        x.get("type")=="Trailer" or 
                        x.get("type")=="Featurette" or 
                        x.get("type")=="Behind the Scenes",youtube_filter
                        ))

                if len(category_filter)>0:
                    data_video_list = []
                    for v in category_filter:
                        vdict = {}
                        vdict["youtube_id"] = v.get("key")
                        vdict["tmdb_id"] = v.get("id")
                        vdict["title"] = v.get("name")
                        vdict["type"] = v.get("type")
                        data_video_list.append(vdict)
                    data["videos"] = data_video_list

        #<----------EXT IDS---------------------->
        ext_id = details.get("external_ids")
        if details.get("homepage"):
            ext_id["homepage"] = ext_id.update({"homepage": details.get("homepage") })
        data["external_ids"] = ext_id
        data["homepage"] = details.get("homepage")

        #<----------GENRES ---------------------->
        if details.get("genres"):
            data["genres"] = details.get("genres")
        #<----------CAST & CREW---------------------->
        credit = details.get("credits")
        if credit:
            #<----------CAST---------------------->
            cast_list = credit.get("cast")
            if isinstance(cast_list, list) and len(cast_list)>0:
                data["cast"] = cast_list[:8]
            #<----------CREW---------------------->
            crew_list = credit.get("crew")
            if isinstance(crew_list, list) and len(crew_list)>0:
                filtered_crews = list(filter(lambda x: x.get("job")=="Director" or x.get("job")=="Writer" or x.get("job")=="Cinematography", crew_list ))
                data["crew"] = filtered_crews

        #<----------SIMILARS ---------------------->
        similars = details.get("similar")
        if similars:
            sim_list = similars.get("results")
            if isinstance(sim_list, list) and len(sim_list)>0:
                similar_movie_list = []
                for m in sim_list:
                    mdict = {}
                    mdict["tmdb_id"] = m.get("id")
                    mdict["name"] = m.get("title")
                    similar_movie_list.append(mdict)
                data["similars"] = similar_movie_list
        #------------------------------------------->
        keywords_data = details.get("keywords")
        if keywords_data and len(keywords_data.keys()) > 0:
            data["keywords"] = keywords_data.get("keywords")

        self.data = data
        self.save()

    #Creates Movie object from Tmdb Movie
    def create_movie(self):
        from items.models import Movie
        movie_qs = Movie.objects.filter(id=self.movielens_id)
        if movie_qs.exists():
            print("Movie already registered")
            self.registered = True
            self.save()

        if self.movielens_id:
            movie_data = self.data
            d = {}
            d["name"] = self.name
            d["id"] = self.movielens_id
            d["tmdb_id"] = self.tmdb_id
            d["imdb_id"] = self.imdb_id
            d["year"] = movie_data.get("year")
            d["summary"] = movie_data.get("summary")
            d["active"] = True

            new_data = {}
            new_data["external_ids"] = movie_data.get("external_ids")
            new_data["runtime"] = movie_data.get("runtime")
            new_data["videos"] = movie_data.get("videos")
            new_data["similars"] = movie_data.get("similars")
            d["data"] = new_data
            m = Movie(**d)
            m.save()
            print("Movie created")
            self.registered=True
            self.save()

            poster_url = movie_data.get("poster_url")
            cover_url = movie_data.get("cover_url")

            poster_filename = f"{self.movielens_id}-poster.jpg"
            if poster_url:
                m.poster.save(*url_image(poster_url, poster_filename))
                print("poster was saved")
            cover_filename = f"{self.movielens_id}-cover.jpg"
            if cover_url:
                m.cover_poster.save(*url_image(cover_url, cover_filename))
                print("cover was saved")
            return m

    def create_poster(self):
        if self.registered:
            m_qs = Movie.objects.filter(id=self.movielens_id)
            if m_qs.exists():
                m= m_qs[0]
                poster_url = self.data.get("poster_url")
                poster_filename = f"{self.movielens_id}-poster.jpg"
                if poster_url:
                    if m.poster=="" or m.poster==None:
                        m.poster.save(*url_image(poster_url, poster_filename))
                        print("poster was saved")
                    else:
                        print("Already have poster")

                cover_url = self.data.get("cover_url")
                cover_filename = f"{self.movielens_id}-cover.jpg"
                if cover_url:
                    if m.cover_poster=="" or m.cover_poster==None:
                        m.cover_poster.save(*url_image(cover_url, cover_filename))
                        print("cover was saved")
                    else:
                        print("Already have cover poster")
            else:
                print("There is no corresponding movie")


    def create_cast(self):
        from items.models import Movie
        from persons.models import Person, Crew
        cast = self.data.get("cast")
        for c in cast:
            character = c.get("character")
            cast_tmdb_id = c.get("id")
            movie_qs = Movie.objects.filter(tmdb_id=self.tmdb_id)
            person_qs = Person.objects.filter(tmdb_id= cast_tmdb_id)
            if movie_qs.exists():
                if person_qs.exists() and len(person_qs)==1:
                    person = person_qs.first()
                    if not Crew.objects.filter(movie = movie_qs[0], person=person, job="a", character=character ).exists():
                        new_crew = Crew(movie = movie_qs[0], person=person, job="a", character=character )
                        new_crew.save()
                        print("crew object created with existing person")
                elif len(person_qs)==0:
                    np = Person.create_from_tmdb(cast_tmdb_id)
                    new_crew = Crew(movie = movie_qs[0], person=np, job="a", character=character )
                    new_crew.save()
                    print("crew object created with newly created person")

    def create_crew(self):
        from items.models import Movie
        from persons.models import Person, Crew
        crew = self.data.get("crew")
        for c in crew:
            job_def = c.get("job")
            if job_def=="Director":
                job="d"
            elif job_def=="Cinematography":
                job="f"
            elif job_def=="Writer":
                job="w"
            else:
                print("No corresponding job")
                continue
            crew_tmdb_id = c.get("id")
            movie_qs = Movie.objects.filter(tmdb_id=self.tmdb_id)
            person_qs = Person.objects.filter(tmdb_id= crew_tmdb_id)
            if movie_qs.exists():
                if person_qs.exists() and len(person_qs)==1:
                    person = person_qs.first()
                    if not Crew.objects.filter(movie = movie_qs[0], person=person, job=job ).exists():
                        new_crew = Crew(movie = movie_qs[0], person=person, job=job )
                        new_crew.save()
                        print("crew object created with existing person")
                elif len(person_qs)==0:
                    np = Person.create_from_tmdb(crew_tmdb_id)
                    new_crew = Crew(movie = movie_qs[0], person=np, job=job )
                    new_crew.save()
                    print("crew object created with newly created person")

    def create_videos(self):
        from items.models import Video
        video_list = self.data.get("videos")
        print("video list")
        if isinstance(video_list, list) and len(video_list)>0:
            movie_qs = Movie.objects.filter(id=self.movielens_id)
            if movie_qs.exists():
                movie = movie_qs[0]
                existing_videos = movie.videos.all().only("id", "youtube_id", "tags")
                """
                for exv in existing_videos:
                    if "trailer" in exv.tags:
                        print("There is already trailer")
                        return None
                """
                trailers_list = list(filter(lambda x: x.get("type")=="Trailer", video_list))

                trailers = [trailers_list[0]] if len(trailers_list)>0 else []
                featurettes = list(filter(lambda x: x.get("type")=="Featurette", video_list))
                bts = list(filter(lambda x: x.get("type")=="Behind the Scenes", video_list))

                combined_video_list = trailers + featurettes + bts
                print("total videos:{}".format(len(combined_video_list)))
                if len(combined_video_list)>0:
                    for tmdb_video in combined_video_list:
                        yt_id = tmdb_video.get("youtube_id")
                        check_yt_id = Video.objects.filter(youtube_id=yt_id)
                        if check_yt_id.exists():
                            print("There is already a video with this youtube id")
                            continue
                        video_dict = {}
                        video_dict["id"] = Video.autokey()
                        video_dict["title"] = tmdb_video.get('title')
                        video_dict["link"] = f"https://www.youtube.com/watch?v={yt_id}"
                        video_dict["youtube_id"] = yt_id
                        video_dict["thumbnail"] = f"https://img.youtube.com/vi/{yt_id}/mqdefault.jpg"
                        #video_dict["tags"] = tmdb_video.get("type").lower()
                        video = Video(**video_dict)
                        video.save()
                        print("video was saved")
                        video.related_movies.add(movie)
                        video.save()
                        print("related movie added.")
            else:
                print("There is no corresponding movie object")
        else:
            print("There is no video data")


    @classmethod
    def create_from_zero(cls, tmdb_id, movielens_id):
        tm = cls(tmdb_id=tmdb_id, movielens_id=movielens_id)
        tm.save()
        tm.save_data()
        movie = tm.create_movie()
        try:
            tm.create_cast()
            tm.create_crew()
        except:
            print("crew error")
        tm.create_videos()
        try:
            movie.set_imdb_rating_and_votes()
            tm.set_omdb_data(force=True)
        except:
            print("no omdb")
        movie.full_update()


    def save(self, *args, **kwargs):
        #self.quantity = self.related_movies.all().only("id").count()
        if not self.created_at:
            self.created_at = self.updated_at
        super().save(*args, **kwargs)  # Call the "real" save() method.


class ContentSimilarity(Model):
    movie = models.ForeignKey(Movie, related_name="content_similar_object",  on_delete=models.CASCADE)
    similars = models.ManyToManyField(Movie,null=True, blank=True, related_name="content_similars_of" )

    def __str__(self):
        return self.movie.name


class MovSim(Model):
    base_id = models.IntegerField(default=0)
    target_id = models.IntegerField(default=0)  
    commons = models.IntegerField()
    pearson= models.DecimalField(max_digits=4, decimal_places=3, null=True, blank=True)
    acs= models.DecimalField(max_digits=4, decimal_places=3, null=True, blank=True)

    class Meta:
        unique_together = ("base_id", "target_id",)

    def __str__(self):
        return f"Id-1: {self.base_id}  --  Id-2: {self.target_id}-->  commons:{self.commons}  pearson:{self.pearson}   acs:{self.acs}"

    def filter_ids(qs, movie_id, exclude=[]):
        # Exclude is an Integer -> Excludes the movie that we want similars of it
        movie_id_list = []
        for record in qs:
            b = record.base_id
            t = record.target_id
            if b not in movie_id_list and b!=movie_id and b not in exclude:
                movie_id_list.append(b)
            if t not in movie_id_list and t!=movie_id and t not in exclude:
                movie_id_list.append(t)
        return movie_id_list

    @classmethod
    def get_by_acs(cls, movie_id, exclude=[], id=True, quantity=6):
        Q1 = Q(base_id = movie_id)
        Q2 = Q(target_id = movie_id)
        Q12 = (Q1 | Q2)
        qs = cls.objects.filter(Q12, acs__gte=0.4).order_by("-acs")
        #checkl if less similars
        if qs.count()<quantity:
            qs = cls.objects.filter(Q12, acs__gte=0.25).order_by("-acs")
        if id:
            similar_ids = cls.filter_ids(qs, movie_id, exclude=exclude)
            return similar_ids[:quantity]
        return qs[:quantity]

    @classmethod
    def get_by_pearson(cls, movie_id, exclude=[], id=True, quantity=6):
        Q1 = Q(base_id = movie_id)
        Q2 = Q(target_id = movie_id)
        Q12 = (Q1 | Q2)
        qs = cls.objects.filter(Q12, pearson__gte=0.4).order_by("-pearson")
        #checkl if less similars
        if qs.count()<quantity:
            qs = cls.objects.filter(Q12, pearson__gte=0.25).order_by("-pearson")
        if id:
            similar_ids = cls.filter_ids(qs, movie_id, exclude=exclude)
            return similar_ids[:quantity]
        return qs[:quantity]

    @classmethod
    def get_similar_movies(cls, movie_id, excludes=[], min_similarity=0.5):
        #movie id
        Q1 = Q(base_id = movie_id)
        Q2 = Q(target_id = movie_id)
        Q12 = (Q1 | Q2)
        #similarity
        SQ1 = Q(acs__gte = min_similarity)
        SQ2 = Q(pearson__gte = min_similarity)
        SQ12 = (SQ1 | SQ2)
        final_Q = (Q12 & SQ12)

        if len(excludes) > 0:
            #exclude
            EQ1 = Q(base_id__in = excludes)
            EQ2 = Q(target_id__in = excludes)
            EQ12 = (EQ1 | EQ2)
            return MovSim.objects.filter(final_Q).exclude(EQ12)
            
        qs = MovSim.objects.filter(final_Q)
        return qs

    @classmethod
    def get_similar_movie_ids(cls, movie_id, excludes=[], min_similarity=0.5):
        similarity_records = cls.get_similar_movies(movie_id = movie_id, excludes = excludes,
                min_similarity = min_similarity)
        bm =  set(similarity_records.values_list("base_id", flat = True))
        tm =  set(similarity_records.values_list("target_id", flat = True))
        union = bm.union(tm)
        union.remove(movie_id)
        return union

    def load_from_csv(csv_path, batch_size):
        import json
        import pandas as pd
        from itertools import islice
        from tqdm import tqdm

        df = pd.read_csv(csv_path)
        df_json = df.to_json(orient="records")

        #movsim_list keys ['movie_id_1', 'movie_name_1', 'movie_id_2', 'movie_name_2', 'common', 'pearson', 'acs']
        movsim_list = json.loads(df_json)

        #---PRE-QUERY OF MOVIES------------->
        print("unique movie ids are calculating.")
        base_id_list = list(set([int(x.get("movie_id_1")) for x in movsim_list]))
        target_id_list = list(set([int(x.get("movie_id_2")) for x in movsim_list]))
        all_movie_id_list = list(set(base_id_list + target_id_list))

        print("Database uniquemovie id list is creating.")
        db_unique_ids = Movie.objects.all().values_list("id", flat=True)

        #BULK CREATING
        bulk_list = []
        print("records are extracting")
        for record in tqdm(movsim_list):
            #extract from list
            base_id = int(record.get("movie_id_1"))
            target_id = int(record.get("movie_id_2"))
            if base_id in db_unique_ids and target_id in db_unique_ids:
                commons = int(record.get("common"))
                pearson = float(record.get("pearson"))
                acs = float(record.get("acs"))
                new_obj = MovSim(base_id=base_id, target_id=target_id, commons=commons, acs=acs, pearson=pearson)
                bulk_list.append(new_obj)
            else:
                continue

        print("records have been created")
        #BATCHING
        #nested list of batches

        batched_list = cbs.batching(bulk_list, batch_size)
        print("batches of records are saving to database")
        for batch in batched_list:
            MovSim.objects.bulk_create(batch)
            print("batch objects created")




class MovieArchive(Model):
    movie_id = models.IntegerField(primary_key=True)
    dummyset = SetTextField(default=set,base_field=IntegerField())
    userset = SetTextField(default=set,base_field=IntegerField())

    def __str__(self):
        id = self.movie_id
        return f"Movie Archive Id: {id}"

"""
    USERARCHIVE NOW ONLY STORE DUMMY USERS AND RATINGS
"""

class UserArchive(Model):
    user_id = models.IntegerField() # !!! User Id !!! 
    user_type = models.CharField(max_length=1, choices=USER_TYPE)

    movieset = SetTextField(base_field=IntegerField())
    ratings = JSONField(default=dict)

    class Meta:
        unique_together = ("user_id","user_type")

    def __str__(self):
        return f"user_id:{self.user_id}, user_type:{self.user_type}"




    def values(self, c=True):
        values = list(self.ratings.values())
        if c:
            return cc.carray(values)
        return values

    # IF ANY HAS LESS THAN 40 POINTS
    @classmethod
    def clean_real_users(cls):
        qs = cls.objects.filter(user_type="u").only("user_id", "user_type")
        num = 0
        for ua in qs:
            try:
                ua_user = User.objects.get(id=ua.user_id)
                if len(ua_user.profile.ratings.keys())<40:
                    ua.delete()
                    num += 1
            except:
                continue
        print(f"{num} number of real users deleted from UserArchive class.")
    
    @classmethod
    def scan_real_users(cls):
        all_profiles = Profile.objects.all().only("user", "ratings")
        for p in all_profiles:
            if p.points>=40:
                p.create_or_update_archive()


    def get_mean(self):
        return round(cc.mean(self.values()), 3)
    

    def stdev(self):
        return cc.stdev(self.values())

    def commons(self, other):
        return self.movieset.intersection(other.movieset)

    def get_dummy_list_to_cache(part, min_points=20):
        import os
        import json
        from tqdm import tqdm
        import math
        print("Query is started")
        qs = UserArchive.objects.filter(movieset__len__gt=min_points, movieset__len__lt=1500, user_type="d").values("user_id", "ratings").order_by("user_id")
        qs_count = qs.count()
        split_from = math.ceil(qs_count // 2)
        if part==1:
            ALL_USERS = list(qs[ split_from : ])
        elif part==2:
            ALL_USERS = list(qs[ : split_from ])
        print("Query is finished. Now Average value are appending.")
        for d in ALL_USERS:
            mean = round(cc.mean_from_dict(d.get("ratings")), 3)
            d["mean"] = mean
        return list(ALL_USERS)

    def set_dummy_list_to_cache(min_points=20):
        import os
        import json
        from tqdm import tqdm
        from django.core.cache import cache
        
        print("Query is started")
        ALL_USERS = list(UserArchive.objects.filter(movieset__len__gt=min_points, movieset__len__lt=2000, user_type="d").values("user_id", "ratings"))
        print("Query is finished. Now Average value are appending.")
        for d in ALL_USERS:
            mean = round(cc.mean_from_dict(d.get("ratings")), 3)
            d["mean"] = mean
        print(f"length of dummy_dict:{len(ALL_USERS)}")
        try:
            print("Trying to save cache")
            cache.set("dummy", list(ALL_USERS), timeout=None)
            print("Saved to cache.Successful!!")
            #return True
        except:
            print("Error could not saved to Redis.")
            #return False

    def intersection_with_dict(self, other):
        return cc.intersection_with_dict(self.ratings, other.ratings)


    def intersection_with_set(self, other_movieset):
        return cc.intersection_with_set(self.movieset, other_movieset)

    def intersection_set_quantity(self, other):
        return cc.intersection_set_quantity(self.ratings, other.ratings)
    
    def target_users(self, movie_id, minimum_shared=12, bring=1000):
        movie = MovieArchive.objects.get(movie_id=int(movie_id))
        dummyset = set(cbs.random_sample(movie.dummyset, 15000))
        real_userset = set(cbs.random_sample(movie.userset, 15000))

        userset = dummyset.union(real_userset)
        usersets = UserArchive.objects.filter(user_id__in=userset).defer("ratings")
        target_user_dict = {}
        for user in usersets:
            if len(self.commons(user)) > minimum_shared:
                neigbour_and_shared = target_user_dict.update({ user : len(self.commons(user)) })
        return cbs.sort_dict(target_user_dict)[:bring]

    def neighbours(self, target_users_list,minimum_similarity=0.25, bring=15):
        neigbours_dict = {}
        ubar = self.get_mean()
        for user_tuple in target_users_list:
            user = user_tuple[0]
            common_movies = list(self.commons(user))
            uvalues =  cc.carray([v for k,v in self.ratings.items() if int(k) in common_movies])
            vvalues =  cc.carray([v for k,v in user.ratings.items() if int(k) in common_movies])

            vbar = user.get_mean()
            similarity = cc.pearson(uvalues, vvalues, ubar, vbar)
            if similarity==0:
                continue
            if similarity >minimum_similarity:
                neigbours_dict.update({ user:similarity })
        print("Number of neighbours:{}".format(len(neigbours_dict.values())))
        return cbs.sort_dict(neigbours_dict)[:bring]

            

    def prediction(self, movie_id, final="mean"):
        target_users = self.target_users(movie_id)
        #print(target_users)
        neighbours = self.neighbours(target_users)
        #print(neighbours)
        if len(neighbours)==0:
            return -1
        v_ratings = []
        v_bars = []
        v_sims = []
        v_stdevs = []
        if final=="mean":
            for n in neighbours:
                user = n[0]
                v_ratings.append(user.ratings.get(str(movie_id)))
                v_bars.append(user.get_mean())
                v_sims.append(n[1])
            
            m_score = cc.mean_score(cc.carray(v_ratings),
                    cc.carray(v_bars), cc.carray(v_sims))
            #print("mscore", m_score)
            result = self.get_mean() + m_score
            #print("result", result )
            return result

        elif final.startswith("z"):
            for n in neighbours:
                user = n[0]
                v_ratings.append(user.ratings.get(str(movie_id)))
                v_bars.append(user.get_mean())
                v_sims.append(n[1])
                v_stdevs.append(user.stdev())
            
            z_score = cc.z_score(cc.carray(v_ratings),cc.carray(v_bars),
                    cc.carray(v_sims), cc.carray(v_stdevs))
            result = self.get_mean() + self.stdev() * z_score
            return result


    def post_prediction(self, movie_id, final):
        result = self.prediction(movie_id, final)
        #print(f"mean 1: {result}")
        final_result = float()

        if result==-1:
            return 0
        #if unsense result, try z-score normalization
        elif result>=5 or result<=0:
            z_result =  self.prediction(movie_id, final="z")
            #print(f"z 1: {result}")

            if z_result>4.9 or z_result<=0.6:
                return 0
            else:
                final_result = round(z_result,1)
        else:
            final_result = round(result,1)
        
        #fine tuning
        if result>4:
            #How much further from 4.0
            surplus = final_result - 4
            #Subtract half of surplus
            trimmed_result = final_result - (surplus*0.5)
            return trimmed_result -0.1
        elif result<4 and result>3.5:
            surplus = final_result - 3.5
            trimmed_result = final_result - (surplus*0.5)
            return trimmed_result
        else:
            return final_result
