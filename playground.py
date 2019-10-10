from tqdm import tqdm
import json
from django_bulk_update.helper import bulk_update
from django.utils.text import slugify
from collections import Counter

from pprint import pprint
#c = vid.youtube_object.get_caption_data()
cbs = Profile.objects.get(id=1)
cs = cbs.get_statistics_object(force=True)
mat = Movie.objects.get(id=2571)
mat2 = Movie.objects.get(id=6365)
hol = Movie.objects.get(slug="once-upon-a-time-in-hollywood-2019")
tr = Movie.objects.get(id=91947)
tt = Tag.objects.get(tmdb_id=11192)

vid = Video.objects.get(youtube_id="W9Cu7Otn9Io")


vall = Video.objects.all()
#from gql.youtube_client import Youtube
#cc = Youtube.get_caption('5dZDZmteNc8yNUkByhMIn-TqKrOTJzJyYZBtQQAk2kM=')


#TAG NEW UPDATE
from tqdm import tqdm
from django_bulk_update.helper import bulk_update

tall = Tag.objects.filter(object_type="video")
for t in tqdm(tall):
    t.video_tag = True

bulk_update(tall, update_fields=["video_tag"])


#REGULAR PROGRESSIVE NOT DONE JOBS

def update_person_seo(start, end):
    allm_qs = Person.objects.all().only(
        "id","tmdb_id", "work_quantity", "seo_description", "seo_keywords"
        ).order_by("-tmdb_id")
    print("Current  elements: ", allm_qs.count())
    allm = allm_qs[start: end]
    for m in tqdm(allm):
        m.set_seo_description_keywords(save=False)
    print("start updating")
    bulk_update(allm, update_fields=["seo_description", "seo_keywords"])


# tag related movies update -> 476
def update_tags_from_tmdb(start, end):
    from tqdm import tqdm
    qs = Tag.objects.exclude(tmdb_id__isnull=True, tmdb_id_2__isnull=True).order_by("pk")
    print("current qs number: ", qs.count())
    tag_qs = qs[ start: end]
    for t in tqdm(tag_qs):
        t.update_tmdb_movies()


#update persons last_done:full done
def update_persons_from_tmdb(start, end):
    from tqdm import tqdm
    allp = Person.objects.order_by("tmdb_id")[ start: end]
    for p in tqdm(allp):
        p.update_from_tmdb()



#update movies last_done:29000
def update_movies_from_tmdb(start, end):
    from tqdm import tqdm
    allp = Movie.objects.filter(tmdb_id__isnull=False).order_by("id")[start : end]
    for p in tqdm(allp):
        try:
            p.update_from_tmdb_movie()
        except:
            continue


#----------------------------------------



def create_keyword_pool(start, end):
    from tqdm import tqdm
    pool = {}
    mqs = Movie.objects.filter(data__has_key="keywords").only("data", "id").order_by("id")[ start : end ]
    for m in tqdm(mqs):
        kws = m.data.get("keywords")
        if kws and len(kws)>0:
            for kw in kws:
                pool[kw.get("id")] = kw.get("name")
    return pool

p = create_keyword_pool(0,20000)
tk = Tag.objects.filter(tmdb_id__isnull=False).values_list("tmdb_id", flat=True)
tk2 = Tag.objects.filter(tmdb_id_2__isnull=False).values_list("tmdb_id_2", flat=True)
for t in tk:
    del p[t]





def tag_tmdb(p, start, stop):
    tqs = Tag.objects.filter(tmdb_id__isnull=True).all()
    print(f"p:{len(p)} - non_tmdb_tags: {tqs.count()}")
    paired = []
    for k in tqdm(list(p.keys())[start: stop]):
        val = p.get(k)
        if Tag.objects.filter(name__iexact=val).exists():
            tag = Tag.objects.filter(name__iexact=val).first()
            tag.tmdb_id = k
            paired.append(tag)
    bulk_update(paired, update_fields=["tmdb_id"])

tag_tmdb(p, 1500,5000 )


def update_movies_tmdb(start, end):
    from tqdm import tqdm
    content_qs = ContentSimilarity.objects.all().values_list("movie__id", flat=True)
    allm_qs = Movie.objects.filter(active=True).only("id", "imdb_id", "imdb").exclude(
            id__in = content_qs, data__has_key="keywords").order_by("id")
    print("Current  elements: ", allm_qs.count())
    allm = allm_qs[start: end]
    for m in tqdm(allm):
        try:
            m.update_from_tmdb_movie()
        except:
            continue

