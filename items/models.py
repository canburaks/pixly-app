from django.db import models
from persons.abstract import SocialMedia, SEO, DateRecords, MainPage
from persons.models import Person
from persons.profile import Profile
from django.urls import reverse
from django_mysql.models import (JSONField, SetTextField, ListTextField, SetCharField)
from django.utils.functional import cached_property
from django.conf import settings
from django.db.models.signals import post_save
from django.contrib.sitemaps import ping_google
from gql.bs4 import parse_imdb_movie
from django.db.models import Q

from imagekit.models import ImageSpecField
from imagekit.processors import ResizeToFill
from ckeditor.fields import RichTextField
from ckeditor_uploader.fields import RichTextUploadingField
def item_image_upload_path(instance, filename):
    return "posters/{0}/{1}".format(instance.movie.id,filename)

def movie_poster_upload_path(instance, filename):
    return "posters/{0}/{1}".format(instance.id,filename)

def movie_cover_poster_upload_path(instance, filename):
    return "posters/{0}/cover/{1}".format(instance.id,filename)

def topic_image_upload_path(instance, filename):
    return "topics/{0}/{1}".format(instance.name, filename)

def topic_cover_poster_upload_path(instance, filename):
    return "topics/{0}/cover/{1}".format(instance.id,filename)
    
def tag_image_upload_path(instance, filename):
    return "tags/{0}/{1}".format(instance.name, filename)

def list_image_upload_path(instance, filename):
    return "lists/{0}/{1}".format(instance.id, filename)

def list_cover_image_upload_path(instance, filename):
    return "lists/{0}/cover/{1}".format(instance.id, filename)

def list_large_cover_image_upload_path(instance, filename):
    return "lists/{0}/large_cover/{1}".format(instance.id, filename)

def video_image_upload_path(instance, filename):
    return "videos/{0}/{1}".format(instance.id, filename)



LIST_RELATION_TYPE = (
    ('df', "Director's Favourite"),
    ("fw", "Festival Winner Movies"),
    ("gr", "Genre Related"),
    ("ms", "Miscellaneous"),
)


