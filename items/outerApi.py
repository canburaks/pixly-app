import requests
tmdb_api_key = "64fdf8453969abf3a5df3c2eac6c367f"
tmdb_v4 = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI2NGZkZjg0NTM5NjlhYmYzYTVkZjNjMmVhYzZjMzY3ZiIsInN1YiI6IjViMGVmZDRhMGUwYTI2NDYxNzAwMDYxOSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.9mrwDPEZHLsFbcbmBZr5z8mUf7ci_ZmG4lrDpdcMsdc"
omdb_api = "3f49586a"
baseUrl = "https://image.tmdb.org/t/p/w185"

def get250id():
    url = ("https://api.themoviedb.org/3/list/634?api_key="
    "{}&language=en-US".format(tmdb_api_key))
    idlist = []
    req = requests.get(url)
    req = req.json()
    for i in req["items"]:
        idlist.append(i["id"])
    return idlist

r = get250id()


def pair250id():
    r = get250id()
    liste = []
    o = 0
    for m in r:
        try:
            mov = Movie.objects.get(tmdb_id=m)
            liste.append(mov.id)
        except:
            o +=1
            print(o)
    return liste





def topRated(pagenum):
    url = ("https://api.themoviedb.org/3/movie/top_rated?api_key="
        "{}&language=en-US&page={}".format(tmdb_api_key,pagenum))
    req = requests.get(url)
    req = req.json()
    return req



def tmdb_details(tmdbId):
    url = ("https://api.themoviedb.org/3/movie/"
        "{}?api_key={}&language=en-US").format(tmdbId,tmdb_api_key)
    req = requests.get(url)
    req = req.json()
    return req

tmdb_details(9089)
def getSummary(tmdbId):
    info = tmdb_details(tmdbId)
    return info.get("overview")

def PosterUrl(tmdbId):
    info = tmdb_details(tmdbId)
    posterPath = info.get("poster_path")
    path = baseUrl + posterPath
    return path

def getPosterUrlAndSummary(tmdbId):
    info = tmdb_details(tmdbId)
    if info.get("overview"):
        summary = info.get("overview")
    else:
        summary=None
    if info.get("poster_path"):
        posterPath = info.get("poster_path")
        posterUrl = baseUrl + posterPath
    else:
        posterUrl = None
    if info.get("release_date"):
        year = info.get("release_date")
        year = int(year[:4])
    else:
        year=None
    return posterUrl, summary, year


top250_url = "http://akas.imdb.com/chart/top"

def get_top250():
    r = requests.get(top250_url)
    html = r.text.split("\n")
    result = []
    for line in html:
        line = line.rstrip("\n")
        m = re.search(r'data-titleid="tt(\d+?)">', line)
        if m:
            _id = m.group(1)
            result.append(_id)
    #
    return result

def imdbId(integer):
    s = str(integer)
    new = (7-len(s))*"0" + s
    newId = "tt" + new
    return newId

def omdb_details(imdb_id):
    import requests
    url = ("http://www.omdbapi.com/?i={}&apikey=3f49586a").format(str(imdb_id))
    req = requests.get(url)
    req = req.json()
    return req

def imdbRating(mov):
    iid = mov.imdb_id
    im_id  = imdbId(iid)
    r = omdb_details(im_id).get("imdbRating")
    mov.imdb_rating = float(r)
    print("rating done")
    mov.save()
"""

#### EXAMPLE ##########3
from django.core import files
from io import BytesIO
import requests

url = "https://example.com/image.jpg"
resp = requests.get(url)
if resp.status_code != requests.codes.ok:
    pass
    #  Error handling here

fp = BytesIO()
fp.write(resp.content)
file_name = url.split("/")[-1]  # There's probably a better way of doing this but this is just a quick example
your_model.image_field.save(file_name, files.File(fp))"""
