from django.db import models
from persons.abstract import SocialMedia, SEO, DateRecords, MainPage
from persons.models import Person, Crew
from persons.profile import Profile
from django.urls import reverse
from django_mysql.models import (JSONField, SetTextField, ListTextField, SetCharField)
from django.utils.functional import cached_property
from django.conf import settings
from django.db.models.signals import post_save
from django.contrib.sitemaps import ping_google
from gql.bs4 import parse_imdb_movie
from django.db.models import Q

from imagekit.processors import ResizeToFill
from ckeditor.fields import RichTextField
from ckeditor_uploader.fields import RichTextUploadingField

def item_image_upload_path(instance, filename):
    return "posters/{0}/{1}".format(instance.movie.id,filename)

def movie_poster_upload_path(instance, filename):
    return "posters/{0}/{1}".format(instance.id,filename)

def movie_large_poster_upload_path(instance, filename):
    return "posters/{0}/large-{1}".format(instance.id,filename)

def movie_cover_poster_upload_path(instance, filename):
    return "posters/{0}/cover/{1}".format(instance.id,filename)

def movie_topic_poster_upload_path(instance, filename):
    return "posters/{0}/topic-poster/{1}".format(instance.id,filename)

def topic_image_upload_path(instance, filename):
    return "topics/{0}/{1}".format(instance.name, filename)

def topic_cover_poster_upload_path(instance, filename):
    return "topics/{0}/cover/{1}".format(instance.id,filename)
    
def topic_hero_poster_upload_path(instance, filename):
    return "topics/{0}/hero/{1}".format(instance.id,filename)

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

def topic_item_cover_poster_path(instance, filename):
    return "topics/{0}/items/cover/{1}".format(instance.id,filename)

def topic_item_poster_path(instance, filename):
    return "topics/{0}/items/poster/{1}".format(instance.id,filename)
    
LIST_RELATION_TYPE = (
    ('df', "Director's Favourite"),
    ("fw", "Festival Winner Movies"),
    ("gr", "Genre Related"),
    ("ms", "Miscellaneous"),
    ("mm", "Movies of the Month"),
    ("my", "Movies of the Year")
)