def update_video_dates(start, end):
    allm_qs = Video.objects.all().defer("related_persons", "related_movies").order_by("id")
    print("Current  elements: ", allm_qs.count())
    allm = allm_qs[start: end]
    for m in tqdm(allm):
        m.created_at = 
    print("start updating: ")
    bulk_update(allm, update_fields=["richdata"])

def update_movie_rdf_template(start, end):
    allm_qs = Movie.objects.all().exclude(richdata__has_key="@context").order_by("-imdb_rating")
    print("Current  elements: ", allm_qs.count())
    allm = allm_qs[start: end]
    for m in tqdm(allm):
        m.set_richdata(save=False)
    print("start updating: ")
    bulk_update(allm, update_fields=["richdata"])

for i in range(0,20):
    q = (i+1)*100
    update_movie_rdf_template(0, q)
    print(f"{q} done")

def reset_richdata(start, end):
    qs = Movie.objects.filter(richdata__isnull=True)
    #qs = Movie.objects.filter(richdata__has_key="@context")
    print("initial: ", qs.count())
    mqs = qs[start: end]
    for m in mqs:
        m.richdata = {}
    bulk_update(mqs, update_fields=["richdata"])


def update_movie_short_description(start, end):
    from tqdm import tqdm
    import json
    from django_bulk_update.helper import bulk_update
    allm_qs = Movie.objects.all().only(
                "id", "imdb_id", "seo_short_description", "data", "summary").order_by("id")
    print("Current  elements: ", allm_qs.count())
    allm = allm_qs[start: end]
    for m in tqdm(allm):
        plot = m.data.get("Plot")
        if m.summary and len(m.summary)<300:
            m.seo_short_description = m.summary
        elif plot and len(plot)<300:
            m.seo_short_description = plot
        elif m.summary and len(m.summary) > 300:
            m.seo_short_description = m.summary[:250] + "..."
    print("start updating: ")
    bulk_update(allm, update_fields=["seo_short_description"])



def update_list_seo(start, end):
    allm_qs = List.objects.all().only(
        "id", "name","list_type","seo_description", "seo_keywords"
        ).order_by("id")
    print("Current  elements: ", allm_qs.count())
    allm = allm_qs[start: end]
    for m in tqdm(allm):
        m.set_seo_description_keywords(False)
    print("start updating")
    bulk_update(allm, update_fields=["seo_description", "seo_keywords"])


def update_person_seo(start, end):
    allm_qs = Person.objects.all().only(
        "id","tmdb_id", "work_quantity", "seo_description", "seo_keywords"
        ).order_by("-work_quantity")
    print("Current  elements: ", allm_qs.count())
    allm = allm_qs[start: end]
    for m in tqdm(allm):
        m.set_seo_description_keywords(save=False)
    print("start updating")
    bulk_update(allm, update_fields=["seo_description", "seo_keywords"])

def update_work_quantity(start, end):
    allm_qs = Person.objects.filter(work_quantity__isnull=True).only("id","tmdb_id", "work_quantity").order_by("tmdb_id")
    print("Current  elements: ", allm_qs.count())
    allm = allm_qs[start: end]
    crew_qs = Crew.objects.all().select_related("person").defer("movie", "data", "job", "character")
    for m in tqdm(allm):
        m.work_quantity = crew_qs.filter(person=m).count()
    print("start updating")
    bulk_update(allm, update_fields=["work_quantity"])


trailer_tag = Tag.objects.filter(slug="trailer").only("name", "slug", "related_videos")[0]
int_tag = Tag.objects.filter(slug="interview").only("name", "slug", "related_videos")[0]
vc_tag = Tag.objects.filter(slug="video-clip").only("name", "slug", "related_videos")[0]
ve_tag = Tag.objects.filter(slug="video-essay").only("name", "slug", "related_videos")[0]
freview_tag = Tag.objects.filter(slug="film-review").only("name", "slug", "related_videos")[0]
fcritic_tag = Tag.objects.filter(slug="film-critic").only("name", "slug", "related_videos")[0]
bts_tag = Tag.objects.filter(slug="behind-the-scene").only("name", "slug", "related_videos")[0]
conv_tag = Tag.objects.filter(slug="conversation").only("name", "slug", "related_videos")[0]
featurette_tag = Tag.objects.filter(slug="featurette").only("name", "slug", "related_videos")[0]