class Movie(SocialMedia, SEO,MainPage):
    id = models.IntegerField(primary_key=True)
    imdb_id = models.CharField(max_length=9, null=True)
    tmdb_id = models.IntegerField(null=True)
    active = models.BooleanField(default=False)

    name = models.CharField(max_length=100)
    year = models.IntegerField(null=True)
    summary = models.TextField(max_length=5000,null=True)
    slug = models.SlugField(db_index=True, max_length=100, null=True, blank=True, unique=True, )

    imdb_rating = models.DecimalField(max_digits=3, decimal_places=2, blank=True, null=True)
    imdb_votes = models.IntegerField(null=True, blank=True)

    poster = models.ImageField(blank=True, upload_to=movie_poster_upload_path)
    cover_poster = models.ImageField(blank=True, upload_to=movie_cover_poster_upload_path)
    #cover_mini = ImageSpecField(source='cover_poster',
    #                                  processors=[ResizeToFill(300, 168.75)],
    #                                  format='JPEG',
    #                                  options={'quality': 60})

    director = models.ForeignKey(Person, on_delete=models.CASCADE, null=True,blank=True, related_name="movies")

    data = JSONField(default=dict)

    created_at = models.DateTimeField(auto_now_add=True, null=True, blank = True)
    updated_at = models.DateTimeField(auto_now=True, null=True, blank = True)

    class Meta:
        ordering = ["-year"]

    def __str__(self):
        return self.name

    def get_short_summary(self):
        if len(self.summary) < 200:
            return self.summary
        else:
            plot = self.data.get("plot") if self.data.get("plot") else self.data.get("Plot")
            if plot != None and len(plot)<300:
                return plot
            else:
                return self.summary[:200] + "..."

    @classmethod
    def common_content_tags_of_movies(cls,movie_1, movie_2):
        Q_TAG = Q(genre_tag=False) & (Q(subgenre_tag=True) | Q(theme_tag=True) | Q(character_tag=True) | Q(base_tag=True) | Q(phenomenal_tag=True))
        tags_1 = movie_1.tags.filter(Q_TAG).values_list("name", flat=True)
        tags_2 = movie_2.tags.filter(Q_TAG).values_list("name", flat=True)
        return set(tags_1).intersection(set(tags_2))
    
    def common_content_tags(self, movie_2):
        Q_TAG = Q(genre_tag=False) & (Q(subgenre_tag=True) | Q(theme_tag=True) | Q(character_tag=True) | Q(base_tag=True) | Q(phenomenal_tag=True))
        tags_1 = self.tags.filter(Q_TAG).values_list("name", flat=True)
        tags_2 = movie_2.tags.filter(Q_TAG).values_list("name", flat=True)
        return set(tags_1).intersection(set(tags_2))

    #in order to bulk update, does not save
    def set_seo_description_keywords(self, save=True):
        from items.models import Tag
        from persons.models import Crew
        from archive.models import MovSim
        from archive.models import ContentSimilarity
        description_text = ""
        keywords = [self.name, self.slug, "User Ratings", "Credits", "Poster"]
        words = []

        #keywords
        csm = ContentSimilarity.objects.filter(movie=self)
        if csm.exists():
            keywords.append(f"similar movies like {self.name}")
            keywords.append(f"similar of {self.name}")
            keywords.append(f"movies like {self.name}")


        # director part
        dqs = Crew.objects.filter(job="d", movie=self).select_related("person").only("person__name")
        try:
            if dqs.exists():
                director_text = " A " +  ", ".join([x.person.name for x in dqs]) + " movie."
                words.append(director_text)
        except:
            print("try error: items.movie set_seo_desc ")

        # writer part
        wqs = Crew.objects.filter(job="w", movie=self).select_related("person").only("person__name")
        if wqs.exists():
            director_text = " Written by " +  ", ".join([x.person.name for x in wqs]) + "."
            words.append(director_text)

        # cast part
        aqs = Crew.objects.filter(job="a", movie=self).select_related("person").only("person__name")
        if aqs.exists():
            cast_text = " Stars: " +  ", ".join([x.person.name for x in aqs[:3]])  + "."
            words.append(cast_text)
        
        if self.seo_short_description!=None and len(self.seo_short_description) > 10 and len(self.seo_short_description) < 200:
            words.append(self.seo_short_description)

        description_text = "".join(words)

            

        if len(description_text)< 140:
            # appears part
            lqs = self.lists.all().filter(list_type="df")
            if lqs.count() > 0:
                fav_directors_qs = [x.related_persons.all()[0] for x in lqs]
                fav_directors_names = [x.name for x in fav_directors_qs]
                fav_d_text = f"{self.name} is a favourite movie of " +  ", ".join(fav_directors_names) + "."
                description_text += fav_d_text
        
        
        if len(description_text)< 140:
            if (MovSim.objects.filter(base_id=self.id).count() + MovSim.objects.filter(target_id=self.id).count()) > 0:
                #words.append(f" Similar Movies of {self.name} are: ")
                keywords.append("Similar Movies")

        #KEYWORDS
        #video part
        mvqs = self.videos.filter(tags__isnull=False)
        if mvqs.count() > 0:
            keywords.append("Videos")
            video_tags = Tag.objects.filter(related_videos__in=mvqs).values_list("slug", flat=True)
            if "trailer" in video_tags:
                keywords.append("Trailer")

            if "behind-the-scene" in video_tags:
                keywords.append("Behind The Scene")

            if "film-review" in video_tags:
                keywords.append("Review")

            if "video-essay" in video_tags:
                keywords.append("Video Essays")

            if "video-clip" in video_tags:
                keywords.append("Video Clips")
            if "film-critic" in video_tags:
                keywords.append("Film Critic")


        self.seo_description = description_text
        self.seo_keywords = ", ".join(keywords)
        #print(self.seo_description)
        #print(self.seo_keywords)
        if save:
            self.save()
        return (self.seo_description, self.seo_keywords)

    def set_seo_short_description(self):
        import requests
        url = ("http://www.omdbapi.com/?i={}&apikey=3f49586a").format(str(self.imdb_id))
        try:
            req = requests.get(url)
            data = req.json()
            text = data.get("Plot")
            if text != None  and len(text) >20:
                self.seo_short_description = text
                self.save()
        except:
            print(f"error id:{self.id}")

    def set_summary_from_omdb(self):
        import requests
        url = ("http://www.omdbapi.com/?i={}&apikey=3f49586a&plot=full").format(str(self.imdb_id))
        try:
            req = requests.get(url)
            data = req.json()
            text = data.get("Plot")
            print(text)
            if text != None  and len(text) >20:
                self.summary = text
                self.save()
        except:
            print(f"error id:{self.id}")

    def set_richdata(self, save=True):
        from gql.rich_data import RichData
        rdf = RichData.create_movie_data(self)
        if len(rdf.keys()) > 3:
            self.richdata = rdf
        if save:
            self.save()
    


    def add_slug(self):
        from django.utils.text import slugify
        try:
            convert = f"{self.name} {self.year}"
            self.slug = slugify(convert)
            self.save()
        except:
            convert = f"{self.tmdb_id} {self.name} {self.year} "
            self.slug = slugify(convert)
            self.save()



    @staticmethod
    def autocomplete_search_fields():
        return ("id__iexact", "name__icontains",)

    @property
    def archive(self):
        from archive.models import MovieArchive
        qs = MovieArchive.objects.get(movie_id= self.id)
        if qs.exists():
            return qs[0]
        else:
            ma = MovieArchive(movie_id= self.id)
            ma.save()
            return ma

    @property
    def shortName(self):
        if len(self.name)>10:
            return "{}...".format(self.name[:10])
        else:
            return self.name

    def get_absolute_url(self):
        "Returns the url to access a particular movie instance."
        return reverse('movie-detail', args=[str(self.id)])
        
    @property
    def image(self):
        return self.poster.url

    def setOmdbInfo(self, force=False):
        from .outerApi import omdb_details
        if self.summary and not force:
            return 0
        if self.imdb_id:
            imdbId=self.imdb_id
        try:
            resp = omdb_details(imdbId)
            if resp.get("imdbRating")!="N/A":
                self.imdb_rating = float(resp.get("imdbRating"))
            if resp.get("Director")!="N/A":
                d = resp.get("Director")
                self.data.update({"Director":d})
            if resp.get("Actors")!="N/A":
                a = resp.get("Actors")
                self.data.update({"Actors":a})

            if resp.get("Plot")!="N/A":
                p = resp.get("Plot")
                if len(p)>5000:
                    print("long summary",self.id, self.name, sep=",")
                else:
                    self.summary = p
                    self.data.update({"Plot":p})

            if resp.get("Website")!="N/A":
                w = resp.get("Website")
                self.data.update({"Website":w})


            if resp.get("Genre")!="N/A":
                g = resp.get("Genre")
                self.data.update({"Genre":g})

            if resp.get("Metascore")!="N/A":
                m = resp.get("Metascore")
                self.data.update({"Metascore":int(m)})

            if resp.get("Runtime")!="N/A":
                run = resp.get("Runtime")
                self.data.update({"Runtime":run})

            if resp.get("Country")!="N/A":
                coun = resp.get("Country")
                self.data.update({"Country":coun})

            if resp.get("Language")!="N/A":
                lang = resp.get("Language")
                self.data.update({"Language":lang})

            if resp.get("imdbVotes")!="N/A":
                vote = resp.get("imdbVotes")
                vote = vote.replace(",","")
                self.data.update({"imdbVotes":int(vote)})
            self.save()
            print("Info was set:" + self.name)
        except:
            print("could not get:",self.id, self.name, sep=",")

    def setTmdbInfo(self, force=False):
            from .outerApi import getPosterUrlAndSummary
            from django.core import files
            from io import BytesIO
            import requests
            if self.tmdb_id:
                try:
                    tmdb = self.tmdb_id
                    pUrl, overview, year = getPosterUrlAndSummary(tmdb)
                    if self.poster=="" or self.poster==None or force==True:
                        try:
                            resp = requests.get(pUrl)
                            fp = BytesIO()
                            fp.write(resp.content)
                            file_name = "{0}/{0}-tmdb.jpg".format(str(self.id))

                            self.poster.save(file_name, files.File(fp))
                            print("Movie Poster:{} saved.".format(self.id))
                        except:
                            print("request error")
                    if self.summary==None or self.summary=="":
                        self.summary = overview
                        self.save()
                        print("Movie:{} saved.".format(self.id))
                except:
                    print("error Id:{}".format(self.id))

    def getCastCrew(self):
        from gql import tmdb_class as t
        if self.tmdb_id:
            tmovie = t.Movie(self.tmdb_id)
            cast, crew = tmovie.credits()
            if cast:
                self.data.update({"cast":cast[:8]})
            if crew:
                self.data.update({"crew":crew})
            self.save()

    @property
    def tmdb(self):
        from gql.tmdb_class import Movie as TM
        if self.tmdb_id:
            return TM(self.tmdb_id)

    @property
    def tmdb_object(self):
        from archive.models import TmdbMovie
        qs = TmdbMovie.objects.filter(tmdb_id=self.tmdb_id)
        if qs.exists():
            return qs[0]
        return None

    def set_imdb_rating_and_votes(self):
        if self.imdb_id:
            try:
                rating, votes = parse_imdb_movie(self.imdb_id)
                print(f"rating:{rating} , votes:{votes}")
                self.imdb_rating = rating
                self.imdb_votes = votes
                self.save()
            except:
                print("Can not got imdb data")




    def save_cover_from_url(self):
        from gql.functions import url_image
        cover_url = self.tmdb.poster_links().get("tmdb_cover_path")
        if cover_url:
            filename = "{}-cover.jpg".format(self.id)
            self.cover_poster.save(*url_image(cover_url, filename))
            print("cover saved")
        else:
            print("cover url could not found")


    def save_poster_from_url(self, force=False):
        from gql.functions import url_image, get_poster_url
        if force==False:
            try:
                if self.poster and hasattr(self.poster, "url"):
                    print("Person already have poster")
                    pass
                else: 
                    if get_poster_url(self):
                        poster_url = get_poster_url(self)
                        filename = "{}-poster.jpg".format(self.id)
                        self.poster.save(*url_image(poster_url, filename))
                    else:
                        print("movie poster url could not found")
            except:
                print("Movie Model poster could not be saved from source ")

    def create_or_update_tmdb_movie(self):
        from archive.models import TmdbMovie
        tmovie, created = TmdbMovie.objects.update_or_create(movielens_id=self.id, tmdb_id=self.tmdb_id, registered=True)
        tmovie.save_data()

    def update_from_tmdb_movie(self):
        from archive.models import TmdbMovie
        tmovie, created = TmdbMovie.objects.update_or_create(movielens_id=self.id, tmdb_id=self.tmdb_id, registered=True)
        tmovie.save_data()
        tmovie.set_omdb_data()
        #tmovie.create_cast()
        #tmovie.create_crew()
        #tmovie.create_videos()
        self.data = self.tmdb_object.data
        self.update_social()
        self.update_content_similars()
        self.save()



    def update_social(self):
        tmdb_movie= self.tmdb_object
        if tmdb_movie:
            socials = tmdb_movie.data.get("external_ids")
            if socials:
                if socials.get("homepage")!=None and len(socials.get("homepage")) > 3:
                    print("homepage",socials.get("homepage"))
                    self.homepage = socials.get("homepage")
                if socials.get("twitter_id")!=None and len(socials.get("twitter_id")) > 3:
                    tw_id = socials.get("twitter_id")
                    print("twitter_id",tw_id)
                    self.twitter = f"https://www.twitter.com/{tw_id}"
                if socials.get("facebook_id")!=None and len(socials.get("facebook_id")) > 3:
                    fb_id = socials.get("facebook_id")
                    print("facebook_id",fb_id)
                    self.facebook =  f"https://www.facebook.com/{fb_id}"
                if socials.get("instagram_id")!=None and len(socials.get("instagram_id")) > 3:
                    insta_id = socials.get("instagram_id")
                    print("instagram_id",insta_id)
                    self.instagram = f"https://www.instagram.com/{insta_id}"
                self.save()
                return True
        if self.data.get("external_ids"):
            socials = self.data.get("external_ids")
            if socials:
                if socials.get("homepage")!=None and len(socials.get("homepage")) > 3:
                    print("homepage",socials.get("homepage"))
                    self.homepage = socials.get("homepage")
                if socials.get("twitter_id")!=None and len(socials.get("twitter_id")) > 3:
                    tw_id = socials.get("twitter_id")
                    print("twitter_id",tw_id)
                    self.twitter = f"https://www.twitter.com/{tw_id}"
                if socials.get("facebook_id")!=None and len(socials.get("facebook_id")) > 3:
                    fb_id = socials.get("facebook_id")
                    print("facebook_id",fb_id)
                    self.facebook =  f"https://www.facebook.com/{fb_id}"
                if socials.get("instagram_id")!=None and len(socials.get("instagram_id")) > 3:
                    insta_id = socials.get("instagram_id")
                    print("instagram_id",insta_id)
                    self.instagram = f"https://www.instagram.com/{insta_id}"
                self.save()
                return True

    def update_content_similars(self):
        from archive.models import ContentSimilarity 
        if self.tmdb_object and self.tmdb_object.data.get("similars"):
            similar_movie_records = self.tmdb_object.data.get("similars")
            if len(similar_movie_records)>0:
                tmdb_ids = [x.get("tmdb_id") for x in similar_movie_records]
                mqs = Movie.objects.filter(tmdb_id__in=tmdb_ids).only("id", "tmdb_id")
                #print("mqs", mqs, mqs.first())

                csm = ContentSimilarity.objects.filter(movie=self)
                if csm.exists():
                    content_record = csm.first()
                    content_record.similars.set(mqs)
                    content_record.save()
                else:
                    content_record = ContentSimilarity.objects.create(movie=self)
                    content_record.similars.set(mqs)
                    content_record.save()
                content_record.save()
                self.save()
                print(f"{len(tmdb_ids)} number of content similars saved")

    def update_tags_from_data_keywords(self):
        from items.models import Tag
        keywords = self.data.get("keywords")
        init_num = self.tags.count()
        if keywords and len(keywords) > 0:
            tag_tmdb_ids = [x.get("id") for x in keywords]
            #check genres
            if self.data.get("genres") and len(self.data.get("genres")):
                for g in self.data.get("genres"):
                    if g.get("id"):
                        tag_tmdb_ids.append(g.get("id"))
            tag_qs = Tag.objects.filter(tmdb_id__in=tag_tmdb_ids)
            if tag_qs.count() > 0:
                for tag in tag_qs:
                    tag.related_movies.add(self)
                    tag.save()
        self.save()
        final_num = self.tags.count()
        print(f"before:{init_num}, final: {final_num} ---{self.name}")


    def full_update(self):
        self.update_from_tmdb_movie()
        self.update_tags_from_data_keywords()
        self.set_seo_description_keywords()
        self.set_summary_from_omdb()
        self.set_seo_short_description()
        self.set_richdata()

    def save(self, *args, **kwargs):
        #self.quantity = self.related_movies.all().only("id").count()
        if not self.created_at:
            import datetime
            if self.year < 2019:
                self.created_at = datetime.datetime.now()
            elif self.year == 2019:
                self.created_at = self.updated_at
        if not self.slug:
            self.add_slug()
        super().save(*args, **kwargs)  # Call the "real" save() method.

                  


