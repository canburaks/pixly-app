from django.shortcuts import render
from django.views.defaults import page_not_found
from django.contrib.sitemaps import Sitemap
from django.urls import path, include, re_path
from django.conf.urls import handler400, handler403, handler404, handler500
from django.http import HttpResponse
from pixly.lib import is_ascii, to_english_chars, save_json, get_json


deindex_file = open("djaws/deindex.txt", "r")
unique_urls = list({x.strip() for x in deindex_file.readlines()})
unique_urls_no_whitespace = [to_english_chars(x) for x in unique_urls]
# for check
#endswith_slash = list(filter(lambda x: x.endswith("/"), unique_urls_no_whitespace ))
#not_ascii = list(filter(lambda x: not is_ascii(x), unique_urls_no_whitespace ))
def ascii_check(liste):
    return list(filter(lambda x: not is_ascii(x), liste ))

deindex_unique_urls = unique_urls_no_whitespace


def get_pathname(link):
    if "https://wwww.pixly.app/" in link:
        path = link.replace("https://wwww.pixly.app/", "").strip()
        if is_ascii(path):
            return path
    elif "http://wwww.pixly.app/" in link:
        path = link.replace("http://wwww.pixly.app/", "").strip()
        if is_ascii(path):
            return path
    elif "https://pixly.app/" in link:
        path = link.replace("https://pixly.app/", "").strip()
        #print("sss")
        return path
        if is_ascii(path):
            return path
    elif "http://pixly.app/" in link:
        path = link.replace("http://pixly.app/", "").strip()
        if is_ascii(path):
            return path


def raw_404(request):
  response = HttpResponse("Not Found", status=404)
  response["status"] = 404
  #print("404 returned")
  return response
handler404 = raw_404

def make_url_pattern():
    url_patterns = []
    #for url in deindex_unique_pathnames:
    json_urls = get_json("/home/jb/Projects/Github/pixly-app/pixly/unique_deindex.json")
    for url in json_urls:
        try:
            regex_pattern = rf'^{url}$'

            single_path = re_path(rf'^{url}$', lambda x: HttpResponse("Not Found",
            content_type="text/plain", status=404), name="deindex")
            url_patterns.append(single_path)
        except:
            continue
    return url_patterns


# without trailing_slash
unique_pathnames = [get_pathname(x) for x in deindex_unique_urls] 
deindex_unique_pathnames = list(filter( lambda x: x is not None, unique_pathnames))

#SAVE JSON
#save_json(deindex_unique_pathnames, "/home/jb/Projects/Github/pixly-app/pixly/unique_deindex.json")


# add this to url_patterns of your project
deindex_url_patterns = make_url_pattern()

class RemoveLinkClass:
    def __init__(self, link):
        self.link = link

class RemoveSitemap(Sitemap):
    changefreq = "daily"
    priority = 0.9
    def items(self):
        url_patterns = [RemoveLinkClass(link=f"/{url}") for url in deindex_unique_pathnames ]
        return url_patterns

    def location(self, item):
        return item.link


#sss = [x.get("location") for x in RemoveSitemap().get_urls()]

