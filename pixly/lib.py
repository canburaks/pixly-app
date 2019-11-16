#Common Functions

def director_name_formatter(director_name_list, duo, many):
    directors_num = len(director_name_list)
    elif directors_num == 1:
        return director_names[0]
    elif directors_num == 2:
        return duo.join(director_names)
    elif directors_num > 2:
        return many.join(director_names)
    return None


def get_class_callable_names(cls):
    class_keys = cls.__dict__.items()
    methods = [ k for k,v in class_keys \
        if not k.startswith("__") and hasattr(cls.__dict__[k], "__call__") ]
    return methods

def get_class_cache_methods(class_name):
    #return ("method_name", method)
    import functools
    return [(k,v) for k,v in class_name.__dict__.items() 
        if isinstance(v, functools._lru_cache_wrapper)]


def to_english_chars(text):
    from unidecode import unidecode 
    #returns english characters for username and emails
    return unidecode(text)

def remove_punctuations(text):
    import string
    # string.punctuation  = '!"#$%&\'()*+,-./:;<=>?@[\\]^_`{|}~'
    table = str.maketrans(dict.fromkeys(string.punctuation))  
    # OR {key: None for key in string.punctuation}
    return text.translate(table)  

# Usage: movie.poster.save(*url_image(poster_url, poster_filename))
def get_image_file_from_url(url, filename):
    from django.core import files
    from io import BytesIO
    import requests
    response = requests.get(url)
    fp = BytesIO()
    fp.write(response.content)
    return filename, files.File(fp)

def is_email_registered(email):
    from django.contrib.auth.models import User
    if User.objects.filter(email__iexact=email).exists() or \
        Profile.objects.filter(email__iexact=email).exists():
        return True
    return False


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