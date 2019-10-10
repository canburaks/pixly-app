from storages.backends.s3boto3 import S3Boto3Storage
from django.contrib.staticfiles import storage

class MediaStorage(S3Boto3Storage):
    location = 'static/media'
    file_overwrite = True

class CacheStorage(S3Boto3Storage):
    location = 'static/media/CACHE'
    file_overwrite = True

class FrontendStorage(storage.StaticFilesStorage):
    location = '_FRONTEND/build'
    file_overwrite = False