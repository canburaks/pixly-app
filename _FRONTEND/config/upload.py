import boto3
import os

#-----------------------------------------------------------------
#-----------FILE OPERATIONS--------------------------------------
#flag for only upload brotli compressed files
ONLY_COMPRESSED = False
js_dir = "build/static/js"
css_dir = "build/static/css"

# for upload we need full relative path, so add
js_prefix = "build/static/js"
css_prefix = "build/static/css"

#---Source files---
js_files = set()
css_files = set()

#JS FILES
for dir_, _, files in os.walk(js_dir):
    for file_name in files:

        #add all files
        if not ONLY_COMPRESSED:
            #rel_dir = os.path.relpath(dir_, js_dir)
            #rel_file = os.path.join(rel_dir, js_prefix, file_name)
            js_files.add(file_name)

        #add only br files
        elif ONLY_COMPRESSED == True:
            if file_name.endswith("br"):
                #rel_dir = os.path.relpath(dir_, js_dir)
                #rel_file = os.path.join(rel_dir, js_prefix, file_name)
                js_files.add(file_name)

#CSS FILES
for dir_, _, files in os.walk(css_dir):
    for file_name in files:

        #add all files
        if not ONLY_COMPRESSED:
            #rel_dir = os.path.relpath(dir_, css_dir)
            #rel_file = os.path.join(rel_dir,css_prefix, file_name)
            css_files.add(file_name)

        #add only br files
        elif ONLY_COMPRESSED == True:
            if file_name.endswith("br"):
                #rel_dir = os.path.relpath(dir_, css_dir)
                #rel_file = os.path.join(rel_dir,css_prefix, file_name)
                css_files.add(file_name)
print("Will upload only brotli files? --> ", ONLY_COMPRESSED)
print("js files: ",js_files)
print("css files: ",css_files)
print("Files are defined. \n")
#-----------------------------------------------------------------
#-----------UPLOAD OPERATIONS--------------------------------------

s3 = boto3.resource('s3')
bucket = s3.Bucket('cbs-static')

def set_configs(file_name):
    #Brotli compressed js file
    if file_name.endswith("js.br"):
        props = {
            'ContentType': 'application/javascript',
            'ContentEncoding': 'br',
            'ACL':'public-read'}
        if "vendor" in file_name:
            props["CacheControl"] = "max-age=180"

    #Brotli compressed css file
    elif file_name.endswith("css.br"):
        props = {
            'ContentType': 'text/css',
            'ContentEncoding': 'br',
            'ACL':'public-read'}
        if "vendor" in file_name:
            props["CacheControl"] = "max-age=180"
    #js file
    elif file_name.endswith("js"):
        props = {'ContentType': 'application/javascript', 'ACL':'public-read'}
        if "vendor" in file_name:
            props["CacheControl"] = "max-age=180"
    #css file
    elif file_name.endswith("css"):
        props = {'ContentType': 'text/css', 'ACL':'public-read'}
        if "vendor" in file_name:
            props["CacheControl"] = "max-age=180"
    else: 
        props = None
    return props
    

def upload_files(base_path, target_path, configs):
    bucket.upload_file(base_path, target_path, ExtraArgs=configs)


print("JS Files are uploading now... \n\n")
#Upload JS files
for js_file in js_files:
    base_path = "./build/static/js/" + js_file
    target_path =  "static/bundle/dist/static/js/" + js_file
    configs = set_configs(js_file)
    upload_files(base_path, target_path, configs)

print("JS Files uploaded. \nCSS Files are uploading now.")

#Upload CSS files
for css_file in css_files:
    base_path = "./build/static/css/" + css_file
    target_path =  "static/bundle/dist/static/css/" + css_file
    configs = set_configs(css_file)
    upload_files(base_path, target_path, configs)

print("All Uploads are done")
print("-----FINISH----------\n")


"""
import logging
import boto3
from botocore.exceptions import ClientError


s3 = boto3.client('s3')

s3.meta.client.upload_file('./build/static/hello.txt', 'cbs-static', 'static/bundle/dist/static/hello.txt')

import boto3

s3 = boto3.resource('s3')
bucket = s3.Bucket('cbs-static')
bucket.upload_file(
    './build/static/js', #from
    'static/bundle/dist/static/js/' #to
    )
"""

#my_object = bucket.Object('static/bundle/dist/static/hello.txt')
#
#print(my_object)  
