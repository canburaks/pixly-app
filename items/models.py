from django.db import models
from persons.abstract import SocialMedia, SEO, DateRecords, MainPage, RichMedia
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

# Define upload paths for various media types

def item_image_upload_path(instance, filename):
    """Generate file path for item images."""
    return "posters/{0}/{1}".format(instance.movie.id,filename)


def movie_poster_upload_path(instance, filename):
    """Generate file path for movie posters."""
    return "posters/{0}/{1}".format(instance.id,filename)


def movie_large_poster_upload_path(instance, filename):
    """Generate file path for large movie posters."""
    return "posters/{0}/large-{1}".format(instance.id,filename)


def movie_cover_poster_upload_path(instance, filename):
    """Generate file path for movie cover posters."""
    return "posters/{0}/cover/{1}".format(instance.id,filename)


def movie_topic_poster_upload_path(instance, filename):
    """Generate file path for movie topic posters."""
    return "posters/{0}/topic-poster/{1}".format(instance.id,filename)


def topic_image_upload_path(instance, filename):
    """Generate file path for topic images."""
    return "topics/{0}/{1}".format(instance.name, filename)


def topic_cover_poster_upload_path(instance, filename):
    """Generate file path for topic cover posters."""
    return "topics/{0}/cover/{1}".format(instance.id,filename)
    

def topic_hero_poster_upload_path(instance, filename):
    """Generate file path for topic hero posters."""
    return "topics/{0}/hero/{1}".format(instance.id,filename)


def tag_image_upload_path(instance, filename):
    """Generate file path for tag images."""
    return "tags/{0}/{1}".format(instance.name, filename)


def list_image_upload_path(instance, filename):
    """Generate file path for list images."""
    return "lists/{0}/{1}".format(instance.id, filename)


def list_cover_image_upload_path(instance, filename):
    """Generate file path for list cover images."""
    return "lists/{0}/cover/{1}".format(instance.id, filename)


def list_large_cover_image_upload_path(instance, filename):
    """Generate file path for large list cover images."""
    return "lists/{0}/large_cover/{1}".format(instance.id, filename)


def video_image_upload_path(instance, filename):
    """Generate file path for video images."""
    return "videos/{0}/{1}".format(instance.id, filename)


def topic_item_cover_poster_path(instance, filename):
    """Generate file path for topic item cover posters."""
    return "topics/{0}/items/cover/{1}".format(instance.id,filename)


def topic_item_poster_path(instance, filename):
    """Generate file path for topic item posters."""
    return "topics/{0}/items/poster/{1}".format(instance.id,filename)
    

def movie_group_poster_path(instance, filename):
    """Generate file path for movie group posters."""
    return "movie-group/{0}/items/poster/{1}".format(instance.slug,filename)


def movie_group_cover_path(instance, filename):
    """Generate file path for movie group cover posters."""
    return "movie-group/{0}/items/cover/{1}".format(instance.slug,filename)


def tag_group_poster_path(instance, filename):
    """Generate file path for tag group posters."""
    return "tag-group/{0}/items/poster/{1}".format(instance.slug,filename)


def tag_group_cover_path(instance, filename):
    """Generate file path for tag group cover posters."""
    return "tag-group/{0}/items/cover/{1}".format(instance.slug,filename)


LIST_RELATION_TYPE = (
    ('df', "Director's Favourite"),
    ("fw", "Festival Winner Movies"),
    ("gr", "Genre Related"),
    ("ms", "Miscellaneous"),
    ("mm", "Movies of the Month"),
    ("my", "Movies of the Year")
)