def update_tag_videos(start, end, keywords, tag_object):
    for kv in keywords:
        vqs = Video.objects.filter(tagss__contains=kv).only("id", "tagss").defer("related_movies", "related_persons").order_by("id")
        print("Current  elements: ", vqs.count())
        if vqs.count() >0:
            sliced = vqs[start: end]
            tag_object.related_videos.add(*vqs)
    tag_object.save()



# BULK UPDATE
allm = Movie.objects.filter(slug__isnull=True, active=True).order_by("imdb_votes").only("id", "name", "year", "imdb_votes")

for m in allm:
    convert = f"{m.name} {m.year}"
    m.slug = slugify(convert)

bulk_update(allm, update_fields=["slug"])

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
            obj.twitter = twitter_link(fb_id)

        if socials.get("twitter_id")!=None and len(socials.get("twitter_id")) > 3:
            tw_id = socials.get("twitter_id")
            print("twitter_id",tw_id)
            obj.twitter = facebook_link(tw_id)

def update_person_social(start, end):
    allm_qs = Person.objects.only("id","tmdb_id", "imdb", "data").order_by("tmdb_id")
    print("Current  elements: ", allm_qs.count())
    allm = allm_qs[start: end]
    for m in allm:
        person_data = m.data
        ext_ids = person_data.get("external_ids")

        link = imdb_person_link(m.id)
        m.imdb = link
    print("start updating")
    bulk_update(allm, update_fields=["imdb"])


def update_person_imdb(start, end):
    allm_qs = Person.objects.filter( active=True).only("id","tmdb_id", "imdb", "data").order_by("tmdb_id")
    print("Current  elements: ", allm_qs.count())
    allm = allm_qs[start: end]
    for m in allm:
        link = imdb_person_link(m.id)
        m.imdb = link
    print("start updating")
    bulk_update(allm, update_fields=["imdb"])



def update_imdb(start, end):
    allm_qs = Movie.objects.filter(imdb_id__isnull=False, imdb__isnull=True).only("id", "imdb_id", "imdb").order_by("id")
    print("Current  elements: ", allm_qs.count())
    allm = allm_qs[start: end]
    for m in allm:
        link = imdb_link(m.imdb_id)
        m.imdb = link
    print("start updating")
    bulk_update(allm, update_fields=["imdb"])


def update_person_imdb(start, end):
    allm_qs = Person.objects.filter(imdb__isnull=True).only("id","tmdb_id", "imdb").order_by("tmdb_id")
    print("Current  elements: ", allm_qs.count())
    allm = allm_qs[start: end]
    for m in allm:
        link = imdb_person_link(m.id)
        m.imdb = link
    print("start updating")
    bulk_update(allm, update_fields=["imdb"])



def update_slug(start, end):
    allm = Movie.objects.filter(slug__isnull=True).only("id", "name", "year","tmdb_id").order_by("id")
    print("Current non-slug elements: ", allm.count())
    mqs = allm[start: end]
    for m in tqdm(mqs):
        if Movie.objects.filter(name=m.name, year=m.year).count()>1:
            text =  f"{m.name} {m.tmdb_id} {m.year}"
            moderate_slug = slugify(text)
            m.slug = moderate_slug
        else:
            text = f"{m.name} {m.year}"
            simple_slug = slugify(text)
            m.slug = simple_slug
            
    print("start updating")
    bulk_update(mqs, update_fields=["slug"])


def update_slug(start, end):
    allp = Person.objects.filter(slug__isnull=True).order_by("tmdb_id")[start: end]
    print("Current non-slug elements: ", allp.count())
    for m in allp:
        convert = f"{m.name} {m.tmdb_id}"
        m.slug = slugify(convert)
    print("start updating")
    bulk_update(allp, update_fields=["slug"])


def single_slug(id, slug):
    m = Movie.objects.get(id=id)
    m.slug = slug
    m.save()

###################################################3


all18 = Movie.objects.filter(year=2018, tmdb_id__isnull=False).only("year", "id", "tmdb_id", "name")
for m in tqdm(all18):
    try:
        tm, created = TmdbMovie.objects.get_or_create(tmdb_id=m.tmdb_id, movielens_id=m.id, registered=True)
        if tm.data.get("summary"):
            continue
        tm.save_data()
    except:
        continue

tmall = TmdbMovie.objects.filter(registered=True)
for m in tqdm(tmall):
    try:
        m.create_crew()
        m.create_cast()
        m.create_poster()
    except:
        continue

