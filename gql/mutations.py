from items.models import Movie, List, Video, Rating, Topic, Article
from persons.models import Director, Person
from persons.profile import Profile
from blog.models import Post
from pixly.models import Contact
from archive.models import UserArchive
from django.contrib.auth import get_user_model 
from django.contrib.auth.models import User 
from django_mysql.models import JSONField
from graphene_django.types import DjangoObjectType
from graphene_django.converter import convert_django_field
from django.core.cache import cache
import graphene
import graphql_jwt
from graphql_jwt.decorators import login_required
from django.views.decorators.csrf import csrf_exempt
#from background_task import background
from django.contrib.sitemaps import ping_google
from datetime import datetime, timezone
from .types import (VideoType, MovieType, ProfileType, PersonType,
        DirectorType, TopicType, ListType, UserType, RatingType,PostType )

@convert_django_field.register(JSONField)
def convert_json_field_to_string(field, registry=None):
    return graphene.String()



class BlogPostMutation(graphene.Mutation):
    post = graphene.Field(PostType)
    message = graphene.String()
    class Arguments:
        #will cache.set("dummy{dummy_id}", value[dummy_id], timeout=None)
        slug = graphene.String()
        text = graphene.String()

    def mutate(self, info, slug, text):
        if info.context.user.is_superuser:
            post_qs = Post.objects.filter(slug=slug)
            if post_qs.exists():
                post = post_qs.first()
                post.text = text
                post.save()
            return BlogPostMutation(post = post, message="Success")
        else:
            return BlogPostMutation(message="Not Authorized")




class ContactMutation(graphene.Mutation):
    status = graphene.Boolean()
    message = graphene.String()
    class Arguments:
        #will cache.set("dummy{dummy_id}", value[dummy_id], timeout=None)
        email = graphene.String()
        message = graphene.String()


    def mutate(self, info, email, message):
        ip = info.context.META.get('REMOTE_ADDR')
        print("contact mutation", email, message)
        now = datetime.now(timezone.utc)
        try:
            new_contact_message = Contact( email=email, 
                message=message, _message=message,
                ip=ip, created_at=now
            )
            profile_qs = Profile.objects.filter(email=email)
            if profile_qs.exists():
                new_contact_message.profile = profile_qs.first()
            #print(email, message)

            new_contact_message.save()
            return ContactMutation(message="Succesfully sent", status=True)
        except:
            return ContactMutation(message="Contact Mutation exception", status=False)




def string_to_date(text):
    from datetime import date
    elements = text.strip().split("-")
    print(elements)
    return date(int(elements[0]), int(elements[1]), int(elements[2]))

def cache_set_thread(**kwargs):
    key = list(kwargs.keys())[0]
    value = kwargs.get(key)
    from django.core.cache import cache
    response = cache.set(key, value, timeout=None)
    print(f"cache response:{response}")
    print("Cache thread is done.")

def scan_all_profiles_for_persona():
    print("<------------------------------------------------------------>")
    print("All profiles are scanning for persona object")
    num = 0
    for p in Profile.objects.all().only("ratings", "id", "username", "active"):
        if p.sync_active_status():
            p.sync_persona(full=True, create=True)
            num += 1
    print(f"{num} number of Profiles are synced with their persona objects.")
    print("<------------------------------------------------------------>")

class BackgroundTasks(graphene.Mutation):
    message = graphene.String()
    class Arguments:
        #will cache.set("dummy{dummy_id}", value[dummy_id], timeout=None)
        username = graphene.String()
    def mutate(self, info, username):
        """
        num = 0
        for p in Profile.objects.all().only("id", "ratings"):
            if len(p.ratings.keys())>=50:
                p.promote()
                num += 1
        """
        try:
            p = Profile.objects.get(username = username)
            p.promote()
        except:
            print("No profile found")
        return BackgroundTasks(message=f"Background Task is triggered. profile will be update")

class BackgroundCacheSet(graphene.Mutation):
    message = graphene.String()

    class Arguments:
        #will cache.set("dummy{dummy_id}", value[dummy_id], timeout=None)
        dummy_id = graphene.Int()

    def mutate(self, info, dummy_id):
        import threading
        import sys
        import math
        value = UserArchive.get_dummy_list_to_cache(part=dummy_id, min_points=30)
        print(f"value is brought. length:{len(value)}")
        if dummy_id==1:
            print("value is brought")
            t = threading.Thread(target=cache_set_thread, args=(), kwargs={"dummy1": value }, daemon=True)
            t.start()
        elif dummy_id==2:
            print("value is brought")
            t = threading.Thread(target=cache_set_thread, args=(), kwargs={"dummy2": value }, daemon=True)
            t.start()
        return BackgroundCacheSet(message=f"Background Task is triggered with dummy_id:{dummy_id}")


