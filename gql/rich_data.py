from django.conf import settings
from items.models import Rating,Movie, List,  Video, Tag, Topic
from persons.models import Person, Director, Crew
from persons.profile import Profile
from pprint import pprint
import json


#p = Person.objects.get(id="nm0000464")

def sanitize(text):
    if (not '"' in text) and ("'" not in text):
        return text
    text = text.replace('\'', ' ')
    text = text.replace('\"', ' ')
    text = text.replace('"', ' ')
    text = text.replace("'", ' ')
    return text

class RichData:
    
    @classmethod
    def create_identifier(cls, key, value):
        return {"@type": "PropertyValue", "propertyID": key, "value": value}
    

    @classmethod
    def create_mini_thumbnail(cls, url):
        thumb_data = {"@type": "ImageObject", "contentUrl": url}
        return thumb_data
    
    @classmethod
    def create_mini_person(cls, person):
        person_data = {"@type": "Person"}
        person_data["url"] = f"https://pixly.app/person/{person.slug}"
        person_data["name"] = person.name

        # Identifier
        person_data["identifier"] = cls.create_identifier("IMDB_ID", person.id)

        # SameAs
        if person.wiki:
            person_data["sameAs"] = person.wiki
        elif person.imdb:
            person_data["sameAs"] = person.imdb
        return person_data
    
    @classmethod
    def create_mini_video(cls, video, description=None):
        video_data = {"@type": "VideoObject"}
        video_data["name"] = video.title
        video_data["embedUrl"] = video.link
        video_data["uploadDate"] = video.created_at.isoformat()
        if video.thumbnail:
            video_data["thumbnailUrl"] = video.thumbnail
            video_data["thumbnail"] = cls.create_mini_thumbnail(video.thumbnail)
        else:
            thumb_url = f"https://img.youtube.com/vi/{video.youtube_id}/mqdefault.jpg"
            video_data["thumbnailUrl"] = thumb_url
            video_data["thumbnail"] = cls.create_mini_thumbnail(thumb_url)
        video_data["description"] = description if description else video.title
        return video_data

    @classmethod
    def create_mini_movie(cls, movie, parent_url = None):
        #movie_data = {"@type": "Movie", "name":f"{movie.name}", "@id":f"{movie.id}"}
        
        movie_data = {"name":f"{movie.name}", "@id":f"{movie.id}"} #for ListItem-Movie type

        if parent_url:
            movie_data["url"] = parent_url
            movie_data["@id"] = parent_url

        else:
            movie_data["url"] = f"https://pixly.app/movie/{movie.slug}"
            movie_data["@id"] = f"https://pixly.app/movie/{movie.slug}"
            
        # Identifier
        if movie.imdb_id:
            movie_data["identifier"] = cls.create_identifier("IMDB_ID", movie.imdb_id)

        # SameAs
        if movie.wiki:
            movie_data["sameAs"] = movie.wiki
        elif movie.imdb:
            movie_data["sameAs"] = movie.imdb

        # Image
        if movie.poster != None and movie.poster != "":
            movie_data["image"] = movie.poster.url

        # DateCreated
        movie_data["dateCreated"] = f"{movie.year}"

        # Director
        dqs = Crew.objects.filter(job="d", movie=movie).select_related("person")
        if dqs.exists():
            director_list = [cls.create_mini_person(x.person) for x in dqs]
            movie_data["director"] = director_list if len(director_list) > 1 else director_list[0]

        return movie_data




    @classmethod
    def create_movie_list_data(cls, liste):
        template = {"@context": "http://schema.org", "@type": ["ItemList", "CreativeWork"]}
        all_m = liste.movies.all().only("id","imdb_id", "name", "slug", "imdb", "wiki", "imdb_rating").order_by("-imdb_rating")[:20]

        #----- Creation of rich data-------------------->
        liste_url = f"https://pixly.app/list/{liste.slug}/1"
        template["url"] = liste_url
        #print(liste.name)
        #print(sanitize(liste.name))
        template["name"] = sanitize(liste.name)

        if len(liste.summary) < 300:
            template["description"] = sanitize(liste.summary)
        elif len(liste.summary) > 300 and liste.seo_short_description and len(liste.seo_short_description) > 20:
            template["description"] = sanitize(liste.seo_short_description)
        else:
            template["description"] = sanitize(liste.name)


        template["author"] = {"@type": "Person",  "url":"https://pixly.app/user/canburaks", "name":"Can Burak Sofyalioglu"}

        
        # Image
        if liste.cover_poster != None and liste.cover_poster != "":
            liste_image = liste.cover_poster.url
        else:
            liste_image = liste.single_image
        template["image"] = liste_image


        # About
        about_data = {
            "@type": ["Movie", "ItemList"],
            "name": sanitize(liste.name),
            "image": liste_image,
            "dateCreated": liste.created_at.isoformat()
            }
        if liste.list_type == "df" and liste.related_persons.all().count() > 0:
            director_person = liste.related_persons.all().first()
            about_data["director"] = cls.create_mini_person(director_person)
        template["about"] = about_data 
        
        # DateCreation
        #template["dateCreated"] = liste.created_at.isoformat()

        # Order
        template["itemListOrder"] = "ItemListUnordered"
        
        # Item Quantity
        template["numberOfItems"] = all_m.count()

        # List Items
        list_items = []
        template["itemListElement"] = list_items
        for i in range(all_m.count()):
            movie = all_m[i]
            #item_data = {"@type": "ListItem", "name": f"{movie.name}",  "position":i}
            item_data = {"@type": ["ListItem", "Movie"], "url": f"https://pixly.app/movie/{movie.slug}",  "position":i, **cls.create_mini_movie(movie)}


            #item_data["item"] = cls.create_mini_movie(movie)
            #item_data["item"] = cls.create_mini_movie(movie, parent_url = liste_url)
            list_items.append(item_data)

        template["itemListElement"] = list_items
        #pprint(template)
        return template

    @classmethod
    def create_topic_data(cls, topic):
        template = {"@context": "http://schema.org", "@type": ["ItemList", "CreativeWork"]}
        all_topics = topic.movies.all().only("id","imdb_id", "name", "slug", "imdb", "wiki", "imdb_rating").order_by("-imdb_rating")[:20]

        #----- Creation of rich data-------------------->
        topic_url = f"https://pixly.app/topic/{topic.slug}"
        template["url"] = topic_url
        #print(liste.name)
        #print(sanitize(liste.name))
        template["name"] = sanitize(topic.seo_title)
        template["description"] = sanitize(topic.seo_description)


        template["author"] = {"@type": "Person",  "url":"https://pixly.app/user/canburaks", "name":"Can Burak Sofyalioglu"}

        
        # Image
        if topic.cover_poster != None and topic.cover_poster != "":
            topic_image = topic.cover_poster.url
            template["image"] = topic_image
        else:
            topic_image = topic.movies.first().cover_poster.url

        # About
        about_data = {
            "@type": ["Movie", "ItemList"],
            "name": sanitize(topic.name),
            "image": topic_image,
            "dateCreated": topic.created_at.isoformat()
            }
        template["about"] = about_data 
        
        # DateCreation
        #template["dateCreated"] = liste.created_at.isoformat()

        # Order
        template["itemListOrder"] = "ItemListUnordered"
        
        # Item Quantity
        template["numberOfItems"] = all_topics.count()

        # List Items
        topic_items = []
        template["itemListElement"] = topic_items
        for i in range(all_topics.count()):
            movie = all_topics[i]
            #item_data = {"@type": "ListItem", "name": f"{movie.name}",  "position":i}
            item_data = {"@type": ["ListItem", "Movie"], "url": f"https://pixly.app/movie/{movie.slug}",  "position":i, **cls.create_mini_movie(movie)}


            #item_data["item"] = cls.create_mini_movie(movie)
            #item_data["item"] = cls.create_mini_movie(movie, parent_url = liste_url)
            topic_items.append(item_data)

        template["itemListElement"] = topic_items
        #pprint(template)
        return template
    @classmethod
    def create_person_data(cls, person):
        template = {"@context": "http://schema.org"}
        all_crews = Crew.objects.filter(person=person).only("job")

        #----- Creation of rich data-------------------->
        template["@type"] = "Person"
        template["url"] = f"https://pixly.app/person/{person.slug}"
        template["name"] = f"{person.name}"
        template["identifier"] = cls.create_identifier("IMDB_ID", person.id)
        # SameAs
        if person.wiki:
            template["sameAs"] = person.wiki
        elif person.imdb:
            template["sameAs"] = person.imdb
        # Image
        if person.poster != None and person.poster != "":
            template["image"] = f"{person.poster.url}"
        
        # JobTitle
        if all_crews.count() > 0:
            job_list = []
            if all_crews.filter(job="d").count() > 0:
                job_list.append("Director")
            if all_crews.filter(job="a").count() > 0:
                job_list.append("Actor")
            if all_crews.filter(job="w").count() > 0:
                job_list.append("Writer")
            template["jobTitle"] = job_list if len(job_list) > 1 else job_list
        
        #Description - Bio
        if person.seo_short_description:
            template["description"] = sanitize(person.seo_short_description)
        elif person.bio and len(person.bio) > 20:
            text = person.bio[:200] + "..." if len(person.bio) > 200 else person.bio[:200]
            template["description"] = sanitize(text)

        # Birthdate
        if person.born:
            template["birthDate"] = person.born.__str__()
        
        # Died
        if person.died:
            template["deathDate"] = person.died.__str__()
        
        return template


    @classmethod
    def create_movie_data(cls, movie):
        template = {"@context": "http://schema.org"}
        #--------movie data----------------------------->
        all_tags = movie.tags.all().only("name", "slug", "tag_type")
        all_crews = Crew.objects.filter(movie=movie).select_related("person").only(
            "movie__id","person__id", "person__name", "person__slug", "job")
        all_videos = movie.videos.all().prefetch_related("tags").only(
                "title","link","youtube_id","thumbnail" )
        #----------------------------------------------->
        #----- Creation of rich data-------------------->
        template["@type"] = "Movie"
        template["url"] = f"https://pixly.app/movie/{movie.slug}"
        template["name"] = f"{movie.name}"

        # SameAs
        if movie.wiki:
            template["sameAs"] = movie.wiki
        elif movie.imdb:
            template["sameAs"] = movie.imdb

        # Identifier
        if movie.imdb_id:
            template["identifier"] = cls.create_identifier("IMDB_ID", movie.imdb_id)

        # Image
        if movie.poster != None and movie.poster != "":
            template["image"] = f"{movie.poster.url}"
        
        # Genre
        if all_tags.filter(tag_type="genre").count() > 0:
            genres = [x.name.capitalize() for x in all_tags.filter(tag_type="genre")]
            template["genre"] = genres
        
        # Actors & Characters & Director
        if all_crews.count() > 0: 
            # Actor
            actors = all_crews.filter(job="a")
            if actors.count() > 0:
                template["actor"] = [cls.create_mini_person(x.person) for x in actors ]
                #Characters
                chars = actors.filter(character__isnull = False)
                template["character"] = [{ **cls.create_mini_person(x.person),
                        "name":f"{x.character} ({x.person.name})" } for x in chars ]
            # Director
            if all_crews.filter(job="d").count() > 0:
                directors = all_crews.filter(job="d")
                director_list = [cls.create_mini_person(x.person) for x in directors]
                template["director"] = director_list if len(director_list) > 1 else director_list[0]
        


        # DatePublished
        if movie.year:
            template["datePublished"] = f"{movie.year}"
        
        # Date Modified
        if movie.updated_at:
            template["dateModified"] = movie.updated_at.isoformat()


        # Description (movie.seo_short_description)
        if movie.seo_short_description and len(movie.seo_short_description) > 20:
            clean_text = sanitize(movie.seo_short_description)
            template["description"] = clean_text
        elif movie.summary:
            text = movie.summary[:250] + "..." if len(movie.summary) >250 else movie.summary[:250]
            template["description"] = sanitize(text)
        elif not movie.summary and movie.data.get("Plot") != None:
            text = movie.data.get("Plot")[:250] + "..." if len(movie.data.get("Plot")) >250 else movie.data.get("Plot")[:200]
            template["description"] = sanitize(text)

        
        # Keywords
        if all_tags.filter(tag_type="content").count() > 0:
            keywords = [x.name for x in all_tags.filter(tag_type="content")]
            template["keywords"] = ", ".join(keywords)
        
        # Author Can Burak Sofyalioglu
        template["author"] = {"@type": "Person",  "url":"https://pixly.app/user/canburaks", "name":"Can Burak Sofyalioglu"}
        
        # Duration
        if (movie.data.get("Runtime") is not None) and (movie.data.get("Runtime") != "N/A"):
            try:
                minutes = movie.data.get("Runtime").split(" ")[0]
                minutes_num = int(minutes)
                hour = minutes_num // 60
                minutes_remainder = minutes_num % 60
                template["duration"] = f"PT{hour}H{minutes_remainder}M"
            except:
                print("error in setting duration to rich data template")
        elif (movie.data.get("runtime") is not None) and (movie.data.get("runtime") != "N/A"):
            try:
                minutes = movie.data.get("runtime")
                minutes_num = int(minutes)
                hour = minutes_num // 60
                minutes_remainder = minutes_num % 60
                template["duration"] = f"PT{hour}H{minutes_remainder}M"
            except:
                print("error in setting duration to rich data template")
        
        # Video-Trailer
        if all_videos.count() > 0:
            video_list = []
            for video in all_videos:
                video_tags = video.tags.values_list("name", flat=True)
                if "trailer" in video_tags:
                    trailer_object = cls.create_mini_video(video)
                    video_list.append(trailer_object)
            if len(video_list) == 1:
                template["trailer"] = video_list[0]
            elif len(video_list) > 1:
                template["trailer"] = video_list
        return template