j = Movie.objects.get(imdb_id="tt6146586")

duplicate_names = Crew.objects.select_related("person", "movie").values(
    'person__id', 'movie__name', "job").annotate(Count('person__id')).order_by().filter(person__id__count__gt=1)

duplicate_objects = Crew.objects.filter(person__in=[item['person__id'] for item in duplicate_names])



all18 = Movie.objects.filter(year=2019, tmdb_id__isnull=False).only("year", "id", "tmdb_id", "name")
jw = all18[1]
jt = jw.tmdb_object
jt.create_trailer()


allt = TmdbMovie.objects.filter(registered=True)
for m in tqdm(allt[450:]):
    m.create_trailer()

for item in duplicate_names:
    qs = Crew.objects.filter(person__id=item['person__id'], job=item["job"], movie__name=item["movie__name"])
    if len(qs)>1:
        qs.first().delete()




duplicate_names = Video.objects.values(
    'youtube_id').annotate(Count('youtube_id')).order_by().filter(youtube_id__count__gt=1)

for item in duplicate_names:
    qs = Video.objects.filter(youtube_id=item['youtube_id'])
    if len(qs)>1:
        qs.first().delete()

cbs = Profile.objects.get(id=1)
Recommendation.get_recommendations(cbs)

cb = cbs.persona
cb.prediction(6934)

cb.prediction2(6934, max_neighbours=25)


cb.prediction(6934, min_similarity=0.3, min_quantity=40, min_neighbours=7, max_neighbours=50 )


cb.prediction(2571)

cbs.full_scan(scan_movies=True)

cb.scan_movies_by_id(2571)
cb.scan_movies_queue(rating=5)

cbs.scan_movies(5)

cb.prediction(2571)
cb.prediction2(2571)


tw = Movie.objects.get(id=56782)
g = Movie.objects.get(id=3578)

aventura = Movie.objects.get(id=8195)

import datetime as dt
from datetime import datetime, timezone
jbl = Profile.objects.get(username="jbl")
qs = Recommendation.objects.filter(profile=jbl, is_recommended = True)
r1 = qs[0]
r1t = r1.recommended_at
now =  datetime.now()



from persona.myqueue import Ops
Ops.put(cb.scan_movies_by_rating, 5)
Ops.do()

cb.scan_movies_by_rating(5)

matr = MovieArchive.objects.filter(movie_id=2571).first()

cb.filter_target_dummies(matr)
cb.filter_target_reals(matr)



def func(x):
    print(x[0])
    print(x[1])
    print(x[2])

cb.scan_movies_queue(5)





cb.scan_movies_background(5)

Recommendation.objects.all().count()


from persona.myqueue import Ops
Ops.put(cb.scan_movies_by_rating, 5)
Ops.do()

cb.scan_movies_by_rating(5)

matr = MovieArchive.objects.filter(movie_id=2571).first()

cb.filter_target_dummies(matr)
cb.filter_target_reals(matr)



Prediction.objects.filter(profile=cbs, movie=tw)

tw = Movie.objects.get(id=56782)
jbl = Profile.objects.get(username="jbl")
g = Movie.objects.get(id=3578)


def threaded(func,*args, **kwargs):
    import threading
    t = threading.Thread(target=func, args=args, kwargs=kwargs)
    t.setDaemon(True)
    t.start()
    print("Threaded function started")
    return "Thread function returned."




def func(rng):
    liste = []
    for i in range(rng):
        print(i)
        liste.append(i)
    return liste





def func(a,b):
    import gc
    la = [x for x in range(a)]
    lb = [x for x in range(b)]
    print("la1: ", la)
    print("lb1: ", lb)
    la2 = []
    lb2 = []
    for ia in la:
        la2.append(ia*2)
    for ib in lb:
        lb2.append(ib*2)

    del la
    del lb

    print("la2 after del: ", la2)
    print("lb2 after del: ", lb2)

    #print("la after del: ", la)
    #print("lb after del: ", lb)



# <--------------------------------------------------------------->

import _pickle as pickle
from tqdm import tqdm
import asyncio
import datetime
#Look for given movie id list that has no Crew Director objects
from archive import custom_functions as cf
from gql import tmdb_class
movie_id_list_path = "/home/jb/Projects/Github/movielens/filtered-data/movie-id-lists/movie_id_list_10k.pickle"
pool_movie_ids = set(cf.get_pickle(movie_id_list_path))

