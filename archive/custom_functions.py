import os, sys, inspect
cmd_subfolder = os.path.realpath(os.path.abspath(os.path.join(os.path.split(inspect.getfile( inspect.currentframe() ))[0],"cython")))
if cmd_subfolder not in sys.path:
    sys.path.insert(0, cmd_subfolder)

import cfunc as cc


def target_type_checker(target, object_type="Movie"):
    # Return object and its id
    if object_type=="Movie":
        from items.models import Movie
        if type(target).__name__ == object_type:
            print("Target Type Checker Message: Target is Movie object. Returns (Movie, Movie.id) ")
            # return movie, movie.id
            return target, target.id
        else:
            if type(int(target)).__name__ == "int":
                print("Target Type Checker Message: Target is an id.")
                movie = Movie.objects.filter(id=target).only("id", "name")[0]
                return movie, movie.id

def post_prediction(result):
    if 4.5 < result:
        surplus = result - 4.5
        return result - (surplus * 0.75) - 0.1
    elif 4<result and result<=4.5 :
        surplus = result - 4
        return result - (surplus * 0.5) - 0.05
    elif 4 <= result:
        return result
    return result




def sort_dict(dic, item="value", reverse=True):
    if item.lower().startswith("v"):
        if reverse:
            return sorted(dic.items(), key=lambda x:x[1], reverse=True)
        else:
            return sorted(dic.items(), key=lambda x:x[1], reverse=False)
    if item.lower().startswith("k"):
        if reverse:
            return sorted(dic.items(), key=lambda x:x[0], reverse=True)
        else:
            return sorted(dic.items(), key=lambda x:x[0], reverse=False)

def random_sample(population, sample_size):
    import random
    
    if len(population)>sample_size:
        return random.sample(population, sample_size)
    else:
        return population


def save_pickle(file, file_dir, compress=False):
    import _pickle as pickle
    if compress:
        import bz2
        with bz2.BZ2File(file_dir,"w") as f:
            pickle.dump(file, f)
        print("Saved by compressing to:'{}'".format(file_dir))
    with open(file_dir, "wb") as f:
        pickle.dump(file, f)
    print("Saved to:'{}'".format(file_dir))


def get_pickle(file_dir, compress=False):
    import _pickle as pickle
    if compress:
        import bz2
        with bz2.BZ2File(file_dir,"r") as f:
            file = pickle.load(f)
        return file
    with open(file_dir, "rb") as f:
        file = pickle.load(f)
    return file


def save_json(file, file_dir):
    import json
    with open(file_dir, "w") as f:
        json.dump(file, f)
    print("Saved to:'{}'".format(file_dir))


def get_json(file_dir):
    import json    
    with open(file_dir, "r") as f:
        file = json.load(f)
    return file


def dict_to_bytes(d):
    import json
    return bytes(json.dumps(d), "utf-8")

def bio(f):
    from io import BytesIO
    fp = BytesIO()
    fp.write(f)
    return fp

def batching(elements, batch_size):
    #Take list and returns batched lists
    # [1,2,3,4,5] --2--> [[1,2], [3,4], [5]]
    import math
    total_quantity = len(elements)
    number_of_batch = math.ceil(total_quantity // batch_size)
    batched_list = []
    for i in range(number_of_batch + 1):
        piece = elements[i*batch_size : i*batch_size + batch_size]
        if len(piece)>0:
            batched_list.append(piece)
    return batched_list



def chronometer(f):
    def func_wrapper(*args, **kwargs):
        import time
        start = time.time()
        result = f(*args, **kwargs)
        print(time.time() - start, " seconds. (Chronometer decorator)")
        return result
    return func_wrapper


def threaded(func,*args, **kwargs):
    import threading
    t = threading.Thread(target=func, args=args, kwargs=kwargs)
    print("<-------THREAD FUNCTION------------------>\n")
    print("Threaded function started")
    t.setDaemon(True)
    t.start()
    print("Threaded function is finishing.(inner function will still continue in a seperate thread)")
    print("<-------------------------------------------->")
    #return "Thread function returned."




def dummy_selection(filtered_dummies,min_quantity, bring):
    result = {}
    # IF NOT MUCH DUMMY USERS
    if len(filtered_dummies) <= bring:
        return filtered_dummies

    # IF THERE ARE MANY
    elif len(filtered_dummies)>bring:
        for k,v in filtered_dummies.items():
            if v.get("similarity")>=0.7:
                result[k] = v
                if len(result)>=5:
                    break
        #Check Higher commonly rates
        for k,v in filtered_dummies.items():
            q = v.get("quantity")
            s = v.get("similarity")
            if ( q >= min_quantity + 25 and s >=0.5):
                result[k] = v
                if len(result)==bring:
                    return result
        
        if len(result)<=bring:
            for k,v in filtered_dummies.items():
                q = v.get("quantity")
                s = v.get("similarity")
                if ((q <= min_quantity + 25) and (q >= min_quantity + 20) and s>=0.5):
                    result[k] = v
                    if len(result)==bring:
                        return result

        if len(result)<=bring:
            for k,v in filtered_dummies.items():
                q = v.get("quantity")
                s = v.get("similarity")
                if ((q <= min_quantity + 20) and (q >= min_quantity + 10) and s>=0.5):
                    result[k] = v
                    if len(result)==bring:
                        return result

        if len(result)<=bring:
            for k,v in filtered_dummies.items():
                q = v.get("quantity")
                s = v.get("similarity")
                if ((q <= min_quantity + 10) and (q >= min_quantity) and s>=0.5):
                    result[k] = v
                    if len(result)==bring:
                        return result

        if len(result)<=bring:
            for k,v in filtered_dummies.items():
                q = v.get("quantity")
                s = v.get("similarity")
                if ((q <= min_quantity + 10) and (q >= min_quantity) and (s>=0.2  and s<0.5)):
                    result[k] = v
                    if len(result)==bring:
                        return result
        return result


"""
def multi_threaded(func,*args, **kwargs):
    import threading
    print("<-------THREAD FUNCTION------------------>\n")
    t1 = threading.Thread(target=func, args=args, kwargs=kwargs, daemon=True)
    t2 = threading.Thread(target=func, args=args, kwargs=kwargs, daemon=True)

    print("Threaded function started")

    t1.start()
    t2.start()
    print("Threaded function is finishing.(inner function will still continue in a seperate thread)")
    print("<-------------------------------------------->")
    #return "Thread function returned."




def no():
    print("function without args-kwargs is executing.")
    
    import time
    print("3 sec sleep is starting")
    time.sleep(3)
    print("3 sec sleep is done")

    print("Function was ended.")

def f_param(text):
    import time
    print("3 sec sleep is starting")
    time.sleep(3)
    print("3 sec sleep is done")
    print(f"function with params:{text} is executing")
    print(f"Hello text:{text}")
    return 55


def f_args(*args):
    import time
    print("3 sec sleep is starting")
    time.sleep(3)
    print("3 sec sleep is done")
    print(f"function with args is executing.")
    print("Args with star (*args) is:", *args)
    print("Length of Args with star:", len(*args))
    print("Args without star (args) is:", args)
    print("Length of Args without star:", len(args))


def f_kwargs(**kwargs):
    import time
    print("3 sec sleep is starting")
    time.sleep(3)
    print("3 sec sleep is done")
    print("function with kwargs is executing.")
    print("Kwargs with star (**kwargs) is:", *kwargs)
    print("Kwargs without star (kwargs) is:", kwargs)

def f_kwargs(**kwargs):
    print(kwargs.keys())

"""