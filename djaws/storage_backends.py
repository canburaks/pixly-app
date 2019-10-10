from storages.backends.s3boto3 import S3Boto3Storage

class MediaStorage(S3Boto3Storage):
    location = 'static/media'
    file_overwrite = True

class CacheStorage(S3Boto3Storage):
    location = 'static/media/CACHE'
    file_overwrite = True