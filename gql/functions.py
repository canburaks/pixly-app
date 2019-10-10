
def url_image(url, filename):
    from django.core import files
    from io import BytesIO
    import requests
    
    response = requests.get(url)
    fp = BytesIO()
    fp.write(response.content)
    return filename, files.File(fp)

def get_poster_url(self):
    if self.data.get("tmdb_poster_path"):
        return self.data.get("tmdb_poster_path")
    else:
        try:
            plinks = self.tmdb.poster_links()
            if plinks.get("tmdb_poster_path"):
                return plinks.get("tmdb_poster_path")
        except:
            return None