class Movie(SocialMedia, SEO,MainPage):
    id = models.IntegerField(primary_key=True)
    imdb_id = models.CharField(max_length=9, null=True)
    tmdb_id = models.IntegerField(null=True)
    active = models.BooleanField(default=False)

    name = models.CharField(max_length=100)
    year = models.IntegerField(null=True)
    release = models.DateField(null=True, blank=True)
    summary = models.TextField(max_length=3000,null=True)
    content_similars_summary = models.TextField(max_length=1000,null=True, blank=True)
    html_content = RichTextField(max_length=3000,null=True, blank=True, help_text="For Feature Movies that will show on Topic Page.")
    slug = models.SlugField(db_index=True, max_length=100, null=True, blank=True, unique=True, )

    imdb_rating = models.DecimalField(max_digits=3, decimal_places=2, blank=True, null=True)
    imdb_votes = models.IntegerField(null=True, blank=True)

    poster = models.ImageField(blank=True, upload_to=movie_poster_upload_path)
    large_poster = models.ImageField(blank=True, upload_to=movie_large_poster_upload_path)
    cover_poster = models.ImageField(blank=True, upload_to=movie_cover_poster_upload_path)

    #1280x300px
    wide_poster = models.ImageField(blank=True, upload_to=movie_topic_poster_upload_path)


    director = models.ForeignKey(Person, on_delete=models.CASCADE, null=True,blank=True, related_name="movies")

    data = JSONField(default=dict)

    created_at = models.DateTimeField(auto_now_add=True, null=True, blank = True)
    updated_at = models.DateTimeField(auto_now=True, null=True, blank = True)

    class Meta:
        ordering = ["-year"]

    def __str__(self):
        return self.name

    @classmethod
    def common_content_tags_of_movies(cls,movie_1, movie_2):
        Q_TAG = Q(genre_tag=False) & (Q(subgenre_tag=True) | Q(theme_tag=True) | Q(character_tag=True) | Q(base_tag=True) | Q(phenomenal_tag=True))
        tags_1 = movie_1.tags.filter(Q_TAG).values_list("name", flat=True)
        tags_2 = movie_2.tags.filter(Q_TAG).values_list("name", flat=True)
        return set(tags_1).intersection(set(tags_2))
    
    def common_content_tags(self, movie_2):
        Q_TAG = (Q(subgenre_tag=True) | Q(theme_tag=True) | Q(character_tag=True) | Q(base_tag=True) | Q(phenomenal_tag=True))
        tags_1 = self.tags.filter(Q_TAG).values_list("name", flat=True)
        tags_2 = movie_2.tags.filter(Q_TAG).values_list("name", flat=True)
        return set(tags_1).intersection(set(tags_2))

    def common_nongenre_tags(self, movie_2):
        return list(set(self.nongenre_tag_names).intersection(set(movie_2.nongenre_tag_names)))
        
    def common_tags(self, movie_2):
        return list(set(self.tag_names).intersection(set(movie_2.tag_names)))
    #-------------CONTENT SIMILARS------------------------
    @property
    def cso(self):
        if self.content_similar_object.exists():
            return self.content_similar_object.first()
        return None

    @property
    def cso_similars(self):
        if self.cso:
            return self.cso.similars.all().only(
                "id", "slug", "name", "year", "poster",
                "cover_poster", "imdb_rating",
                ).prefetch_related("tags")
        return []
    
    @property
    def cso_similars_of(self):
        if self.cso:
            return self.cso.similars.all().only(
                "id", "slug", "name", "year", "poster",
                "cover_poster", "imdb_rating",
                ).prefetch_related("tags")
        return []

    def cso_add(self, movie):
        if self.cso:
            self.cso.similars.add(movie)
            self.cso.save()
            print(f"{movie.name} added as similars to {self.name}.")
            return True
        else:
            from archive.models import ContentSimilarity
            print(f"{self.name} has no content similar object. It will be created now.")
            new_cso = ContentSimilarity.objects.create(movie=self)
            new_cso.similars.add(movie)
            new_cso.save()
        return True

    def cso_remove(self, movie):
        if self.cso:
            self.cso.similars.remove(movie)
            self.cso.save()
            print(f"{movie.name} removed from similars of {self.name}.")
            return True
        print(f"Error: {self.name} has no content similar object. First Create, than remove")
        return False

    #-------------------------------------

    @property
    def genre_names(self):
        return self.tags.filter(genre_tag=True).values_list("slug", flat=True)
    
    @property
    def tag_names(self):
        return self.tags.all().values_list("slug", flat=True)

    @property
    def nongenre_tag_names(self, include_mix_tags=True):
        if include_mix_tags:
            mix_tags = self.tags.filter(genre_tag=True, theme_tag=True).values_list("slug", flat=True)
            nongenres =  set(self.tag_names).difference(self.genre_names)
            return list(set(mix_tags).union(nongenres))
        return list(set(self.tag_names).difference(self.genre_names))


    @property
    def video_tags(self):
        return self.videos.values_list("tags__slug", flat=True)

    @property
    def have_trailer(self):
        return "trailer" in self.video_tags

    @property
    def have_content_similars(self):
        try:
            return self.content_similar_object.all()[0].similars.all().exists()
        except:
            return False
    
    @property
    def have_similars(self):
        from archive.models import MovSim
        return MovSim.objects.filter(
                base_id=self.id, pearson__gte=0.35,commons__gte=200 ).count()>0
    

    @property
    def have_director(self):
        return Crew.objects.filter(movie=self, job__in="d" \
            ).exclude(person__poster__exact='').exists()

    @property
    def director_names(self):
        return Crew.objects.filter(movie=self, job="d"
            ).values_list("person__name", flat=True)

    @property
    def have_crew(self):
        # returns true if more than 3 actor.
        return Crew.objects.filter(movie=self, job__in="a" \
            ).exclude(person__poster__exact='').count() > 3

    @property
    def get_content_similar_object(self):
        return self.content_similar_object.all()[0]
    
    def __old_get_similar_ids(self):
        from archive.models import MovSim
        return MovSim.objects.filter(base_id=self.id, pearson__gte=0.3, 
            commons__gte=200).values_list("target_id", flat=True)

    def get_similar_ids(self, min_similarity=0.25):
        from archive.models import MovSim
        Q_SIM = Q(commons__gte=200) & (Q(pearson__gte=min_similarity) | Q(acs__gte=min_similarity)) 
        return MovSim.objects.filter(Q_SIM, base_id=self.id
                ).order_by("pearson").values_list("target_id", flat=True)

    def get_short_summary(self):
        if len(self.summary) < 200:
            return self.summary
        else:
            plot = self.data.get("plot") if self.data.get("plot") else self.data.get("Plot")
            if plot != None and len(plot)<300:
                return plot
            else:
                return self.summary[:200] + "..."



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


    def update_cover_poster(self):
        from pixly.lib import url_image
        cover_url = self.tmdb.poster_links().get("tmdb_cover_path")
        if cover_url:
            filename = "{}-cover.jpg".format(self.id)
            self.cover_poster.save(*url_image(cover_url, filename))
            print("cover saved")
        else:
            print("cover url could not found")


    def create_or_update_tmdb_movie(self):
        from archive.models import TmdbMovie
        tmovie, created = TmdbMovie.objects.update_or_create(movielens_id=self.id, tmdb_id=self.tmdb_id, registered=True)
        tmovie.save_data()

    def update_from_tmdb_movie(self):
        from archive.models import TmdbMovie
        tmovie, created = TmdbMovie.objects.update_or_create(movielens_id=self.id, tmdb_id=self.tmdb_id, registered=True)
        tmovie.save_data()
        try:
            tmovie.set_omdb_data()
        except:
            print("no omdb update_from_tmdb_movie")
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
            #respect tp tmdb_id
            tag_qs = Tag.objects.filter(tmdb_id__in=tag_tmdb_ids)
            if tag_qs.count() > 0:
                for tag in tag_qs:
                    tag.related_movies.add(self)
                    tag.save()

            #respect to slug
            genres = self.data.get("genres")
            tag_slugs = [x.get("name").strip().lower().replace(" ", "-") for x in genres]
            tag_slug_qs = Tag.objects.filter(slug__in=tag_slugs)
            if tag_slug_qs.count() > 0:
                for tag in tag_slug_qs:
                    tag.related_movies.add(self)
                    tag.save()
        self.save()
        final_num = self.tags.count()
        print(f"before:{init_num}, final: {final_num} ---{self.name}")


    def full_update(self):
        self.update_from_tmdb_movie()
        #print("1")
        self.set_seo_title()
        self.set_seo_description_keywords()
        self.save()
        self.update_tags_from_data_keywords()
        #print("2")
        self.set_richdata()

    def generate_description(self):
        text = ""
        dn = list(self.director_names)
        tag_names = self.tag_names
        genres = self.genre_names
        director_name = ""
        if dn:
            if len(dn) == 1:
                director_name = dn[0]
            elif len(dn) == 2:
                director_name = f"{dn[0]} and {dn[1]}"
            elif len(dn) > 2:
                director_name = "many directors"
        #definition word

        #------------DOCUMENTARY------------
        if "documentary" in tag_names:
            tags_wo_doc = set(tag_names).difference({"documentary"})
            text += f"A {self.year} documentary which has {', '.join(tags_wo_doc)} topics."
        else:
            #-------------MOVIES----------------
            #Imdb Rating based text
            if self.year == 2018 or self.year >= 2019:
                if self.imdb_rating and self.imdb_rating > 7.5:
                    if self.imdb_rating and self.imdb_rating > 8:
                        text += f"One of the best movies of {self.year} directed by {director_name}."
                    else:
                        text += f"One of the good movies of {self.year} directed by {director_name}."
                else:
                    text += f"A {director_name} movie released in {self.year}."
            else:
                if self.imdb_rating and self.imdb_rating > 8.2:
                    text += f"One of the best movies directed by {director_name}."
                else:
                    text += f"A {director_name} movie released in {self.year}."

            # Similars, Recommendation
            sim_text = f" See similar movies like {self.name} ({self.year}), {self.name} cast, plot and the trailer." 
            sim_text_num = len(sim_text)
            current_num = len(text)
            available_num = 150 - (current_num + sim_text_num)
            #text += f" {self.summary[:available_num]}.."
            text = text + f" {self.summary[:available_num]}..." + sim_text
        print(f"description length: {len(text)}")
        return text

    def generate_title(self):
        #start with year, add name at the end
        year_text = f" ({self.year}) - " 

        # Trailer
        video_tags = set(self.video_tags)
        video_text = ""
        if len(video_tags) > 0:
            #check videos other than trailer
            tags_without_trailer = video_tags.difference({"trailer"})  
            if len(tags_without_trailer) > 0:
                video_text += ", Videos"
            else:
                video_text += ", Trailer"


        # Similars, Recommendation
        def_text = f"Similar Movies, Plot, Cast"
        def_plus_video_text  = def_text + video_text if video_text else def_text
                    

        non_name_text = year_text + def_plus_video_text
        remaining_chars = 59 - len(non_name_text)
        title = f"{self.name.strip()[:remaining_chars]}{non_name_text}"
        print(f"title length: {len(title)}, title: {title}")
        return title


    #in order to bulk update, does not save
    def set_seo_description_keywords(self, save=True):
        description_text = self.generate_description()
        self.seo_description = description_text
        #print(self.seo_description)
        #print(self.seo_keywords)
        if save:
            self.save()

    def set_seo_title(self, save=True):
        self.seo_title = self.generate_title()
        self.save()


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
    content = RichTextField(max_length=10000,null=True, blank=True, help_text="Detailed description")

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

    is_published = models.BooleanField(default=False, help_text="True for RSS publishing, leave it False if you are unsure")
    is_newest = models.BooleanField(default=False, help_text="True for displaying in the latest section")

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
    
    data = JSONField(default=dict, null=True, blank=True)

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