movie_ids_have_director = Crew.objects.filter(job="d", movie__id__in=pool_movie_ids).select_related("movie").values_list("movie__id", flat=True)
movies_have = set(movie_ids_have_director)

#movies that dont have director crew object
movies_not = pool_movie_ids.difference(movies_have)

#check again it should be zero
Crew.objects.filter(job="d", movie__id__in=movies_not).select_related("movie").count()

movie_qs = list(Movie.objects.filter(id__in=movies_not).only("id", "tmdb_id"))


def get_datetime(date_str):
    if date_str==None:
        return None
    import datetime
    d = date_str.split("-")
    return datetime.date(int(d[0]), int(d[1]), int(d[2]))


def get_directors(start, stop):
    bulk_crew = []
    for movie in tqdm(movie_qs[ start : stop]):
        tm = movie.tmdb
        if tm:
            casts, crews = tm.credits()
            if crews!=None and len(crews)>0:
                for crew in crews:
                    if crew.get("job")=="Director":
                        if Person.objects.filter(tmdb_id=crew.get("id")).exists():
                            p = Person.objects.get(tmdb_id=crew.get("id"))
                            crew_obj = Crew(movie=movie, person=p, job="d" )
                            bulk_crew.append(crew_obj)
                        else:
                            person_dict = {}
                            tp = tmdb_class.Person(crew.get("id")).extended_details()
                            person_dict["id"] = tp.get("external_ids").get("imdb_id")
                            person_dict["tmdb_id"] = crew.get("id")
                            p_name = tp.get("name")
                            person_dict["name"] = p_name
                            person_dict["born"] = get_datetime(tp.get("birthday"))
                            person_dict["died"] = get_datetime(tp.get("deathday"))
                            person_dict["bio"] = tp.get("biography")
                            try:
                                p = Person.objects.create(person_dict)
                                print(f"new person {p_name} created.")

                                crew_obj = Crew(movie=movie, person=p, job="d" )
                                bulk_crew.append(crew_obj)
                            except:
                                continue
    Crew.objects.bulk_create(bulk_crew)
    print(f"{len(bulk_crew)} number of director added.")

f = "/home/jb/Documents/Data/sample.json"
a = [1,2,3,4]

########################################################3
active_director_id_list = [
    'nm0000005', 'nm0000033', 'nm0000040',
    'nm0000186', 'nm0000217', 'nm0000233', 'nm0000338', 'nm0000399',
    'nm0000419', 'nm0000464', 'nm0000759', 'nm0000774', 'nm0001068',
    'nm0001789', 'nm0004716', 'nm0027572', 'nm0149196', 'nm0190859',
    'nm0359734', 'nm0487166', 'nm0634240', 'nm0708903', 'nm0889513', 
    'nm0939182']

other_director_id_list = [
    "nm0001054", "nm0000965", "nm0000318", "nm0001466", "nm0000231",
    "nm0000361", "nm0001392", "nm0000116", "nm0000709", "nm0000600",
    "nm0001741", "nm0000941", "nm0001104", "nm0000631", "nm0005124",
    "nm0001661", "nm0001469", "nm0000118", "nm0000520", "nm0000697",
    "nm0000436", "nm0005363", "nm0001752", "nm0000455", "nm0000080",
    "nm0000041", "nm0001603", "nm0000264", "nm0190859", "nm0000184",
    "nm0000386", "nm0001053", "nm0001149", "nm0000814", "nm0001628",
    "nm0796117", "nm0000126", "nm0000343", "nm0000142", "nm0001232",
    "nm0000591", "nm0000095", "nm0327944", "nm0001348", "nm0000500",
    "nm0001885", "nm0269463", "nm0224331", "nm0224331", "nm0868219",
    "nm0001392", "nm0594503", "nm0009190", "nm0315041", "nm0516360",
    "nm0000419", "nm0015359", "nm0000766", "nm0001437", "nm0637615",
    "nm0850601", "nm0001596", "nm0001425"
]

sum_director_id_list = list(set(active_director_id_list + other_director_id_list))


def get_director_movie_ids(director_id):
    qs = Crew.objects.select_related("person").filter(
            person__id=director_id, job="d")
    if qs.count()>0: 
        movid_id_list = [x.movie_id for x in qs]
    else:
        movid_id_list = []
    return movid_id_list