""


#mat = Movie.objects.get(id=2571)
#RichData.create_movie_data(mat)



"""
{"@context": "http://schema.org", "@type": "Movie", "url": "/movie/the-matrix-1999", "name": "The Matrix", "image": "https://cbs-static.s3.amazonaws.com/static/media/posters/2571/2571-tmdb.jpg", "genre": ["Action", "Drama", "Fantasy", "Futuristic", "Post apocalyptic", "Science fiction", "Surreal", "Thought-provoking", "Epic"], "actor": [{"@type": "Person", "url": "/person/keanu-reeves-6384", "name": "Keanu Reeves"}, {"@type": "Person", "url": "/person/laurence-fishburne-2975", "name": "Laurence Fishburne"}, {"@type": "Person", "url": "/person/carrie-anne-moss-530", "name": "Carrie-Anne Moss"}, {"@type": "Person", "url": "/person/hugo-weaving-1331", "name": "Hugo Weaving"}, {"@type": "Person", "url": "/person/joe-pantoliano-532", "name": "Joe Pantoliano"}, {"@type": "Person", "url": "/person/gloria-foster", "name": "Gloria Foster"}, {"@type": "Person", "url": "/person/marcus-chong", "name": "Marcus Chong"}, {"@type": "Person", "url": "/person/paul-goddard", "name": "Paul Goddard"}], "director": [{"@type": "Person", "url": "/person/lana-wachowski-9340", "name": "Lana Wachowski"}, {"@type": "Person", "url": "/person/lilly-wachowski", "name": "Lilly Wachowski"}], "datePublished": "1999", "description": "A computer hacker learns from mysterious rebels about the true nature of his reality and his role in the war against its controllers.", "keywords": "alternate reality, complicated plot, cyberpunk, destiny, dialogue, dystopia, fighting the system, hacking, life philosophy, martial arts, mindfuck, mythology, powerful ending, dark hero, imagination, revolution", "author": {"@type": "Person", "url": "/user/canburaks", "name": "Can Burak Sofyalioglu"}, "duration": "PT2H16M", "trailer": [{"@type": "VideoObject", "name": "The Matrix  - Trailer", "embdedUrl": "https://www.youtube.com/watch?v=S6EnMVtaC3A", "thumbnail": {"@type": "ImageObject", "contentUrl": "https://img.youtube.com/vi/S6EnMVtaC3A/mqdefault.jpg"}}, {"@type": "VideoObject", "name": "Matrix Trailer HD (1999)", "embdedUrl": "https://www.youtube.com/watch?v=m8e-FF8MsqU", "thumbnail": {"@type": "ImageObject", "contentUrl": "https://img.youtube.com/vi/m8e-FF8MsqU/mqdefault.jpg"}}]}
"""