class Movie(SocialMedia, SEO, RichMedia, MainPage):
    """Represents a movie in the database."""
    id = models.IntegerField(primary_key=True)
    imdb_id = models.CharField(max_length=9, null=True)
    tmdb_id = models.IntegerField(null=True)
    active = models.BooleanField(default=False)

    name = models.CharField(max_length=100)
    header = models.CharField(max_length=150, null=True, blank=True)

    year = models.IntegerField(null=True)
    release = models.DateField(null=True, blank=True)
    summary = models.TextField(max_length=3000,null=True)
    content_similars_summary = models.TextField(max_length=1000,null=True, blank=True)
    html_content = RichTextField(max_length=10000,null=True, blank=True, help_text="For Feature Movies that will show on Topic Page.")
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

    cast_summary = RichTextField(max_length=20000,null=True, blank=True, help_text="Cast summary")
    free_watch_link = models.URLField(null=True, blank=True, help_text="if a movie can be watch freely, give the address")

    class Meta:
        ordering = ["-year"]

    def __str__(self):
        return self.name

    @classmethod
    def common_content_tags_of_movies(cls,movie_1, movie_2):
        """Return common content tags between two movies."""
        Q_TAG = Q(genre_tag=False) & (Q(subgenre_tag=True) | Q(theme_tag=True) | Q(character_tag=True) | Q(base_tag=True) | Q(phenomenal_tag=True))
        tags_1 = movie_1.tags.filter(Q_TAG).values_list("name", flat=True)
        tags_2 = movie_2.tags.filter(Q_TAG).values_list("name", flat=True)
        return set(tags_1).intersection(set(tags_2))
    
    def common_content_tags(self, movie_2):
        """Return common content tags between this movie and another movie."""
        Q_TAG = (Q(subgenre_tag=True) | Q(theme_tag=True) | Q(character_tag=True) | Q(base_tag=True) | Q(phenomenal_tag=True))
        tags_1 = self.tags.filter(Q_TAG).values_list("name", flat=True)
        tags_2 = movie_2.tags.filter(Q_TAG).values_list("name", flat=True)
        return set(tags_1).intersection(set(tags_2))

    def common_nongenre_tags(self, movie_2):
        """Return common non-genre tags between this movie and another movie."""
        return list(set(self.nongenre_tag_names).intersection(set(movie_2.nongenre_tag_names)))
        
    def common_tags(self, movie_2):
        """Return common tags between this movie and another movie."""
        return list(set(self.tag_names).intersection(set(movie_2.tag_names)))
    #-------------CONTENT SIMILARS------------------------
    @property
    def cso(self):
        """Return the content similarity object for this movie."""
        if self.content_similar_object.exists():
            return self.content_similar_object.first()
        return None

    @property
    def cso_similars(self):
        """Return the similar movies based on content similarity."""
        if self.cso:
            return self.cso.similars.all().only(
                "id", "slug", "name", "year", "poster",
                "cover_poster", "imdb_rating",
                ).prefetch_related("tags")
        return []
    
    @property
    def cso_similars_of(self):
        """Return the similar movies based on content similarity."""
        if self.cso:
            return self.cso.similars.all().only(
                "id", "slug", "name", "year", "poster",
                "cover_poster", "imdb_rating",
                ).prefetch_related("tags")
        return []

    def cso_add(self, movie):
        """Add a movie as a content similar to this movie."""
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
        """Remove a movie from the content similarity of this movie."""
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
        """Return the names of the genres associated with this movie."""
        return self.tags.filter(genre_tag=True).values_list("slug", flat=True)
    
    @property
    def tag_names(self):
        """Return the names of all tags associated with this movie."""
        return self.tags.all().values_list("slug", flat=True)

    @property
    def nongenre_tag_names(self, include_mix_tags=True):
        """Return the names of non-genre tags associated with this movie."""
        if include_mix_tags:
            mix_tags = self.tags.filter(genre_tag=True, theme_tag=True).values_list("slug", flat=True)
            nongenres =  set(self.tag_names).difference(self.genre_names)
            return list(set(mix_tags).union(nongenres))
        return list(set(self.tag_names).difference(self.genre_names))


    @property
    def video_tags(self):
        """Return the tags associated with the videos of this movie."""
        return self.videos.values_list("tags__slug", flat=True)

    @property
    def have_trailer(self):
        """Check if this movie has a trailer."""
        return "trailer" in self.video_tags

    @property
    def have_content_similars(self):
        """Check if this movie has content similar movies."""
        try:
            return self.content_similar_object.all()[0].similars.all().exists()
        except:
            return False
    
    @property
    def have_similars(self):
        """Check if this movie has similar movies."""
        from archive.models import MovSim
        return MovSim.objects.filter(
                base_id=self.id, pearson__gte=0.35,commons__gte=200 ).count()>0
    

    @property
    def have_director(self):
        """Check if this movie has a director."""
        return Crew.objects.filter(movie=self, job__in="d" \
            ).exclude(person__poster__exact='').exists()

    @property
    def director_names(self):
        """Return the names of the directors of this movie."""
        return Crew.objects.filter(movie=self, job="d"
            ).values_list("person__name", flat=True)

    @property
    def have_crew(self):
        """Check if this movie has a crew (more than 3 actors)."""
        return Crew.objects.filter(movie=self, job__in="a" \
            ).exclude(person__poster__exact='').count() > 3

    @property
    def get_content_similar_object(self):
        """Return the content similarity object for this movie."""
        return self.content_similar_object.all()[0]
    
    def __old_get_similar_ids(self):
        """Return the IDs of similar movies (old method)."""
        from archive.models import MovSim
        return MovSim.objects.filter(base_id=self.id, pearson__gte=0.3, 
            commons__gte=200).values_list("target_id", flat=True)

    def get_similar_ids(self, min_similarity=0.25):
        """Return the IDs of similar movies."""
        from archive.models import MovSim
        Q_SIM = Q(commons__gte=200) & (Q(pearson__gte=min_similarity) | Q(acs__gte=min_similarity)) 
        return MovSim.objects.filter(Q_SIM, base_id=self.id
                ).order_by("pearson").values_list("target_id", flat=True)

    def get_short_summary(self):
        """Return a short summary of the movie."""
        if len(self.summary) < 200:
            return self.summary
        else:
            plot = self.data.get("plot") if self.data.get("plot") else self.data.get("Plot")
            if plot != None and len(plot)<300:
                return plot
            else:
                return self.summary[:200] + "..."