class List(SEO,MainPage):

    id = models.IntegerField(primary_key=True)
    name = models.CharField(max_length=100)
    summary = models.TextField(max_length=1000,null=True, blank=True,
        help_text="Minimumun 250 character, otherwise will not be shown.")
    movies = models.ManyToManyField(Movie, related_name="lists")

    slug = models.SlugField(max_length=100, null=True, blank=True, unique=True)

    owner = models.ForeignKey(Profile, related_name='lists', on_delete=models.DO_NOTHING)
    public = models.BooleanField(default=True)

    related_persons = models.ManyToManyField(Person, null=True, blank=True, related_name="related_lists")
    list_type = models.CharField(max_length=3, choices=LIST_RELATION_TYPE, null=True, blank=True ,
                help_text="What is the relation about the list and person? E.g; 'Directors favourite movie list'")

    reference_notes = models.CharField(max_length=400, null=True, blank=True, help_text="Notes about reference.")
    reference_link = models.URLField(null=True, blank=True, help_text="Reference of relation with person. Enter link of url")

    poster = models.ImageField(blank=True, null=True, upload_to=list_image_upload_path)
    cover_poster = models.ImageField(blank=True, null=True, upload_to=list_image_upload_path)
    large_cover_poster = models.ImageField(blank=True, null=True, upload_to=list_large_cover_image_upload_path)

    order = JSONField(default=dict, blank=True,null=True)

    created_at = models.DateTimeField(auto_now_add=True, null=True, blank = True)
    updated_at = models.DateTimeField(auto_now=True, null=True, blank = True)

    def __str__(self):
        return self.name

    def set_richdata(self, save=True):
        from gql.rich_data import RichData
        rdf = RichData.create_movie_list_data(self)
        if len(rdf.keys()) > 2:
            self.richdata = rdf
        if save:
            self.save()
    


    def save(self, *args, **kwargs):
        from django.utils.text import slugify
        if not self.slug:
            self.slug = slugify(self.name)
        return super().save(*args, **kwargs)

    def add_slug(self):
        from django.utils.text import slugify
        self.slug = slugify(self.name)
        self.save()


    @classmethod
    def autokey(cls):
        return cls.objects.all().order_by("-id")[0].id + 1

    @staticmethod
    def autocomplete_search_fields():
        return ("id__iexact", "name__icontains",)

    @cached_property
    def get_movies(self):
        return self.movies.all()
    
    @property
    def image(self):
        aws = settings.MEDIA_URL
        posters = self.movies.order_by("-imdb_rating").values("poster")[:4]
        poster_urls = ["{}{}".format(aws,i["poster"]) for i in posters]
        return poster_urls
    
    @property
    def single_image(self):
        mqs = self.movies.exclude(poster="").order_by("-imdb_rating")[:10]
        for m in mqs:
            if m.poster and hasattr(m.poster, "url"):
                return m.poster.url

    @property
    def images_all(self):
        aws = settings.MEDIA_URL
        movies = self.movies.order_by("-year").values("poster", "name", "id")[:]
        image_set = [{
            "poster":"{}{}".format(aws,i["poster"]), "name":i.get("name"), "id":i.get("id")
            } for i in movies]
        return image_set
        
    def movieset(self):
        return self.movies.values_list("id", flat=True)


    #in order to bulk update, does not save
    def set_seo_description_keywords(self, save=True):
        from items.models import Tag
        #from persons.models import Crew
        #from archive.models import MovSim
        description_text = "Pixly Collections: " +  self.name
        #words = [self.name]
        keywords = ["Movie Lists", "Movie Collections", "Pixly Lists", "Pixly Collections"]

        #KEYWORDS
        if self.list_type == "df" and self.related_persons.all().count() > 0:
            print("df")
            print(self.related_persons.all())
            for p in self.related_persons.all():
                keywords.append(f"{p.name} Favourite Movies")
                keywords.append(f"{p.name} Liked Movies")
                keywords.append(f"{p.name} Top Movies")

        if self.list_type == "fw":
            keywords.append(f"{self.name}")
            keywords.append(f"Festival Winner Movies")
            keywords.append(f"Festival Award Movies")
            keywords.append(f"Festival Movies")

        if self.list_type == "gr":
            description_text += ". This list is edited and curated by Pixly." 

        #if self.list_type == "gr" and  self.tags.all().count() > 0:
        #    list_tags = self.tags.all().only("name", "slug")
        #    for t in list_tags:
        #        keywords.append(t.name.capitalize())

        self.seo_description = description_text
        self.seo_keywords = ", ".join(keywords)
        #print(self.seo_description)
        #print(self.seo_keywords)
        if save:
            self.save()
        return (self.seo_description, self.seo_keywords)



