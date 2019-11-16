from django.db import models
from tqdm import tqdm
from django_mysql.models import JSONField

#from django_bulk_update.helper import bulk_update
from django.db.models import Q

class SocialMedia(models.Model):
    homepage = models.URLField(blank=True, null=True)
    wiki = models.URLField(blank=True, null=True)
    facebook = models.URLField(blank=True, null=True)
    twitter = models.URLField(blank=True, null=True)
    instagram = models.URLField(blank=True, null=True)
    imdb = models.URLField(blank=True, null=True)

    class Meta:
        abstract = True

class SEO(models.Model):
    seo_title = models.CharField(max_length=100,null=True, blank=True) #dont exceed 60chars
    seo_short_description =  models.TextField(max_length=500,null=True, blank=True)
    seo_description = models.TextField(max_length=160,null=True, blank=True, help_text="160 character limit") #dont exceed 160 chars
    seo_keywords = models.TextField(max_length=2000,null=True, blank=True)
    richdata = JSONField(default=dict, null=True, blank=True)

    class Meta:
        abstract = True

class DateRecords(models.Model):
    created_at = models.DateTimeField(auto_now_add=True, null=True, blank = True)
    updated_at = models.DateTimeField(auto_now=True, null=True, blank = True)
    class Meta:
        abstract = True

class MainPage(models.Model):
    main_page = models.BooleanField(default=False, help_text="Selected item will be showed on welcome screen")
    class Meta:
        abstract = True


def update(start, end):
    qs = Movie.objects.filter(seo_title__isnull=True).only("id","name", "seo_title").order_by("id")
    print("current work quantity: ", qs.count())
    targets = qs[start: end]
    for obj in tqdm(targets):
        obj.seo_title = f"{obj.name} - Pixly"
        #print(obj.name)
        #print(f"{obj.name} - Pixly")
    print("start updating")
    bulk_update(targets, update_fields=["seo_title"])




def set_movie_title(movie):
    movie.seo_title = f"{movie.name} ({movie.year}) - Pixly"

def update_movie_title(start, end):
    mqs = Movie.objects.all().only("seo_title", "id", "name", "year").order_by("id")
    mq = mqs[ start: end]
    for m in tqdm(mq):
        m.seo_title = f"{m.name} ({m.year}) - Pixly"
    print("start updating")
    bulk_update(mq, update_fields=["seo_title"])



def get_person_seo_description(person):
    from items.models import Tag
    final_text = ""
    words = []
    cqs = Crew.objects.filter(person=person)
    if cqs.filter(job="d").count() > 0 and cqs.filter(job="a").count() > 0:
        words.append(f"{person.name}'s filmography; acted movies and  movies that are directed by {person.name} ")
    elif cqs.filter(job="d").count() > 0 and  cqs.filter(job="a").count() == 0:
        words.append("movies that are directed by {person.name}")
    elif cqs.filter(job="d").count() == 0 and cqs.filter(job="a").count() > 0:
        words.append(f"{person.name}'s acted movies")
    if person.related_lists.filter(list_type="df").count() > 0:
        words.append(f"favourite movie lists of the director")
    if person.facebook or person.twitter or person.instagram:
        words.append("social media accounts.")
    final_text = " ,".join(words)
    #check video content   f"Various stuff about {person.name} like; " 
    pvqs = person.videos.filter(tags__isnull=False)
    if pvqs.count() > 0:
        video_words = []
        video_tags = Tag.objects.filter(related_videos__in=pvqs).values_list("slug", flat=True)
        if "conversation" in video_tags:
            video_words.append(f"coversation")
        if "interview" in video_tags:
            video_words.append(f"interview")
        if "film-review" in video_tags:
            video_words.append(f"film review")
        if "video-essay" in video_tags:
            video_words.append(f"video essay")
        if len(video_words) > 0:
            if len(video_words) >1 :
                video_partial_text = " ,".join(video_words[:-1]).capitalize() + " and " + video_words[-1]
            final_text = final_text + " " + video_partial_text + f" about {person.name}"
    #check characters
    if len(final_text)< 140:
        if person.directed.count() > person.played.count():
            directeds = [x.movie.name for x in person.directed[:3]]
            directed_text = f" Films directed by {person.name} are " + ", ".join(directeds) + "..."
            final_text = final_text + directed_text
            return final_text
        else:
            acteds = [x.movie.name for x in person.directed[:3]]
            acted_text = f"Movies that {person.name} was played on are " + ", ".join(acteds) + "..."
            final_text = final_text + acted_text
            return final_text
    return final_text

#dl = Person.objects.get(id="nm0000186")
#set_person_description(dl)










def imdb_link(imdb_id):
    return f"https://www.imdb.com/title/{imdb_id}"

def imdb_person_link(imdb_id):
    return f"https://www.imdb.com/name/{imdb_id}"


def twitter_link(name):
    return f"https://www.twitter.com/{name}"