2025


    def set_summary_from_omdb(self):
        """Set the summary of the movie from OMDB data."""
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
        """Set rich data for the movie."""
        from gql.rich_data import RichData
        rdf = RichData.create_movie_data(self)
        if len(rdf.keys()) > 3:
            self.richdata = rdf
        if save:
            self.save()
    


    def add_slug(self):
        """Add a slug for the movie."""
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
        """Return fields for autocomplete search."""
        return ("id__iexact", "name__icontains",)

    @property
    def archive(self):
        """Return the archive object for this movie."""
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
        """Return a short name for the movie."""
        if len(self.name)>10:
            return "{}...".format(self.name[:10])
        else:
            return self.name

    def get_absolute_url(self):
        """Return the URL for this movie."""
        return reverse('movie-detail', args=[str(self.id)])
        
    @property
    def image(self):
        """Return the URL of the movie poster."""
        return self.poster.url

    def setOmdbInfo(self, force=False):
        """Set OMDB info for the movie."""
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
            """Set TMDB info for the movie."""
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
        """Get cast and crew info for the movie."""
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
        """Return the TMDB object for this movie."""
        from gql.tmdb_class import Movie as TM
        if self.tmdb_id:
            return TM(self.tmdb_id)

    @property
    def tmdb_object(self):
        """Return the TMDB movie object for this movie."""
        from archive.models import TmdbMovie
        qs = TmdbMovie.objects.filter(tmdb_id=self.tmdb_id)
        if qs.exists():
            return qs[0]
        return None

    def set_imdb_rating_and_votes(self):
        """Set IMDb rating and votes for the movie."""
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
        """Update the cover poster for the movie."""
        from pixly.lib import url_image
        cover_url = self.tmdb.poster_links().get("tmdb_cover_path")
        if cover_url:
            filename = "{}-cover.jpg".format(self.id)
            self.cover_poster.save(*url_image(cover_url, filename))
            print("cover saved")
        else:
            print("cover url could not found")


    def create_or_update_tmdb_movie(self):
        """Create or update the TMDB movie object for this movie."""
        from archive.models import TmdbMovie
        tmovie, created = TmdbMovie.objects.update_or_create(movielens_id=self.id, tmdb_id=self.tmdb_id, registered=True)
        tmovie.save_data()

    def update_from_tmdb_movie(self):
        """Update this movie from the TMDB movie object."""
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
        """Update social media info for the movie."""
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
        """Update content similar movies for the movie."""
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
        """Update tags for the movie based on TMDB data."""
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
        """Perform a full update of the movie."""
        self.update_from_tmdb_movie()
        #print("1")
        self.set_seo_title()
        self.set_seo_description_keywords()
        self.save()
        self.update_tags_from_data_keywords()
        #print("2")
        self.set_richdata()

    def generate_description(self):
        """Generate a description for the movie."""
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
            sim_text = f"See similar movies like {self.name} ({self.year}), cast, plot and the trailer." 
            sim_text_num = len(sim_text)
            current_num = len(text)
            available_num = 150 - (current_num + sim_text_num)
            #text += f" {self.summary[:available_num]}.."
            text = text + f" {self.summary[:available_num]}..." + sim_text
        print(f"description length: {len(text)}")
        return text

    def generate_title(self):
        """Generate a title for the movie."""
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
        """Set SEO description and keywords for the movie."""
        description_text = self.generate_description()
        self.seo_description = description_text
        #print(self.seo_description)
        #print(self.seo_keywords)
        if save:
            self.save()

    def set_seo_title(self, save=True):
        """Set SEO title for the movie."""
        self.seo_title = self.generate_title()
        self.save()


    def save(self, *args, **kwargs):
        """Save the movie."""
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

