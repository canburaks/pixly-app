from persons.profile import Profile, Follow
from items.models import Movie, List,  Video, Rating, Topic, Article
from persons.models import Director, Person
from persons.profile import Profile

from django.contrib.auth import get_user_model
from django_mysql.models import JSONField
from graphene_django.types import DjangoObjectType
from graphene_django.converter import convert_django_field
from django.views.decorators.csrf import csrf_exempt

import graphene
import graphql_jwt
from graphql_jwt.decorators import login_required
from graphene_file_upload.scalars import Upload

from .types import (VideoType, MovieType, ProfileType, PersonType,CustomListType,
        DirectorType, TopicType, ListType, UserType, RatingType)

@convert_django_field.register(JSONField)
def convert_json_field_to_string(field, registry=None):
    return graphene.String()

def avatar_upload_path(instance, filename):
    return "avatars/{0}/{1}".format(instance.id,filename)

    

class UploadAvatar(graphene.Mutation):
    success = graphene.Boolean()
    profile = graphene.Field(ProfileType)

    class Arguments:
        file = Upload(required=True)

    @csrf_exempt
    def mutate(self, info, **kwargs):
        from gql.functions import url_image, get_poster_url
        from django.core import files
        from io import BytesIO
        from PIL import Image
        if info.context.user.is_authenticated:
            profile = info.context.user.profile
            file = info.context.FILES.get("1")
            print("context files" ,info.context.FILES)
            if file._size>3500000:
                return UploadAvatar(success=False, profile=profile)
            print("file", file.__dict__)
            file_content_type=file.content_type.split("/")[1]

            if file_content_type=="png":
                file_type="PNG"
            else:
                file_type="JPEG"
            print(file_type)
            #Create BytesIO object for saving Pillow image to there
            FileIO = BytesIO()
            #Open image  with Pillow for reducing quality
            pil = Image.open(file.file)
            #Save image to BytesIO 
            pil.save(FileIO, file_type, quality=40, optimize=True)

            profile.avatar.save(file._name, files.File(FileIO))
            print("avatar saved")
            return UploadAvatar(success=True, profile=profile)
        else:
            return UploadAvatar(success=False)
        # do something with your file


class ProfileInfo(graphene.Mutation):
    profile = graphene.Field(ProfileType)

    class Arguments:
        username = graphene.String(required=True) #for check
        name = graphene.String(required=False)
        bio = graphene.String(required=False)
        country = graphene.String(required=False)

    @csrf_exempt
    def mutate(self,info,username, name, bio, country):
        if info.context.user.is_authenticated:
            user = info.context.user
            if user.profile.username==username:
                profile = Profile.objects.get(username=username)
                entries = {"name":name, "bio":bio, "country":country }
                print("manual", name, bio, country)
                for entry_name in entries.keys():
                    entry = entries.get(entry_name)
                    if entry_name=="name" and entry!=None:
                        print("entry", entry)
                        profile.name = entry
                    elif entry_name=="bio" and entry!=None:
                        print("entry", entry)
                        profile.bio = entry
                    elif entry_name=="country" and entry!=None:
                        print("entry", entry)
                        if len(entry)==2:
                            profile.country = entry.upper()
                profile.save()
                return ProfileInfo(profile=profile)
            else:
                raise Exception("Not the owner of profile")
        else:
            raise Exception("User is not authorized. Please login again!")

class UpdateList(graphene.Mutation):
    profile = graphene.Field(ProfileType)
    liste = graphene.Field(ListType)
    message = graphene.String()

    class Arguments:
        name = graphene.String(required=True)
        summary = graphene.String(required=False)
        movie_ids = graphene.List( graphene.Int ,required=True)
        liste_id = graphene.Int(required=True)
    
    @csrf_exempt
    def mutate(self, info, movie_ids, liste_id ,name, summary):
        if info.context.user.is_authenticated:
            user = info.context.user
            profile = user.profile
            target_list = List.objects.select_related("owner").only("id","owner", "name").get(id=liste_id)
            if target_list.owner==profile:
                target_movies_qs = Movie.objects.filter(id__in=movie_ids).only("id", "name", "year", "poster")
                #Add movies to list
                target_list.movies.clear()
                target_list.movies.add(*target_movies_qs)
                #change list name first check if name was changed, then check unique name
                if target_list.name!=name:
                    if List.objects.filter(name=name).exists():
                        raise Exception("Choose another name for the list")
                    else:
                        target_list.name = name
                target_list.summary = summary
                target_list.save()
                return UpdateList(
                        liste=target_list, profile=profile, message="Movies was added.")
            else:
                raise Exception("You are not the owner of the list")
        else:
            raise Exception("Please login again.")

