from graphqlclient import GraphQLClient
import json

client = GraphQLClient('http://playthough.com/graphql')

#client = GraphQLClient('http://127.0.0.1:8000/graphql')




def get_cache(dummy_id):
    import json
    r = client.execute('''
        query cache($key:String!){
            cache(key:$key)
        }
    ''',{"key":str(dummy_id)})
    result = json.loads(r)
    return result


def set_dummy(dummy_id, dummy_dict):
    import json
    movie_rating_dict = json.dumps(dummy_dict)
    r = client.execute('''
        mutation dummy($id:String!, $dictionary:String!){
            dummy(id:$id, dictionary:$dictionary){
                rating
            }
        }
    ''',{"id":str(dummy_id), "dictionary":str(movie_rating_dict) })

def set_cache():
    r = client.execute('''
        mutation cacheDummyList($min_points:Int!){
            cacheDummyList(min_points : $min_points){
                message
            }
        }
    ''',{ "min_points" : 30 })
    return json.loads(r)

r = client.execute('''
    query dummy($id:String){
        dummy(id:$id)
    }
''',{"id":"1"})


file = "/home/jb/Projects/AWS/database/files/dummy_movie_dict_true.json"
with open(file, "r") as f:
    jdb = json.load(f)

keylist = list(jdb.keys())

def update_redis(start, stop):
    from tqdm import tqdm
    keylist = list(jdb.keys())
    for d in tqdm(keylist[start:stop]):
        user_id = "d{}".format(d)
        dic = jdb.get(d)
        set_dummy(user_id, dic)

from tqdm import tqdm
import time
def auto_update(start,batch, stop):
    inrange = (stop - start) // batch
    for i in range(inrange):
        basla = start + i*batch
        dur = basla + batch

        for d in tqdm(keylist[basla:dur]):
            ddict = jdb.get(d)
            user_id = "d" + d

            set_dummy(user_id, ddict)
        print(dur)
        print("done")
        time.sleep(1)

import json
from tqdm import tqdm
file = "/home/jb/Projects/AWS/database/files/movie_userset.json"
with open(file,"r") as f:
    mds = json.load(f)

mlist = list(mds.keys())

def f(start, stop):
    for i in mlist[start:stop]:
        movie_code = "m"+i
        set_dummy(movie_code, mds.get(i))
        print(i)




def ff():
    allp = Profile.objects.all()
    for p in tqdm(allp):
        if len(p.ratings.keys())
        movie_cid = "m{}".format(r.movie.id)
        user_cid = str(r.profile.user.id)
        movie_cache_list = get_dummy(movie_cid)
        movie_cache_list.append(user_cid)
        set_dummy(movie_cid, list(set(movie_cache_list)))





def auto_redis_set(start, batch, stop):
    import time
    rr = (stop -start)//batch
    for i in range(rr):
        st = start + i*batch
        stp = st + batch

        r = client.execute('''
            mutation redis($start:Int!, $stop:Int!){
                redis(start:$start, stop:$stop){
                    result
                }
            }
        ''',{"start":int(st), "stop":int(stp) })
        print(r)
        time.sleep(5)