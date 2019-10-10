"""
Django settings for djaws project.

Generated by 'django-admin startproject' using Django 2.0.5.

For more information on this file, see
https://docs.djangoproject.com/en/2.0/topics/settings/

For the full list of settings and their values, see
https://docs.djangoproject.com/en/2.0/ref/settings/
"""
#import pymysql
#pymysql.install_as_MySQLdb()
import os
#from djaws import cognito

import environ
env = environ.Env(
    # set casting, default value
    DEBUG=(bool, True)
)
# reading .env file
environ.Env.read_env()

# Build paths inside the project like this: os.path.join(BASE_DIR, ...)
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
_FRONTEND =os.path.join(os.path.join(BASE_DIR, '_FRONTEND'),)

SECRET_KEY = env('SECRET_KEY')
DEBUG = True

#GLOBAL VARIABLES
PER_PAGE_ITEM = 24
BRAND_IMAGE = "https://cbs-static.s3.eu-west-2.amazonaws.com/static/images/pixly-wide-zip.jpg"
LIST_MIN_SUMMARY = 200

#HOST_SCHEME                     = "https://pixly.app"
"""
SECURE_REDIRECT_EXEMPT = ['ads.txt']
SECURE_PROXY_SSL_HEADER         = ('HTTP_X_FORWARDED_PROTO', 'https')
CORS_REPLACE_HTTPS_REFERER      = True
SECURE_SSL_REDIRECT             = True
SESSION_COOKIE_SECURE           = True
CSRF_COOKIE_SECURE              = True
SECURE_HSTS_PRELOAD             = True
SECURE_HSTS_INCLUDE_SUBDOMAINS  = True
SECURE_HSTS_SECONDS             = 1000000
SECURE_FRAME_DENY               = True

SECURE_CONTENT_TYPE_NOSNIFF     = True
SECURE_BROWSER_XSS_FILTER       = True
X_FRAME_OPTIONS                 = 'DENY'

"""

# SECURITY WARNING: don't run with debug turned on in production!
#SITE_ID=2
ALLOWED_HOSTS = ["*",
    'http://127.0.0.1:8000',
    'http://127.0.0.1:8000',
    "https://pixly.app/*",
    "http://pixly.app/*",
    "http://www.pixly.app/*",
    "https://pixly.app/graphql",
    "https://playthough.com/",
    "https://playthough.com/graphql",
    "http://playthough.com",
    'http://localhost:3000',
    'http://127.0.0.1:3000',
    ]

#INTERNAL_IPS = ('127.0.0.1')
# Application definition
import datetime
INSTALLED_APPS = [
    'grappelli',
    'filebrowser',
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    #'debug_toolbar',
    'django.contrib.sites', # new
    'django.contrib.sitemaps',

    'django_mysql',
    "django_extensions",
    'graphene_django',
    #'background_task',

    "items",
    "persons",
    #"algorithm",
    "gql",
    "archive",
    "persona",
    "blog",
    'pixly',

    'django_hosts',
    'corsheaders',
    "storages",
    "imagekit",
    'import_export',
    "django_countries",
    "ckeditor",
    "ckeditor_uploader",
    'django_filters',
]
SITE_ID=2

#CORS_ORIGIN_ALLOW_ALL = True
CORS_ORIGIN_WHITELIST = (
    '*',
    'http://localhost:3000',
    'http://127.0.0.1:3000',
    'http://127.0.0.1:8000',
    #"http://playthough.com/*",
    "https://pixly.app/",
    "https://wwww.pixly.app/",
    "https://blog.pixly.app/"
    "https://pixly.app/graphql",
    )

MIDDLEWARE = [
    'django_brotli.middleware.BrotliMiddleware',
    'django_hosts.middleware.HostsRequestMiddleware',   #for subdomain
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    #'debug_toolbar.middleware.DebugToolbarMiddleware',
    'graphql_jwt.middleware.JSONWebTokenMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
    'django_hosts.middleware.HostsResponseMiddleware'   #for subdomain
]
CORS_ALLOW_CREDENTIALS = True
CORS_ORIGIN_ALLOW_ALL = True

ROOT_URLCONF = 'djaws.urls'
ROOT_HOSTCONF = 'djaws.hosts'
DEFAULT_HOST = "default"