def instagram_link(name):
    return f"https://www.instagram.com/{name}"

def facebook_link(name):
    return f"https://www.facebook.com/{name}"




def update_social(obj):
        obj_data = obj.data
        socials = obj_data.get("external_ids")
        if socials:
            if socials.get("homepage")!=None and len(socials.get("homepage")) > 3:
                print("homepage",socials.get("homepage"))
                obj.homepage = socials.get("homepage")
            if socials.get("twitter_id")!=None and len(socials.get("twitter_id")) > 3:
                tw_id = socials.get("twitter_id")
                print("twitter_id",tw_id)
                obj.twitter = twitter_link(tw_id)
            if socials.get("facebook_id")!=None and len(socials.get("facebook_id")) > 3:
                fb_id = socials.get("facebook_id")
                print("facebook_id",fb_id)
                obj.facebook = facebook_link(fb_id)
            if socials.get("instagram_id")!=None and len(socials.get("instagram_id")) > 3:
                insta_id = socials.get("instagram_id")
                print("instagram_id",insta_id)
                obj.instagram = instagram_link(insta_id)
            return True
        else:
            print("No external ids: ", obj.name)
            if obj_data.get("homepage")!=None and len(obj_data.get("homepage")) > 3:
                print("homepage",obj_data.get("homepage"))
                obj.homepage = obj_data.get("homepage")
            if obj_data.get("twitter_id")!=None and len(obj_data.get("twitter_id")) > 3:
                tw_id = obj_data.get("twitter_id")
                print("twitter_id",tw_id)
                obj.twitter = twitter_link(tw_id)
            if obj_data.get("facebook_id")!=None and len(obj_data.get("facebook_id")) > 3:
                fb_id = obj_data.get("facebook_id")
                print("facebook_id",fb_id)
                obj.facebook = facebook_link(fb_id)
            if obj_data.get("instagram_id")!=None and len(obj_data.get("instagram_id")) > 3:
                insta_id = obj_data.get("instagram_id")
                print("instagram_id",insta_id)
                obj.instagram = instagram_link(insta_id)
            return True


def update_person_social(start, end):
    query = Q( Q(data__has_key="facebook_id") |  Q(data__has_key="twitter_id") |  Q(data__has_key="instagram_id") | Q(data__has_key="homepage"))
    allp_qs = Person.objects.filter(data__has_key="external_ids").only("id","tmdb_id", "data").order_by("tmdb_id")
    print("Current  elements: ", allp_qs.count())
    allp = allp_qs[start: end]
    for m in allp:
        is_updated = update_social(m)
    print("start updating")
    bulk_update(allp, update_fields=["homepage", "facebook", "instagram", "twitter"])


def update_person_fb_social(start, end):
    query = Q( Q(data__has_key="facebook_id") | Q(data__has_key="external_ids") & Q(facebook__isnull=True))
    allp_qs = Person.objects.filter(query).only("id","tmdb_id", "data", "facebook").order_by("tmdb_id")
    print("Current  elements: ", allp_qs.count())
    allp = allp_qs[start: end]
    for m in allp:
        is_updated = update_social(m)
    print("start updating")
    bulk_update(allp, update_fields=["facebook"])

def update_person_tw_social(start, end):
    query = Q( Q(data__has_key="twitter_id") | Q(data__has_key="external_ids"))
    allp_qs = Person.objects.filter(query).only("id","tmdb_id", "data", "twitter").order_by("tmdb_id")
    print("Current  elements: ", allp_qs.count())
    allp = allp_qs[start: end]
    for m in allp:
        is_updated = update_social(m)
    print("start updating")
    bulk_update(allp, update_fields=["twitter"])






def movie_update(start, end):
    allm_qs = Movie.objects.only("id","tmdb_id", "data").order_by("id")
    print("Current  elements: ", allm_qs.count())
    allm = allm_qs[start: end]
    for m in allm:
        is_updated = update_social(m)
        #in case of none homepage check existed omdb-data-Website
        if m.homepage==None or m.homepage=="":
            if m.data.get("Website")!=None and len(m.data.get("Website")) > 3:
                print("Website",m.data.get("Website"))
                m.homepage = m.data.get("Website")
    print("start updating")
    bulk_update(allm, update_fields=["homepage", "facebook", "instagram", "twitter"])


def movie_update_homepage(start, end):
    allm_qs = Movie.objects.filter(data__external_ids__isnull=True, homepage__isnull=True).only("id","tmdb_id", "data", "homepage").order_by("id")
    print("Current  elements: ", allm_qs.count())
    allm = allm_qs[start: end]
    for m in allm:
        if m.data.get("Website")!=None and len(m.data.get("Website")) > 3:
            print("Website",m.data.get("Website"))
            m.homepage = m.data.get("Website")
    print("start updating")
    bulk_update(allm, update_fields=["homepage"])