class Prediction(graphene.Mutation):
    prediction = graphene.Float()
    class Arguments:
        id = graphene.Int()

    def mutate(self,info,id):
        if info.context.user.is_authenticated:
            profile = info.context.user.profile
            if len(profile.ratings.items())<30:
                return Prediction(prediction=0)
            try:
                movie = Movie.objects.get(id=id)
                result = profile.predict(movie)
                return Prediction(prediction=result)
            except:
                return Prediction(prediction=0)

class Bookmark(graphene.Mutation):
    user = graphene.Field(UserType)
    movie = graphene.Field(MovieType)
    class Arguments:
        id = graphene.Int()
    def mutate(self,info,id):
        if info.context.user.is_authenticated:
            user = info.context.user
            profile = user.profile
            movie = Movie.objects.get(id=id)
            profile.bookmarking(movie)
            return Bookmark(user=user, movie=movie)

class Fav(graphene.Mutation):
    user = graphene.Field(UserType)
    video = graphene.Field(VideoType)
    movie = graphene.Field(MovieType)


    class Arguments:
        id = graphene.Int()
        type = graphene.String()
    def mutate(self,info,id, type):
        if info.context.user.is_authenticated:
            user = info.context.user
            profile = user.profile
            if type.lower().startswith("v"):
                video = Video.objects.get(id=id)
                profile.fav(video, type="video")
                return Fav(user=user, video=video)

            elif type.lower().startswith("m"):
                movie = Movie.objects.get(id=id)
                profile.fav(movie, type="movie")
                return Fav(user=user, movie=movie)

class Follow(graphene.Mutation):
    user = graphene.Field(UserType)
    target_profile = graphene.Field(ProfileType)
    person = graphene.Field(PersonType)
    liste = graphene.Field(ListType)
    topic = graphene.Field(TopicType)

    class Arguments:
        obj = graphene.String()
        id = graphene.String(required=False)
        username = graphene.String(required=None)

    def mutate(self,info, obj, id=None, username=None):
        print("followmutation:", obj)
        if info.context.user.is_authenticated:
            print("auth")
            user = info.context.user
            profile = user.profile
            if obj.startswith("p"):
                person = Person.objects.get(id=id)
                profile.follow_person(person)
                return Follow(user=user, person=person)

            elif obj.startswith("d"):
                person = Person.objects.get(id=id)
                profile.follow_person(person)
                return Follow(user=user, person=person)

            elif obj.startswith("l"):
                liste = List.objects.get(id=int(id))
                profile.follow_list(liste)
                return Follow(user=user, liste=liste)

            elif obj.startswith("t"):
                topic = Topic.objects.get(id=int(id))
                profile.follow_topic(topic)
                return Follow(user=user, topic=topic)

            elif obj.startswith("u"):
                target_profile = Profile.objects.get(username=username)
                profile.follow_profile(target_profile)
                return Follow(user=user, target_profile=target_profile)
        else:
            print("not auth")
            
class Rating(graphene.Mutation):
    user = graphene.Field(UserType)
    movie = graphene.Field(MovieType)
    rating = graphene.Field(RatingType)
    class Arguments:
        id = graphene.Int()
        rate = graphene.Float()
        date = graphene.String(required=False)
        notes = graphene.String(required=False)

    @csrf_exempt
    def mutate(self,info,id, rate, date=None, notes=None):
        if info.context.user.is_authenticated:
            user = info.context.user
            profile = user.profile
            movie = Movie.objects.get(id=id)
            print("gql",profile, movie)
            if date:
                profile.rate(movie, rate, notes=notes, date=string_to_date(date))
            else:
                profile.rate(movie, rate, notes=notes)
            rating = profile.rates.get(movie=movie)
            print(f"Profile Info: profile__id:{profile.id}, user__id:{user.username}, username:{profile.username}\n")
            print(f"Movie Info: id:{movie.id}, name:{movie.name}\n")
            print(f"Rating:{rate} \n\n")
            return Rating(user=user, movie=movie, rating=rating)


class RedisMutation(graphene.Mutation):
    message = graphene.String()
    class Arguments:
        key = graphene.String()
        value = graphene.String()
        timeout = graphene.Int()

    def mutate(self, info, key, value, timeout):
        import json
        res = cache.set(key, value, timeout=timeout)
        check = cache.get(key)
        message = f"cache response:{str(res)}, key:{key}={check}"
        return RedisMutation(message=message)
        


class Logout(graphene.Mutation):
    user = graphene.Field(UserType)
    message = graphene.String()
    def mutate(self, info):
        if info.context.user.is_authenticated:
            from django.contrib.auth import logout
            from persons.profile import LogEntry

            # CREATE LOGOUT ENTRY
            ip = info.context.META.get('REMOTE_ADDR')
            LogEntry.objects.create(action='user_logged_out', ip=ip, username=info.context.user.username)
            #print(LogEntry.objects.all().last())

            user = info.context.user
            logout(info.context)

        return Logout(message="Successfully logged out.")

