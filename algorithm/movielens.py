from items.models import Movie

from algorithm.models import Dummy

import pandas as pd
import numpy as np
from collections import defaultdict
from django.db import IntegrityError

folder = "/home/jb/Documents/MovieLens/updated/"
#folder = "/home/jb/Documents/MovieLens/ml-latest/"
movie = folder + "fullMovieInfo.csv"
rating = folder + "ratinginfo.csv"
database = folder + "links.csv"

movieTable = pd.read_csv(movie)
ratingTable = pd.read_csv(rating)
linkTable = pd.read_csv(database)
#df = pd.DataFrame(columns=["id","tmdb","summary"])

#ratingTable.shape
#userList = ratingTable["userId"].unique()
#movieTable.head()

#mlist = movieTable.iloc[:,[0,1,2,3,5]].copy()
#mlist.head()

mt = movieTable.iloc[:,[0,1,2,3,5]].copy()

mt.head()
rt = ratingTable.sort_values("movieId").copy()

r1 = rt.iloc[:10000000].copy()

r1.tail()


mt.head()

def createM2(df):
    BulkObjects = []
    i = 0
    for i,r in df.iterrows():
        id = r[0]
        name = r[3]
        year = r[5]
        try:
            imdb = r[1]
        except:
            imdb = None
        try:
            tmdb = int(r[2])
        except:
            tmdb = None
        BulkObjects.append(Movie(id=id, imdb_id=imdb, tmdb_id=tmdb, name=name, year=year ))
        i +=1
        if i%500==0:
            try:
                Movie.objects.bulk_create(BulkObjects)
                print("Successfully created 50000 of dummy user")
                del BulkObjects[:]
                i=0
            except IntegrityError:
                continue
    Movie.objects.bulk_create(BulkObjects)








def dummyCreate(df,userList):
    BulkObjects = []
    i = 0
    for uid in userList:
        dummyframe = df[df["userId"]==uid]
        dummyDict = {}
        for i,r in dummyframe.iterrows():
            m = str(int(r[1]))
            r = r[2]
            dummyDict.update({m:r})
        d = Dummy(id=uid, ratings=dummyDict)
        BulkObjects.append(d)
        i += 1
        if i%5000==0:
            try:
                Dummy.objects.bulk_create(BulkObjects)
                print("Successfully created 50000 of dummy user")
                del BulkObjects[:]
                i=0
            except IntegrityError:
                continue
    Dummy.objects.bulk_create(BulkObjects)


def lensTo(imdbid):
    imdbAll = mlist.imdbId.tolist()
    if imdbid in imdbAll:
        li = mlist[mlist["imdbId"]==imdbid]
        id = li.iloc[0,0]
        imdb_id = li.iloc[0,1]
        tmdb_id = int(li.iloc[0,2])
        name = li.iloc[0,3]
        year = li.iloc[0,5]
        try:
            m = Movie(id=id, imdb_id=imdb_id, tmdb_id=tmdb_id, name=name, year=year)
            m.save()
            print("id:{}  name:{} added.".format(id, name))
        except:
            print("Unsuccessful")
    else:
        print("id:{} Not found".format(imdbid))


#pd.isnull(mlist.iloc[0,3])
def deneme(df):
    i = 0
    for i,r in df.iterrows():
        if r[1]:
            print(r)
        print(i)
#mlist.tmdbId.isnull().any()
#mmini = mlist.iloc[:10,:]

userList = ratingTable["userId"].unique()
r1 = userList[:150000]
r2 = userList[150001:]
r3 = userList[200001:]
df = ratingTable.iloc[14432547:,:].copy()
ratingTable[ratingTable["userId"]==150000]
#mlist.head()
#mlist[mlist["year"]=="2016"].shape
#deneme(newml)
def movieCreate(df):
    i = 0
    for i,r in df.iterrows():
        id = r[0]
        name = r[3]
        year = r[5]
        try:
            imdb = r[1]
            tmdb = r[2]
        except:
            imdb = None
            tmdb = None
        if i%100==0:
            print("{} number of movie added".format(i))
        try:
            m = Movie(id=id, imdb_id=imdb, tmdb_id=tmdb, name=name, year=year )
            m.save()
            i +=1
        except:
            print("could not saved id:{}".format(i))

def d2m(df, movie):
    from items.models import Movie
    movieList = df["movieId"].unique()
    i = 0
    for iid in movieList:
        try:
            movie = Movie.objects.get(id=iid)
            dummyframe = df[df["movieId"]==iid]
            dummyDict = {}
            for i,r in dummyframe.iterrows():
                u = str(int(r[0]))
                r = r[2]
                dummyDict.update({u:r})
            movie.rates = dummyDict
            movie.save()
            i += 1
            if i%10000==0:
                print("Successfully created 10000 of dummy user")
        except:
            print("Movie:{} can not be saved".format(iid))
            continue