POSTER_TYPE = (
    ("c", "Cover (Horizontal) Image"),
    ('p', "Vertical Poster"),
)
class MovieGroup(SEO, MainPage):
    """Represents a group of movies."""
    slug = models.SlugField(db_index=True, max_length=50 )
    header = models.CharField(max_length=80, null=True, blank=True, help_text="Name")
    have_page = models.BooleanField(default=False, help_text="if yes, group treated like list or topic and have unique url")


    cover_poster = models.ImageField(blank=True, null=True, upload_to=movie_group_cover_path, help_text="600x338px")
    poster = models.ImageField(blank=True, null=True, upload_to=movie_group_poster_path)
    poster_type = models.CharField(default="cover", max_length=1, choices=POSTER_TYPE)
    topics = models.ManyToManyField("items.Topic", related_name="groups",null=True, blank=True )

    html_content = RichTextField(max_length=10000,null=True, blank=True,
                help_text = "Description for all the movies and topic. In movie page, " +
                            "movie group item's description will be used not this.")

    created_at = models.DateTimeField(auto_now_add=True, null=True, blank=True)
    updated_at = models.DateTimeField(auto_now=True, null=True, blank=True)


    def __str__(self):
        return self.slug


class MovieGroupItem(models.Model):
    """Represents an item in a movie group."""
    movie = models.ForeignKey(Movie, related_name="group_items", on_delete=models.CASCADE)
    group = models.ForeignKey(MovieGroup, related_name="items", on_delete=models.CASCADE)

    header = models.CharField(max_length=80, null=True, blank=True, help_text="Unque name, in case of attractive header")
    html_content = RichTextField(max_length=10000,null=True, blank=True, 
                help_text = "Detailed description of the item. Use similar bu unique " + 
                            "description for each item in the group")

    def __str__(self):
        return self.movie.name