def get_movie_ids_from_director_id_list(director_id_list):
    movie_id_list = []
    for director_id in director_id_list:
        movids = get_director_movie_ids(director_id)
        movie_id_list += movids
    return list(set(movie_id_list))


def get_movie_ids_from_our_lists():
    movie_id_list = []
    qls = List.objects.prefetch_related("movies").all()
    for l in qls:
        movies = l.movies.all()
        movids = [x.id for x in movies]
        movie_id_list += movids
    return list(set(movie_id_list))


def movie_id_filter(start_year, stop_year, imdb_rating=0, imdb_votes=0):
    qms = Movie.objects.filter(year__gte=start_year, year__lte=stop_year, imdb_rating__gte=imdb_rating, data__imdbVotes__gte=imdb_votes).only("id", "year", "imdb_rating", "data")
    movie_id_list = [x.id for x in qms]
    return list(set(movie_id_list))


dl = get_movie_ids_from_director_id_list(sum_director_id_list)
ll = get_movie_ids_from_our_lists()

ml1 = movie_id_filter(1950, 1980, 7.5, 10000)
ml2 = movie_id_filter(1980, 2000, 6, 5000)
ml3 = movie_id_filter(2000, 2019, 6, 2000)

all_ids = dl + ll + ml1 + ml2 + ml3
all_ids = list(set(all_ids))




#################################################################

db_folder = "/home/jb/Projects/AWS/database/"
movie_id_list = db_folder + "movie_id_list" #only movie ids
movie_dummy_file = db_folder + "movie_dummy_dict.pickle"# {1:[dummy_id158...], 2:[dummy_id158, dummy_id1....]}
movie_movie_corr_file = db_folder + "movie_movie_corr.pickle" # { 1:{3:0.89,..}...}
corr_dataframe  = db_folder + "corr_df.pickle"
refined_ratings = db_folder + "refined_ratings.csv"
redis_like_ratings = db_folder + "refined_ratings.pickle"
person_file = db_folder + "person.pickle"
crew_dict = db_folder + "crew.pickle"



# Video yt_id and thumb save
def func(start, stop):
    from tqdm import tqdm
    vall = Video.objects.all()[start:stop]
    for v in tqdm(vall):
        url = v.link
        if "youtube" in url:
            try:
                defer_web = url.split("v=")[1]
                yt_id = defer_web.split("&")[0]
                v.youtube_id = yt_id
                v.thumbnail = "https://img.youtube.com/vi/{}/mqdefault.jpg".format(yt_id)
                v.save()
            except:
                continue



def get_pickle(file_directory):
    import _pickle as pickle
    with open(file_directory, "rb") as f:
        r = pickle.load(f)
    return r

def save_pickle(file_directory, file):
    import _pickle as pickle
    with open(file_directory, "wb") as f:
        pickle.dump(file, f)
    print("saved")

p = get_pickle(person_file)
plist = [x for x in p.keys()]
len(plist)
pset = set(plist)
len(pset)


registered_ids = [x[0] for x in  Person.objects.all().values_list("id")]
len(registered_ids)
rset = set(registered_ids)
len(rset)

def will_create(plist, registered_ids):
    new_list = plist
    for i in registered_ids:
        if i in plist:
            new_list.remove(i)
    return new_list

def imdb_based():
    new_imdb_dic = {}
    for val in p.values():
        new_imdb_dic.update({val.get("id"): val})
    return new_imdb_dic


def bulk_person(new_list, start, stop):

    bulk_objects = []
    
    for new_pid in tqdm(new_list[start:stop]):
        new_person_dict = p.get(new_pid)
        new_person = Person(**new_person_dict)
        bulk_objects.append(new_person)
    print("Person number before:{}".format(Person.objects.all().count()))
    print("Number of bulk peron before create:{}".format(len(bulk_objects)))
    Person.objects.bulk_create(bulk_objects)
    print("After create of person: Total Person is: {}".format(Person.objects.all().count()))

def bb(start):
    for i in range(20):
        s = start + i*5000
        st = s + 5000
        if s < 105000:
            bulk_person(np ,s, st )
        else:
            print("done")