class Video(DateRecords):
    id = models.IntegerField(primary_key=True)
    title = models.CharField(max_length=150)
    summary = models.CharField(max_length=2000, null=True, blank=True)
    link = models.URLField()
    tagss = ListTextField(default = list(),base_field=models.CharField(max_length=40),
                    null=True, help_text="Enter the type of video category.\n E.g:'video-essay or interview or conversations'")
    duration = models.IntegerField(null=True,blank=True, help_text="seconds")
    thumbnail = models.URLField(null=True, blank=True, help_text="Thumbnail url if exists.")
    youtube_id = models.CharField(max_length=50, null=True, blank=True,unique=True, help_text="Youtube video id, if video is on TouTube.")
    
    data = JSONField(default=dict)

    channel_url = models.URLField(null=True, blank=True, help_text="Youtube channel's main page link")
    channel_name = models.CharField(max_length=150, null=True, blank=True, help_text="Name of the Youtube channel")

    related_persons = models.ManyToManyField(Person, blank=True, related_name="videos")
    related_movies = models.ManyToManyField(Movie, blank=True, related_name="videos")

    def __str__(self):
        return self.title
    
    @property
    def youtube_object(self):
        from gql.youtube_client import Youtube
        return Youtube(self.youtube_id)
        

    def get_caption_data(self):
        import requests
        key = "AIzaSyBdIAvGGzQn_IieJtZrrdLp1theKPe_FU0"
        url = f'https://www.googleapis.com/youtube/v3/captions?part=snippet&videoId={self.youtube_id}&key={key}'
        req = requests.get(url)
        return req.json()


    def update_data(self):
        youtube_data = self.youtube_object.get_data()
        caption_data = self.youtube_object.get_caption_data()
        try:
            video_item = youtube_data.get("items")[0]

            content_details = video_item.get("contentDetails")
            snippet = video_item.get("snippet")
            topics =  video_item.get("topicDetails")

            data = {}
            if content_details:
                data["license"] = content_details.get("licensedContent")
                data["duration_iso"] = content_details.get("duration")
            if topics and topics.get("topicCategories"):
                data["topics"] = topics.get("topicCategories")
            if snippet:
                data["title"] = snippet.get("title")
                data["category_id"] = snippet.get("categoryId")
                data["thumbnails"] = snippet.get("thumbnails")
                data["tags"] = snippet.get("tags")
                #CHANNEL
                if snippet.get("channelTitle"):
                    data["channel_name"] = snippet.get("channelTitle")
                    self.channel_name = snippet.get("channelTitle")
                if snippet.get("channelId"):
                    ch_id = snippet.get("channelId")
                    data["channel_id"] = ch_id
                    self.channel_url = f"https://www.youtube.com/channel/{ch_id}"
                data["summary"] = snippet.get("description")
                data["published_at"] = snippet.get("publishedAt")
            if caption_data and len(caption_data) > 0:
                data["captions"] = caption_data
            if len(list(data.keys())) > 0:
                self.data = data
                self.save()
                print(f"{self.id} - data was updated")
        except:
            print(f"Error - {self.id} data could not be updated")      
                

    @staticmethod
    def autocomplete_search_fields():
        return ("id__iexact", "title__icontains",)

    @classmethod
    def autokey(cls):
        return cls.objects.all().order_by("-id")[0].id + 1

    @property
    def tag_list(self):
        video_tags = self.tags.all().values_list("name", flat=True)