class Topic(SEO, MainPage):
    id = models.IntegerField(primary_key=True)
    is_ordered = models.BooleanField(default=False, help_text="True for ordered movies and synopsis display.(default=False)")

    slug = models.SlugField(max_length=100, null=True, blank=True, unique=True)
    tag = models.OneToOneField("items.Tag", null=True, blank=True, on_delete=models.CASCADE)
    
    name = models.CharField(max_length=400)
    short_name = models.CharField(max_length=50, null=True, blank=True, help_text="This will be used in a situation that requires short name rather than 'The Best ....'")
    summary = models.TextField(max_length=300,null=True, blank=True, help_text="short summary of topic. max: 300 characters")
    content = models.TextField(max_length=10000,null=True, blank=True, help_text="Detailed description")
    html_content = RichTextField(max_length=50000,null=True, blank=True, help_text="Detailed description")
    html_content2 = RichTextField(max_length=10000,null=True, blank=True, help_text="Second part of detailed description")
    show_html_content2 = models.BooleanField(default=True,help_text="For mobile hiding of the text.")

    references = RichTextField(max_length=1000,null=True, blank=True, help_text="References at the bottom of the page")

    wiki = models.URLField(blank=True, null=True)
    
    movies = models.ManyToManyField(Movie,null=True, blank=True, related_name="topics", help_text="Leave blank if is_ordered=True")

    tags = models.ManyToManyField("items.Tag",null=True, blank=True, related_name="topics")
    persons = models.ManyToManyField(Person,null=True, blank=True, related_name="topics")
    quotes = models.ManyToManyField("items.Quote",null=True, blank=True, related_name="topics")

    searchable = models.BooleanField(default=False, help_text="Allows year and rating filtering. " + 
        "If there are many movies, select this.")
    
    is_article = models.BooleanField(default=False,help_text="If the content is rich enough select this.")

    poster = models.ImageField(blank=True, upload_to=topic_image_upload_path)
    cover_poster = models.ImageField(blank=True, upload_to=topic_cover_poster_upload_path)
    hero_poster = models.ImageField(blank=True, upload_to=topic_hero_poster_upload_path)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    is_published = models.BooleanField(default=False, help_text="True for RSS publishing, leave it False if you are unsure")
    is_newest = models.BooleanField(default=False, help_text="True for displaying in the latest section")

    def __str__(self):
        return self.name

    @classmethod
    def create_tag_topic(cls, tag, copy_movies=False):
        last_pk = Topic.objects.all().last().pk
        topic = cls(id=last_pk + 1, name=tag.name, slug=tag.slug, summary=tag.summary, tag=tag)
        topic.save()
        for m in tag.related_movies.all().only("id", "slug"):
            topic.movies.add(m)
        topic.main_page = tag.main_page
        topic.tags.add(tag)
        topic.save()

    def set_richdata(self, save=True):
        from gql.rich_data import RichData
        rdf = RichData.create_topic_data(self)
        self.richdata = rdf
        if save:
            self.save()
    

    def add_slug(self):
        from django.utils.text import slugify
        self.slug = slugify(self.name)
        self.save()

    def pair_tag(self, tag_object):
        if self.tag:
            self.slug = tag_object.slug
            self.main_page = tag_object.main_page
            for m in tag_object.related_movies.all().only("id", "slug"):
                self.movies.add(m)
            self.save()
            

    def save(self, *args, **kwargs):
        if not self.pk or not self.id:
            last_pk = Topic.objects.all().last().pk
            print("last pk id:", last_pk)
            self.id = last_pk + 1
        if not self.slug:
            self.add_slug()
        super().save(*args, **kwargs)  # Call the "real" save() method.


