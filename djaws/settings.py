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
REACT_APP =os.path.join(os.path.join(BASE_DIR, 'frontend'),)

SECRET_KEY = env('SECRET_KEY')
DEBUG = True

#GLOBAL VARIABLES
PER_PAGE_ITEM = 24
BRAND_IMAGE = "https://cbs-static.s3.eu-west-2.amazonaws.com/static/images/pixly-wide-zip.jpg"
LIST_MIN_SUMMARY = 200

#HOST_SCHEME                     = "https://pixly.app"
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
"""

# SECURITY WARNING: don't run with debug turned on in production!
#SITE_ID=2
ALLOWED_HOSTS = ["*",
    'http://127.0.0.1:8000',
    'https://127.0.0.1:8000',
    'http://127.0.0.1:8080',
    'https://127.0.0.1:8080',
    "https://pixly.app/*",
    "http://pixly.app/*",
    "http://www.pixly.app/*",
    "https://pixly.app/graphql",
    'http://localhost:3000',
    'https://127.0.0.1:3000',
    "ec2-3-11-72-113.eu-west-2.compute.amazonaws.com",
    "ec2-35-178-89-86.eu-west-2.compute.amazonaws.com"
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
    "rss",

    'django_hosts',
    'corsheaders',
    "storages",
    "imagekit",
    'import_export',
    "django_countries",
    "ckeditor",
    "ckeditor_uploader",
    'django_filters',
    "sslserver",
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
    'redirect_to_non_www.middleware.RedirectToNonWww',
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
    #'gql.social.facebook.FacebookBackend',
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
        'DIRS': (os.path.join(BASE_DIR, 'templates'),),
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


#########################################################################
#       S3
#STATIC_URL = '/static/'

AWS_DEFAULT_REGION = env('AWS_DEFAULT_REGION')
AWS_S3_OBJECT_PARAMETERS = {
    'CacheControl': 'max-age=864000',
}
AWS_ACCESS_KEY_ID = env('AWS_KEY')
AWS_SECRET_ACCESS_KEY = env('AWS_SECRET_KEY')
AWS_STORAGE_BUCKET_NAME = "cbs-static"
AWS_DEFAULT_ACL = "public-read"
AWS_QUERYSTRING_AUTH = False
DEFAULT_FILE_STORAGE = "djaws.storage_backends.MediaStorage"
AWS_QUERYSTRING_AUTH = False

GOOGLE__PIXLY_REACT_CLIENT_ID = env('GOOGLE__PIXLY_REACT_CLIENT_ID')
GOOGLE__PIXLY_REACT_CLIENT_SECRET = env('GOOGLE__PIXLY_REACT_CLIENT_SECRET')

COGNITO_USER_POOL_ID=env("COGNITO_USER_POOL_ID")
COGNITO_CLIENT_ID=env("COGNITO_CLIENT_ID")
##########################################################################

# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/2.0/howto/static-files/
STATIC_URL="https://s3.eu-west-2.amazonaws.com/cbs-static/static/"
MEDIA_URL="https://s3.eu-west-2.amazonaws.com/cbs-static/static/media/"


IMAGEKIT_DEFAULT_FILE_STORAGE = DEFAULT_FILE_STORAGE
IMAGEKIT_CACHEFILE_DIR =  MEDIA_URL +  "CACHE/"

#STATIC_URL = '/static/'
STATIC_ROOT = 'static'
#STATICFILES_DIRS = [os.path.join(BASE_DIR, 'static'),]

MEDIA_ROOT = os.path.join(BASE_DIR, 'static/media') #for upload files

LANGUAGE_CODE = 'en-us'

TIME_ZONE = 'Europe/Istanbul'

USE_I18N = True

USE_L10N = True

USE_TZ = True


LOGIN_REDIRECT_URL = "/"
LOGOUT_REDIRECT_URL = "/logout/"
LOGOUT_URL = "/logout/"

CKEDITOR_UPLOAD_PATH = "uploads/"
#CKEDITOR_CONFIGS = {
#    'default': {
#        'toolbar': 'Custom',
#        'toolbar_Custom': [
#            ['Bold', 'Italic', 'Underline'],
#            ['NumberedList', 'BulletedList', '-', 'Outdent', 'Indent', '-', 'JustifyLeft', 'JustifyCenter', 'JustifyRight', 'JustifyBlock'],
#            ['Link', 'Unlink'],
#            ['RemoveFormat', 'Source'],
#            {'name': 'styles', 'items': ['Styles', 'Format', 'Font', 'FontSize']},
#
#        ]
#    }
#}
CKEDITOR_CONFIGS = {
    'default': {
        'skin': 'moono',
        "removePlugins": "stylesheetparser",
        # 'skin': 'office2013',
        'toolbar_Basic': [
            ['Source', 'Bold', 'Italic', "link"]
        ],
        'toolbar_YourCustomToolbarConfig': [
            {'name': 'document', 'items': ['Source', '-', 'Save', 'NewPage', 'Preview', 'Print', '-', 'Templates']},
            {'name': 'clipboard', 'items': ['Cut', 'Copy', 'Paste', 'PasteText', 'PasteFromWord', '-', 'Undo', 'Redo']},
            {'name': 'editing', 'items': ['Find', 'Replace', '-', 'SelectAll']},
            {'name': 'forms',
             'items': ['Form', 'Checkbox', 'Radio', 'TextField', 'Textarea', 'Select', 'Button', 'ImageButton',
                       'HiddenField']},
            '/',
            {'name': 'basicstyles',
             'items': ['Bold', 'Italic', 'Underline', 'Strike', 'Subscript', 'Superscript', '-', 'RemoveFormat', 'CodeSnippet']},
            {'name': 'paragraph',
             'items': ['NumberedList', 'BulletedList', '-', 'Outdent', 'Indent', '-', 'Blockquote', 'CreateDiv', '-',
                       'JustifyLeft', 'JustifyCenter', 'JustifyRight', 'JustifyBlock', '-', 'BidiLtr', 'BidiRtl',
                       'Language']},
            {'name': 'links', 'items': ['Link', 'Unlink', 'Anchor']},
            {'name': 'insert',
             'items': ['Image', 'Flash', 'Table', 'HorizontalRule', 'Smiley', 'SpecialChar', 'PageBreak', 'Iframe', "PageBreak"]},
            '/',
            {'name': 'styles', 'items': ['Styles', 'Format', 'Font', 'FontSize']},
            {'name': 'colors', 'items': ['TextColor', 'BGColor']},
            {'name': 'tools', 'items': ['Maximize', 'ShowBlocks']},
            {'name': 'about', 'items': ['About']},
            '/',  # put this to force next toolbar on new line
            {'name': 'yourcustomtools', 'items': [
                # put the name of your editor.ui.addButton here
                'Preview',
                'Maximize',

            ]},
        ],
        'toolbar': 'YourCustomToolbarConfig',  # put selected toolbar config here
        
        # https://github.com/django-ckeditor/django-ckeditor/tree/master/ckeditor/static/ckeditor/ckeditor/plugins/codesnippet/lib/highlight/styles
        # https://github.com/isagalaev/highlight.js/tree/master/src/styles
        'codeSnippet_theme': 'rainbow',
        # uncomment to restrict only those languages
        'codeSnippet_languages': {
            'python': 'Python',
            'javascript': 'JavaScript',
            'bash': 'Bash',
            "html": "HTML",
            "css": "CSS"
        },


        'tabSpaces': 4,
        'extraPlugins': ','.join([
            'uploadimage', # the upload image feature
            # your extra plugins here
            'div',
            'autolink',
            'autoembed',
            'embedsemantic',
            'autogrow',
            # 'devtools',
            'widget',
            'lineutils',
            'clipboard',
            "codesnippet",
            'dialog',
            'dialogui',
            'elementspath',
            "devtools",
            "pagebreak",

        ]),
    }
}

"""


        'extraPlugins': ','.join([
            'uploadimage', # the upload image feature
            # your extra plugins here
            "a11yhelp",
            "about",
            "adobeair",
            "ajax",
            "autoembed",
            "autogrow",
            "autolink",
            "bbcode",
            "clipboard",
            "codesnippet",
            "codesnippetgeshi",
            "colordialog",
            "devtools",
            "dialog",
            "div",
            "divarea",
            "docprops",
            "embed",
            "embedbase",
            "embedsemantic",
            "filetools",
            "find",
            "flash",
            "forms",
            "iframe",
            "iframedialog",
            "image",
            "image2",
            "language",
            "lineutils",
            "link",
            "liststyle",
            "magicline",
            "mathjax",
            "menubutton",
            "notification",
            "notificationaggregator",
            "pagebreak",
            "pastefromword",
            "placeholder",
            "preview",
            "scayt",
            "sharedspace",
            "showblocks",
            "smiley",
            "sourcedialog",
            "specialchar",
            "stylesheetparser",
            "table",
            "tableresize",
            "tabletools",
            "templates",
            "uicolor",
            "uploadwidget",
            "widget",
            "wsc",
            "xml"
        ]),

LOGIN_URL = "login"
"""