class VideoList(DateRecords):

    id = models.IntegerField(primary_key=True)
    name = models.CharField(max_length=100)
    summary = models.TextField(max_length=2000,null=True, blank=True)

    videos = models.ManyToManyField(Video, related_name="related_lists")

    owner = models.ForeignKey(Profile, related_name='video_lists', on_delete=models.DO_NOTHING)
    public = models.BooleanField(default=True)
    tags = models.ManyToManyField("items.Tag", null=True, blank=True, related_name="related_video_lists")
    related_persons = models.ManyToManyField(Person, null=True, blank=True, related_name="related_video_lists")


    reference_notes = models.CharField(max_length=400, null=True, blank=True, help_text="Notes about reference.")
    reference_link = models.URLField(null=True, blank=True, help_text="Reference: Enter link of url")

    poster = models.ImageField(blank=True, null=True, upload_to=video_image_upload_path)

    def __str__(self):
        return self.name
    
    @classmethod
    def autokey(cls):
        return cls.objects.all().order_by("-id")[0].id + 1



class Article(models.Model):
    id = models.IntegerField(primary_key=True)
    name = models.CharField(max_length=250)
    abstract = models.CharField(max_length=2000, null=True, blank=True)
    content = models.TextField(max_length=20000, null=True, blank=True)
    link = models.URLField(null=True, blank=True)

    related_persons = models.ManyToManyField(Person, blank=True, related_name="articles")
    related_movies = models.ManyToManyField(Movie, blank=True, related_name="articles")
    related_topics = models.ManyToManyField("items.Topic", blank=True, related_name="articles")
    
    def __str__(self):
        return self.title
    @staticmethod
    def autocomplete_search_fields():
        return ("id__iexact", "name__icontains",)
        