class TopicItem(models.Model):
    movie = models.ForeignKey(Movie, related_name="in_topics", on_delete=models.CASCADE)
    topic = models.ForeignKey(Topic, related_name="items", on_delete=models.CASCADE)
    persons = models.ManyToManyField(Person,null=True, blank=True, related_name="topic_items")
    rank = models.IntegerField(default=100, null=True, blank=True)

    header = models.CharField(max_length=80, null=True, blank=True, help_text="In case of different text, use this as header")
    html_content = RichTextField(max_length=10000,null=True, blank=True, help_text="Detailed description")

    cover_poster = models.ImageField(blank=True, null=True, upload_to=topic_item_cover_poster_path)
    poster = models.ImageField(blank=True, null=True, upload_to=topic_item_poster_path)

    references = RichTextField(max_length=1000,null=True, blank=True, help_text="References at the bottom of the page")

    created_at = models.DateTimeField(auto_now_add=True, null=True, blank=True)
    updated_at = models.DateTimeField(auto_now=True, null=True, blank=True)


    def __str__(self):
        return self.movie.name

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

class Tag( SEO, MainPage):
    
    name = models.CharField(max_length=400)
    summary = models.TextField(max_length=5000,null=True, blank=True)
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
    topic_tag = models.BooleanField(default=False)



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
    class Meta:
        ordering = ["name"]
        
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