class CreateList(graphene.Mutation):
    profile = graphene.Field(ProfileType)
    liste = graphene.Field(ListType)
    message = graphene.String()

    class Arguments:
        name = graphene.String(required=True)
        summary = graphene.String(required=False)
        public = graphene.Boolean(required=False)
    
    @csrf_exempt
    def mutate(self, info, name, public=True, summary=None):
        if info.context.user.is_authenticated:
            if List.objects.filter(name=name).exists():
                raise Exception("Choose another name for the list")
            user = info.context.user
            profile = user.profile
            new_list_id = List.autokey()
            try:
                new_list = List(id=new_list_id, name=name,
                    summary=summary, owner=profile, public=public)
                new_list.save()
                return CreateList(profile=profile, liste=new_list,
                    message="List successfully created" )
            except:
                try:
                    incremented_id = new_list_id + 1
                    new_list = List(id=incremented_id, name=name,
                        summary=summary, owner=profile, public=public)
                    new_list.save()
                    return CreateList(profile=profile, liste=new_list, message="List successfully created")
                except:
                    raise Exception("List was not create, check list id")

class DeleteList(graphene.Mutation):
    profile = graphene.Field(ProfileType)
    message = graphene.String()
    class Arguments:
        id = graphene.Int(required=True)

    @csrf_exempt
    def mutate(self, info, id):
        if info.context.user.is_authenticated:
            user = info.context.user
            profile = user.profile

            target_list = List.objects.get(id=id)
            if target_list.owner==profile:
                target_list.delete()
                return DeleteList(profile=profile, message="List successfully deleted.")
            else:
                raise Exception("You are not the owner")
        else:
            raise Exception("Please Login")

class AddMovie(graphene.Mutation):
    profile = graphene.Field(ProfileType)
    movie = graphene.Field(MovieType)
    liste = graphene.Field(ListType)
    message= graphene.String()
    class Arguments:
        movie_id = graphene.Int(required=True)
        liste_id = graphene.Int(required=True)

    @csrf_exempt
    def mutate(self, info, movie_id, liste_id):
        if info.context.user.is_authenticated:
            user = info.context.user
            profile = user.profile
            target_list = List.objects.select_related("owner").only("id","owner","public").get(id=liste_id)
            if target_list.owner==profile:
                target_movie = Movie.objects.only("id").get(id=movie_id)
                target_list.movies.add(target_movie)
                return AddMovie(movie=target_movie, liste=target_list,profile=profile, message="Movie was added.")
            else:
                raise Exception("You are not the owner of the list")
        else:
            raise Exception("Please login again.")

class AddMovies(graphene.Mutation):
    profile = graphene.Field(ProfileType)
    liste = graphene.Field(ListType)
    movies = graphene.List(MovieType)

    message= graphene.String()
    class Arguments:
        movie_ids = graphene.List( graphene.Int ,required=True)
        liste_id = graphene.Int(required=True)

    @csrf_exempt
    def mutate(self, info, movie_ids, liste_id):
        if info.context.user.is_authenticated:
            user = info.context.user
            profile = user.profile
            target_list = List.objects.select_related("owner").only("id","owner", "name").get(id=liste_id)
            if target_list.owner==profile:
                target_movies_qs = Movie.objects.filter(id__in=movie_ids).only("id", "name", "year", "poster")
                for target_movie in target_movies_qs:
                    target_list.movies.add(target_movie)
                    
                return AddMovies(movies=target_movies_qs, liste=target_list, profile=profile, message="Movies was added.")
            else:
                raise Exception("You are not the owner of the list")
        else:
            raise Exception("Please login again.")

#Remove single movie
class RemoveMovie(graphene.Mutation):
    profile = graphene.Field(ProfileType)
    movie = graphene.Field(MovieType)
    liste = graphene.Field(ListType)
    message= graphene.String()
    class Arguments:
        movie_id = graphene.Int(required=True)
        liste_id = graphene.Int(required=True)

    @csrf_exempt
    def mutate(self, info, movie_id, liste_id):
        if info.context.user.is_authenticated:
            user = info.context.user
            profile = user.profile
            target_list = List.objects.select_related("owner").prefetch_related("movies").only("id","owner","movies").get(id=liste_id)
            if target_list.owner==profile:
                target_movie = Movie.objects.only("id").get(id=movie_id)
                target_list.movies.remove(target_movie)
                return RemoveMovie(liste=target_list,profile=profile, message="Movie was removed.")
            else:
                raise Exception("You are not the owner of the list")
        else:
            raise Exception("Please login again.")

#Remove List of movies
class RemoveMovies(graphene.Mutation):
    profile = graphene.Field(ProfileType)
    movies = graphene.List(MovieType)
    liste = graphene.Field(ListType)
    message= graphene.String()
    class Arguments:
        movie_ids = graphene.List(graphene.Int, required=True)
        liste_id = graphene.Int(required=True)

    @csrf_exempt
    def mutate(self, info, movie_ids, liste_id):
        if info.context.user.is_authenticated:
            user = info.context.user
            profile = user.profile
            target_list = List.objects.select_related("owner").prefetch_related("movies").only("id","owner","movies").get(id=liste_id)
            if target_list.owner==profile:
                target_movies = Movie.objects.only("id").filter(id__in=movie_ids)
                target_list.movies.remove(*target_movies)
                return RemoveMovie(liste=target_list,profile=profile, message="List of Movies were removed.")
            else:
                raise Exception("You are not the owner of the list")
        else:
            raise Exception("Please login again.")