class Rating(models.Model):
    profile = models.ForeignKey(Profile, related_name='rates', on_delete=models.CASCADE)
    movie = models.ForeignKey(Movie, related_name='rates', on_delete=models.CASCADE)
    rating = models.DecimalField(max_digits=2, decimal_places=1, null=True, blank=True)

    notes = models.CharField(max_length=2500, blank=True, null=True)
    date = models.DateField(null=True, blank=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ("profile","movie",)

    def __str__(self):
        return "Profile: {}, Movie: {}, Ratings:{}".format(self.profile, self.movie,self.rating)

class Prediction(models.Model):
    profile = models.ForeignKey(Profile, related_name='predictions', on_delete=models.CASCADE)
    profile_points = models.IntegerField()

    movie = models.ForeignKey(Movie, related_name='predictions', on_delete=models.CASCADE)
    prediction = models.DecimalField(max_digits=2, decimal_places=1, null=True, blank=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return "Profile: {}, Movie: {}, Prediction:{}".format(self.profile, self.movie,self.prediction)



class Topic(SEO):
    id = models.IntegerField(primary_key=True)
    name = models.CharField(max_length=400)
    summary = models.TextField(max_length=300,null=True, blank=True, help_text="short summary of topic")
    content = models.TextField(max_length=10000,null=True, blank=True, help_text="Detailed description")
    
    movies = models.ManyToManyField(Movie,null=True, blank=True, related_name="topics")
    lists = models.ManyToManyField(List,null=True, blank=True, related_name="topics")
    tags = models.ManyToManyField("items.Tag",null=True, blank=True, related_name="topics")
    persons = models.ManyToManyField(Person,null=True, blank=True, related_name="topics")

    poster = models.ImageField(blank=True, upload_to=topic_image_upload_path)
    cover_poster = models.ImageField(blank=True, upload_to=topic_cover_poster_upload_path)

    active = models.BooleanField(default=False)


    def __str__(self):
        return self.name

    def save(self, *args, **kwargs):
        #self.quantity = self.related_movies.all().only("id").count()
        if not self.id:
            last_pk = Topic.objects.all().last().id 
            self.id = last_pk + 1
        super().save(*args, **kwargs)  # Call the "real" save() method.




TAG_INFO_TYPE = (
    ("award", "Awarded"),
    ('base', "Based on"),
    ("content", "Content-Tag"),
    ("country", "Country"),
    ("genre", "Genre"),
    ("subgenre", "Sub-Genre"),
    ("era", "Era movie"),
)
TAG_DISCIPLINE_TYPE = (
    ("phil", "Philosophy"),
    ("soc", "Sociology"),
    ("psy", "Psychology"),
)
TAG_OBJECT_TYPE = (
    ("movie", "Movie Content Tags"),
    ("video", "Video Content Tags"),
    ("list", "List Content Tags"),
    ("article", "Article/Blog Post Tags"),
)

class Tag(models.Model):
    name = models.CharField(max_length=400)
    slug = models.SlugField(max_length=100, null=True, blank=True, unique=True, db_index=True)

    custom_id = models.IntegerField(unique=True,  null=True, blank=True,)
    movielens_id = models.IntegerField(unique=True,  null=True, blank=True,)
    tmdb_id = models.IntegerField(unique=True,  null=True, blank=True,)
    tmdb_id_2 = models.IntegerField(unique=True,  null=True, blank=True, help_text="in case of similar tags like: 'heartwarming' and 'heart-warming'")
    netflix_id = models.IntegerField(unique=True,  null=True, blank=True,)

    video_tag = models.BooleanField(default=False, help_text="tags that classifies video object")
    era_tag = models.BooleanField(default=False)
    geo_tag = models.BooleanField(default=False)
    genre_tag = models.BooleanField(default=False)
    subgenre_tag = models.BooleanField(default=False)
    award_tag = models.BooleanField(default=False)
    base_tag = models.BooleanField(default=False)

    theme_tag = models.BooleanField(default=False, help_text="Narrow topics, or more special cases; suicide-attempt, surf, prison-escape")
    character_tag = models.BooleanField(default=False)
    historical_person_tag = models.BooleanField(default=False)
    phenomenal_tag = models.BooleanField(default=False)
    series_tag = models.BooleanField(default=False)
    documentary_tag = models.BooleanField(default=False)
    form_tag = models.BooleanField(default=False, help_text="About form of movie; no-dialogue, dialogue, 70mm, nonlinear, multiple-storylines, etc..")
    adult_tag = models.BooleanField(default=False)



    parent_genres = ListTextField(default = list(),base_field=models.CharField(max_length=100),
        null=True, blank=True, help_text="list of parent-genres slugs")


    related_movies = models.ManyToManyField(Movie, null=True, blank=True, related_name="tags")
    related_videos = models.ManyToManyField(Video, null=True, blank=True, related_name="tags")
    related_lists = models.ManyToManyField(List, null=True, blank=True, related_name="tags")

    #this for movies and lists
    tag_type = models.CharField(max_length=11, choices=TAG_INFO_TYPE, null=True, blank=True )

    discipline_type = models.CharField(max_length=11, choices=TAG_DISCIPLINE_TYPE, null=True, blank=True )
    object_type = models.CharField(max_length=11, choices=TAG_OBJECT_TYPE, null=True, blank=True )


    poster = models.ImageField(blank=True, null=True, upload_to=tag_image_upload_path)

    def __str__(self):
        return self.name

    @property
    def tmdb(self):
        from gql.tmdb_class import Tag
        if self.tmdb_id:
            ttag = Tag(self.tmdb_id)
            return ttag.details()
    
    @property
    def tmdb2(self):
        from gql.tmdb_class import Tag
        if self.tmdb_id_2:
            ttag = Tag(self.tmdb_id_2)
            return ttag.details()
            
    def update_tmdb_movies(self):
        if self.tmdb_id_2:
            initial_num = self.related_movies.all().count()
            response = self.tmdb2.get("results")
            if response and len(response) > 0:
                founded_num = len(response)
        
                movie_tmdb_ids = [x.get("id") for x in response]
                mqs = Movie.objects.filter(tmdb_id__in=movie_tmdb_ids).only("id", "tmdb_id")
                for m in mqs:
                    self.related_movies.add(m)
                final_num =  self.related_movies.all().count()
                m.save()
                print(f"TMDB-ID-2 => Founded: {founded_num}, before:{initial_num}, final: {final_num} ---{self.name}")
        if self.tmdb_id:
            initial_num = self.related_movies.all().count()
            response = self.tmdb.get("results")
            if response and len(response) > 0:
                founded_num = len(response)
        
                movie_tmdb_ids = [x.get("id") for x in response]
                mqs = Movie.objects.filter(tmdb_id__in=movie_tmdb_ids).only("id", "tmdb_id")
                for m in mqs:
                    self.related_movies.add(m)
                final_num =  self.related_movies.all().count()
                m.save()
                print(f"TMDB-ID-1 => Founded: {founded_num}, before:{initial_num}, final: {final_num} ---{self.name}")
                

    @property
    def movie_quantity(self):
        return self.related_movies.all().count()
    
    @property
    def movie_ids(self):
        return [x.id for x  in self.related_movies.only("id").all()]

    def add_slug(self):
        from django.utils.text import slugify
        try:
            convert = f"{self.name}"
            self.slug = slugify(convert)
            self.save()
        except:
            convert = f"{self.name} {self.custom_id} "
            self.slug = slugify(convert)
            self.save()

    @classmethod
    def set_tag_type(cls, tag_id_list, tag_type):
        from tqdm import tqdm
        tag_qs = cls.objects.filter(movielens_id__in=tag_id_list)
        for t in tqdm(tag_qs):
            t.tag_type= tag_type
            t.save()

    def save(self, *args, **kwargs):
        #self.quantity = self.related_movies.all().only("id").count()
        if not self.pk or not self.id:
            last_pk = Tag.objects.all().last().pk
            print("last pk id:", last_pk)
            self.pk = last_pk + 1
            self.id = last_pk + 1
        super().save(*args, **kwargs)  # Call the "real" save() method.


class Quote(models.Model):
    id = models.IntegerField(primary_key=True)
    text = models.TextField(max_length=2000)

    owner = models.ForeignKey(Person, null=True, blank=True, related_name="quotes", on_delete=models.CASCADE)
    movie = models.ForeignKey(Movie, null=True, blank=True, related_name="quotes", on_delete=models.CASCADE)
    
    reference_notes = models.CharField(max_length=400, null=True, blank=True, help_text="Notes about reference.")
    reference_link = models.URLField(null=True, blank=True, help_text="Reference of relation with person. Enter link of url")

    def __str__(self):
        return self.text[:50]

#######################################################################################

def post_save_rating_signal(sender, instance, created, *args, **kwargs):
    if created:
        try:
            from persons.profile import Activity
            a = Activity(profile=instance.profile, action="rm", movie_id=instance.movie.id)
            a.save()
            print("Rating Signal failed.")
        except:
            print("Rating Signal failed.")

post_save.connect(post_save_rating_signal, sender=Rating)


def post_movie_create(sender, instance, created, *args, **kwargs):
    if created:
        try:
            from archive.models import MovieArchive
            qs = MovieArchive.objects.filter(movie_id = instance.id)
            if not qs.exists():
                MovieArchive(movie_id = instance.id)
                print("MovieArchive object created due to new movie with id {}.".format(instance.id))
        except:
            print("MovieArchive object creation failed.(Post movie signal id:{})".format(instance.id))

post_save.connect(post_movie_create, sender=Movie)

######################################################################################