AWARD_TYPE = (
    ("best_picture", "Best Picture"),
    ("best_director", "Best Director"),
    ("best_actor", "Best Actor"),
    ("best_actress", "Best Actress"),
    ("supporting_actor", "Best Actor in Supporting Role"),
    ("supporting_actress", "Best Actress in Supporting Role"),
    ("best_cinematography", "Best Cinematography"),
    ("best_animated", "Best Animated Feature Film"),
    ("best_international", "Best International Film"),
    ("best_visual_effects", "Best International Film"),
    ("best_original_song", "Best International Film"),
    ("best_adapted_screenplay", "Best Adapted Screenplay"),
    ("best_original_screenplay", "Best Original Screenplay"),
    ("golden_palm", "Cannes Film Festival - Golden Palm"),
    ("golden_bear", "Berlin Film Festival - Golden Bear"),
    ("golden_lion", "Venice Film Festival - Golden Lion"),
)

class Award(models.Model):
    award = models.CharField(max_length=25, choices=AWARD_TYPE, null=True)
    year = models.IntegerField()

    #best person and nominees
    person = models.ForeignKey(Person, null=True, blank=True, related_name="awards", on_delete=models.CASCADE)
    persons = models.ManyToManyField(Person, null=True, blank=True, related_name="awards_nominee")

    #best movie and nominees
    movie = models.ForeignKey(Movie, related_name="awards", on_delete=models.CASCADE, help_text="winner of the award's movie.")
    movies = models.ManyToManyField(Movie,null=True, blank=True,  related_name="awards_nominee", help_text="Nominees. If the award is personal set movies that the person play in.")

    note = models.TextField(max_length=500,null=True, blank=True)

    def __str__(self):
        return f"{self.year} - {self.award}"


class Quote(models.Model):
    id = models.IntegerField(primary_key=True)
    text = models.TextField(max_length=2000)

    owner_name = models.TextField(max_length=100, null=True, blank=True)

    #person who said that
    person = models.ForeignKey(Person, null=True, blank=True, related_name="quotes", on_delete=models.CASCADE)
    
    #movie that includes the quote
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