class CreateUser(graphene.Mutation):
    user = graphene.Field(UserType)
    profile = graphene.Field(ProfileType)
    class Arguments:
        username = graphene.String(required=True)
        password = graphene.String(required=True)
        email = graphene.String(required=True)
        name = graphene.String(required=True)


    def mutate(self, info, username, password, email, name):
        from persons.profile import LogEntry
        if User.objects.filter(username__iexact=username).exclude(email=email).exists():
            raise ValidationError('This username has already been taken!')
        user = get_user_model()(
            username=username,
            email=email,
        )

        user.set_password(password)
        user.save()
        profile = user.profile
        profile.name = name
        profile.email = email
        profile.save()

        # CREATE LOG ENTRY
        ip = info.context.META.get('REMOTE_ADDR')
        LogEntry.objects.create(action='user_created_in', ip=ip, username=info.context.user.username)
        
        #token_auth = graphql_jwt.ObtainJSONWebToken.Field()
        #token = graphql_jwt.shortcuts.get_token(user)
        return CreateUser(user=user, profile=profile)

class UsernameValidation(graphene.Mutation):
    is_valid = graphene.Boolean()
    message = graphene.String()
    class Arguments:
        username = graphene.String(required=True)
    
    def mutate(self, info, username):
        forbid = ["/", "\ ",  "~", ">", "<", "-", ".", ":", ";", "?", "&", "%", "^", "@"]
        forbid_message = " ".join(forbid)
        username = username.strip()
        if len(username.split(" "))>1:
            return EmailValidation(is_valid=False, 
                        message="You can not use space in username")  
        for f in forbid:
            if f in username:
                return UsernameValidation(is_valid=False, 
                        message="You can not use these characters as username: {}".format(forbid_message))
        #check minimum 4 characters
        if len(username)<4 or len(username)>12:
            return UsernameValidation(is_valid=False, 
                    message="Username can be minimum 4, maxiumum 12 characters")
        #check username exists
        if User.objects.filter(username__iexact=username).exists():
            return UsernameValidation(is_valid=False, message="Username has already taken. Choose another.")
        #otherwise return True
        elif not User.objects.filter(username__iexact=username).exists():
            return UsernameValidation(is_valid=True, message="OK")

class EmailValidation(graphene.Mutation):
    is_valid = graphene.Boolean()
    message = graphene.String()
    class Arguments:
        email = graphene.String(required=True)
    
    def mutate(self, info, email):
        forbid = ["/", "\ ", "~", ">",  ":", ";", "?", "&", "%", "^"]
        forbid_message = " ".join(forbid)
        email=email.strip()
        #check whitespace
        if len(email.split(" "))>1:
            return EmailValidation(is_valid=False, 
                        message="You can not use space in email")
        #check forbid charqacters
        for f in forbid:
            if f in email:
                return EmailValidation(is_valid=False, 
                        message="You can not use these characters in email: {}".format(forbid_message))
        #check @ and dot in mail
        if not "@" in email or not "."  in email:
            return EmailValidation(is_valid=False, message="Please enter a valid email adress.")
        
        #check minimum 4 characters
        if len(email)<4:
            return EmailValidation(is_valid=False, 
                    message="email can be minimum 4 characters.")
        #check username exists
        if User.objects.filter(email__iexact=email).exists():
            return EmailValidation(is_valid=False, message="Email has already used. Choose another.")
        #otherwise return True
        elif not User.objects.filter(email__iexact=email).exists():
            return EmailValidation(is_valid=True, message="OK")

class ObtainJSONWebToken(graphql_jwt.JSONWebTokenMutation):
    user = graphene.Field(UserType)

    @classmethod
    def resolve(cls, root, info):
        from persons.profile import LogEntry
        #print("JSON TOKEN", root)
        #CREATE LOG ENTRY
        ip = info.context.META.get('REMOTE_ADDR')
        LogEntry.objects.create(action='user_logged_in', ip=ip, username=info.context.user.username)
        
        return cls(user=info.context.user)



"""
class RedisMutation(graphene.Mutation):
    result = graphene.String()
    class Arguments:
        start = graphene.Int()
        stop = graphene.Int()

    def mutate(self, info, start, stop):
        from algorithm.models import redis_setter
        result = redis_setter(start,stop)
        
        return RedisMutation(result=result)


class DummyMutation(graphene.Mutation):
    message = graphene.String()

    def mutate(self, info):
        from archive.models import UserArchive
        import json
        import sys
        paket = UserArchive.get_dummy_list_to_cache(20)
        print("paket has been received")
        print(f"paket length:{len(paket)}")
        print(f"paket size:{sys.getsizeof(paket)}")

        jbl = Person.objects.get(id="nm9786594")
        jbl.data["paket"] = paket
        jbl.save()
        print("paket saved to jbl data")
        print("starting to set cache")
        resp = cache.set("dummy", paket, timeout=None)
        print("cache finished")
        print("response", resp)
        return DummyMutation(message="Done")




"""