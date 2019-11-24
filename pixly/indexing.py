from django.shortcuts import render
from django.views.defaults import page_not_found
from django.contrib.sitemaps import Sitemap
from django.urls import path, include, re_path
from django.conf.urls import handler400, handler403, handler404, handler500
from django.http import HttpResponse

deindex_file = open("djaws/deindex.txt", "r")
deindex_unique_urls = list({x.strip() for x in deindex_file.readlines()})


def get_pathname(link):
    if "https://wwww.pixly.app/" in link:
        return link.replace("https://wwww.pixly.app/", "").strip()
    elif "http://wwww.pixly.app/" in link:
        return link.replace("http://wwww.pixly.app/", "").strip()
    elif "https://pixly.app/" in link:
        return link.replace("https://pixly.app/", "").strip()
    elif "http://pixly.app/" in link:
        return link.replace("http://pixly.app/", "").strip()


def raw_404(request):
  response = HttpResponse("Not Found", status=404)
  response["status"] = 404
  print("404 returned")
  return response
handler404 = raw_404

def make_url_pattern():
    url_patterns = []
    for url in deindex_unique_pathnames:
        regex_pattern = rf'^{url}$'
        single_path = re_path(regex_pattern, raw_404)
        url_patterns.append(single_path)
    return url_patterns


# without trailing_slash
deindex_unique_pathnames = [get_pathname(x) for x in deindex_unique_urls] 




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




