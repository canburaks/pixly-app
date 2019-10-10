import _pickle as pickle
from gql import tmdb_class as t
from items.models import Movie
from persons.models import Person, Director, Actor
from tqdm import tqdm

liste = Movie.objects.filter(imdb_rating__gt=4).order_by("id")


def get_movie_credits(movie):
    tmovie = t.Movie(movie.tmdb_id)
    # return cast, crew
    return tmovie.credits()


def add_person_poster(person):
    from django.core import files
    from io import BytesIO
    import requests
    pUrl = person.data.get("tmdb_poster_path")
    if pUrl:

        try:
            resp = requests.get(pUrl)
            fp = BytesIO()
            fp.write(resp.content)
            file_name = "{0}-profile-path.jpg".format(person.name)
            person.poster.save(file_name, files.File(fp))
        except:
            print("Error!! : {} could not be saved".format(person.name))


def person_detail_save(credit, **kwargs):
    tmdb_id = kwargs.get("id")
    tperson = t.Person(tmdb_id)

    d = tperson.details()  # person details from tmdb api as a dict
    imdb_id = d.get("imdb_id")
    person, created = Person.objects.update_or_create(id=imdb_id)
    if created == False:
        return None

    person.tmdb_id = tmdb_id
    person.name = d.get("name")
    person.born = d.get("birthday")
    person.bio = d.get("biography")
    person.died = d.get("deathday")

    #######################################################################
    birth_place = d.get("place_of_birth")
    homepage = d.get("homepage")

    ext_ids = tperson.external_ids()  # social media adresses of person
    twitter = ext_ids.get("twitter_id")
    facebook = ext_ids.get("facebook_id")
    instagram = ext_ids.get("instagram_id")
    imdb = ext_ids.get("imdb_id")
    social = {str(key): key for key in [twitter,
                                        instagram, facebook, imdb] if key != None if key != ""}

    # poster path will save to person.data["tmdb_poster_path"]
    profile_path = d.get("profile_path")

    data = {}
    if profile_path:
        tmdb_poster_full_path = "https://image.tmdb.org/t/p/w185" + profile_path
        data.update({"tmdb_poster_path": tmdb_poster_full_path})

    data_objects = [social, birth_place, homepage]
    for datum in data_objects:
        if datum:
            data.update({str(datum): datum})

    person.data = data
    person.job = credit
    try:
        person.save()
        print("Done:(person details save)  Person {} was saved.".format(person.name))
        return person
    except:
        print("Error:(person details save)  Person {} could not be saved".format(
            person.name))


def fun(start, stop):
    liste = Movie.objects.filter(imdb_rating__gt=4).order_by("id")[start:stop]
    for movie in tqdm(liste):
        cast, crew = get_movie_credits(movie)

        movie.data.update({"cast": cast, "crew": crew})
        movie.save()
        print("{} cast & crew saved!!!".format(movie.name))
        if cast:
            actors = cast[:6]
            for actor in actors:
                try:
                    new_person = person_detail_save(credit="a", **actor)
                    if new_person:
                        add_person_poster(new_person)

                except:
                    print("actor could not add to persons or movie.actors")
        if crew:
            for staff in crew:
                if staff.get("job") == "Director":
                    new_person = person_detail_save(credit="d", **staff)
                    if new_person:
                        add_person_poster(new_person)

                elif staff.get("job") == "Editor":
                    new_person = person_detail_save(credit="e", **staff)
                    if new_person:
                        add_person_poster(new_person)

                elif staff.get("job") == "Director of Photography":
                    new_person = person_detail_save(credit="f", **staff)
                    if new_person:
                        add_person_poster(new_person)

                elif staff.get("job") == "Screenplay":
                    new_person = person_detail_save(credit="w", **staff)
                    if new_person:
                        add_person_poster(new_person)

    print("Movie:{} Crews Created".format(movie.name))


####################################################
person_dict = {}
file = "/home/jb/Documents/Database/person.pickle"
with open(file, "rb") as f:
    person_dict = pickle.load(f)

with open(file, "wb") as f:
    pickle.dump(person_dict, f)



def create_pickle_person(start, stop):
    from tqdm import tqdm
    from gql import tmdb_class as t
    import _pickle as pickle
    file = "/home/jb/Documents/Database/person.pickle"
    with open(file, "rb") as f:
        person_dict = pickle.load(f)

    num_of_dict = 0
    liste = Movie.objects.filter(imdb_rating__gt=4).order_by("id")[start: stop]
    for m in tqdm(liste):

        all_person = [x for x in m.data.get("cast")[:6] if m.data.get("cast")]

        crew = m.data.get("crew")
        if crew:
            for staff in crew:
                if staff.get("job") == "Director":
                    all_person.append(staff)

                elif staff.get("job") == "Editor":
                    all_person.append(staff)

                elif staff.get("job") == "Director of Photography":
                    all_person.append(staff)

                elif staff.get("job") == "Screenplay":
                    all_person.append(staff)

        for p in all_person:
            if person_dict.get(p.get("id")):
                continue

            tperson = t.Person(p.get("id"))
            d = tperson.details()
            ext_ids = tperson.external_ids()  # social media adresses of person

            id = d.get("imdb_id")
            tmdb_id = p.get("id")
            name = d.get("name")
            bio = d.get("biography")
            born = d.get("birthday")
            died = d.get("deathday")

            data = {}
            profile_path = d.get("profile_path")
            homepage = d.get("homepage")
            twitter = ext_ids.get("twitter_id")
            facebook = ext_ids.get("facebook_id")
            instagram = ext_ids.get("instagram_id")
            imdb = ext_ids.get("instagram_id")
            if profile_path:
                tmdb_poster_full_path = "https://image.tmdb.org/t/p/w185" + profile_path
                data.update({"tmdb_poster_path": tmdb_poster_full_path})
            if twitter != None or twitter != "":
                data.update({ "twitter": twitter })
            if instagram != None or instagram != "":
                data.update({ "instagram": instagram })
            if facebook != None or facebook != "":
                data.update({ "facebook": facebook })
            if homepage != None or homepage != "":
                data.update({ "homepage": homepage })

            person_dict.update({id: {"id": id, "tmdb_id": tmdb_id,
                                     "name": name, "bio": bio, "born": born, "died": died, "data": data}})

            num_of_dict += 1
            print("{}. Person ({}) was added! ".format(num_of_dict, name))

    with open(file, "wb") as f:
        pickle.dump(person_dict, f)
    print("pickle file was saved")