AUTHENTICATION_BACKENDS = [
    'graphql_jwt.backends.JSONWebTokenBackend',
    'django.contrib.auth.backends.ModelBackend',
]
JWT_VERIFY_EXPIRATION=True
JWT_REFRESH_EXPIRATION_DELTA=3
JWT_EXPIRATION_DELTA=3600*24

GRAPHENE = {
    'SCHEMA': 'gql.schema.schema', # Where your Graphene schema lives
    'MIDDLEWARE': (
        'graphene_django.debug.DjangoDebugMiddleware',
        'graphql_jwt.middleware.JSONWebTokenMiddleware',
    )
}

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': (os.path.join(_FRONTEND,"build"), os.path.join(BASE_DIR, 'templates'),),
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',

            ],
        },
    },
]

WSGI_APPLICATION = 'djaws.wsgi.application'

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.mysql',
        "HOST": env('DB_HOST'),
        'NAME': env('DB_NAME'),
        'USER': env('DB_USER'),
        'PASSWORD':env('DB_PASSWORD'),
        'PORT': '3306',
    }
}
CACHES={
    'default': {
        'BACKEND': 'django_redis.cache.RedisCache',
        'LOCATION': [
            "redis://my-redis.drnxuo.0001.euw2.cache.amazonaws.com:6379/1",
        ],
        'OPTIONS': {
            "CLIENT_CLASS": "django_redis.client.DefaultClient",
            "SOCKET_CONNECT_TIMEOUT": 600,  # in seconds
            "SOCKET_TIMEOUT": 600,  # in seconds
            #"COMPRESSOR": "django_redis.compressors.zlib.ZlibCompressor",
            #"CONNECTION_POOL_KWARGS": {"max_connections": 100, "retry_on_timeout": True},
        },
    }
}

#########################################################################
#       S3
#STATIC_URL = '/static/'


AWS_ACCESS_KEY_ID = env('AWS_KEY')
AWS_SECRET_ACCESS_KEY = env('AWS_SECRET_KEY')
AWS_STORAGE_BUCKET_NAME = "cbs-static"
AWS_DEFAULT_ACL = "public-read"
AWS_QUERYSTRING_AUTH = False
DEFAULT_FILE_STORAGE = "djaws.storage_backends.MediaStorage"
FRONTEND_FILE_STORAGE = "djaws.storage_backends.FrontendStorage"
AWS_QUERYSTRING_AUTH = False


##########################################################################



# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/2.0/howto/static-files/
STATIC_URL="https://s3.eu-west-2.amazonaws.com/cbs-static/static/"
MEDIA_URL="https://s3.eu-west-2.amazonaws.com/cbs-static/static/media/"


IMAGEKIT_DEFAULT_FILE_STORAGE = DEFAULT_FILE_STORAGE
IMAGEKIT_CACHEFILE_DIR =  MEDIA_URL +  "CACHE/"

#STATIC_URL = '/static/'
#STATIC_ROOT = 'static'
STATICFILES_FINDERS = [
    'django.contrib.staticfiles.finders.FileSystemFinder',
    'django.contrib.staticfiles.finders.AppDirectoriesFinder',
]
STATICFILES_DIRS = [
    _FRONTEND + "/build",
    (os.path.join(_FRONTEND,"build"), "frontend"),
    os.path.join(BASE_DIR, 'static'),
]

MEDIA_ROOT = os.path.join(BASE_DIR, 'static/media') #for upload files
CKEDITOR_UPLOAD_PATH = "uploads/"

LOGIN_REDIRECT_URL = "/"
LOGOUT_REDIRECT_URL = "/logout/"
LOGOUT_URL = "/logout/"

"""
LOGIN_URL = "login"
"""

# FIND FILE AND SEARCH
#from django.contrib.staticfiles import finders
#result = finders.find('css/base.css')
#searched_locations = finders.searched_locations






# Password validation
# https://docs.djangoproject.com/en/2.0/ref/settings/#auth-password-validators

AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
        'OPTIONS': {
            'min_length': 9,
        }
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]


# Internationalization
# https://docs.djangoproject.com/en/2.0/topics/i18n/

LANGUAGE_CODE = 'en-us'

TIME_ZONE = 'Europe/Istanbul'

USE_I18N = True

USE_L10N = True

USE_TZ = True