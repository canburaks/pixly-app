from .models import Video, List, Movie,  Topic, Article, Rating, Prediction, Tag
from import_export import resources

class TagResource(resources.ModelResource):
    class Meta:
        model = Tag

class VideoResource(resources.ModelResource):
    class Meta:
        model = Video