##############################################33
import _pickle as pickle
from tqdm import tqdm
db_folder = "/home/jb/Projects/AWS/database/"
movie_id_list = db_folder + "movie_id_list" #only movie ids
movie_dummy_file = db_folder + "movie_dummy_dict.pickle"# {1:[dummy_id158...], 2:[dummy_id158, dummy_id1....]}
movie_movie_corr_file = db_folder + "movie_movie_corr.pickle" # { 1:{3:0.89,..}...}
corr_dataframe  = db_folder + "corr_df.pickle"
refined_ratings = db_folder + "refined_ratings.csv"
redis_like_ratings = db_folder + "refined_ratings.pickle"
person_file = db_folder + "person.pickle"
crew_dict = db_folder + "crew.pickle"

def get_pickle(file_directory):
    import _pickle as pickle
    with open(file_directory, "rb") as f:
        r = pickle.load(f)
    return r

def save_pickle(file_directory, file):
    import _pickle as pickle
    with open(file_directory, "wb") as f:
        pickle.dump(file, f)
    print("saved")

# Crew ops
cr = get_pickle(crew_dict)
cr_movie_id_list = [x for x in cr.keys()]


valid_tmdb_ids = [x.get("tmdb_id") for x in  Person.objects.all().values("id", "tmdb_id")]


def create_crew2(start, stop):
    from tqdm import tqdm
    cr = get_pickle(crew_dict)
    cr_movie_id_list = [x for x in cr.keys()][start : stop]
    crew_bulk = []
    valid_tmdb_ids = [x.get("tmdb_id") for x in  Person.objects.all().values("id", "tmdb_id")]

    qs = Movie.objects.filter(id__in=cr_movie_id_list).defer("data","ratings_dummy", "year", "summary","poster")
    qs_persons = Person.objects.all().defer("data","bio", "job","poster")

    for movie in tqdm(qs):
        movie_crews = cr.get(movie.id)

        for c in movie_crews:
            if c.get("tmdb_id") in valid_tmdb_ids:
                person = qs_persons.get(tmdb_id=c.get("tmdb_id"))
                job = c.get("job")
                character= c.get("character")
                data = {"department" : c.get("department")}
                if character:
                    crew_bulk.append(
                        Crew(movie=movie, person=person, job=job, character=character, data=data)
                    )
                else:
                    crew_bulk.append(
                        Crew(movie=movie, person=person, job=job, data=data)
                    )
    print("before bulk create num of crew:{}".format(Crew.objects.all().count()))
    Crew.objects.bulk_create(crew_bulk)
    print("after bulk create num of crew:{}".format(Crew.objects.all().count()))

def auto_create(start, batch_size, stop):

    rrr = (stop - start)//batch_size
    for i in range(rrr):
        strt = start + i*batch_size
        stp = strt + batch_size
        create_crew2(strt, stp)
        print("{} added to db".format(batch_size))
        print("\n")

################################################################3

def summart(start, stop):
    from tqdm import tqdm
    allm = Movie.objects.order_by("id").defer("ratings_dummy","ratings_user")

    for m in tqdm(allm[start: stop]):
        summary = m.summary
        data = m.data
        if data:
            pl = data.get("Plot")
            if pl and len(pl)>len(summary):
                m.summary = pl
                m.save()

####################################################3
# cbs = Profile.objects.get(id=1)
# 
plist = Profile.objects.all()

def create_follow_person(profile):
    qs = profile.follow_persons.all()
    if qs:
        for p in qs:
            Follow.follow_person(profile=profile, person=p)

def create_follow_liste(profile):
    qs = profile.follow_lists.all()
    if qs:
        for l in qs:
            Follow.follow_liste(profile=profile, liste=l)

def create_follow_topics(profile):
    qs = profile.follow_topics.all()
    if qs:
        for t in qs:
            Follow.follow_topic(profile=profile, topic=t)



def fobj():
    from tqdm import tqdm
    plist = Profile.objects.all()
    for pro in tqdm(plist):
        create_follow_person(pro)
        create_follow_liste(pro)
        create_follow_topics(pro)

def add_type():
    for f in Follow.objects.all():
        if f.target_profile:
            target =  "u"
        elif f.person:
            target = "p"
        elif f.liste:
            target = "l"
        elif f.topic:
            target = "t"
        f.typeof = target
        f.save()


######
def user_to_archive():
    for ua in tqdm(UserArchive.objects.filter(user_type="u").only("user_id","user_type")):
        p = Profile.objects.get(user__id=ua.user_id)
        if len(p.ratings.keys())>30:
            ua.ratings = set(p.ratings.keys())

missing = []
qs = MovieArchive.objects.all()
for m in tqdm(qs):
    if len(m.dummyset)==0:
        missing.append(m.movie_id)
