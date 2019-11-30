from requests import get
from requests.exceptions import RequestException
from contextlib import closing
from bs4 import BeautifulSoup
from pprint import pprint

class GoogleCrawl:
    google_query_prefix = "https://www.google.com/search?q=site:"
    excluded_words = ["/search?q=site:", 'accounts.google.com/ServiceLogin', "maps.google.com/"]


    @classmethod
    def url_cleaner(cls,url):
        return ((url.replace(
            "https://", "")).replace(
            "http://","")
        
        )
    @classmethod
    def link_cleaner(cls, link):
        result_filter_prefix = "/url?q="
        result_filter_suffix = "&sa"
        prefix_clean = cls.url_cleaner(link.replace(result_filter_prefix, ""))
        suffix_clean = prefix_clean.strip().split(result_filter_suffix)[0]
        return suffix_clean

    @classmethod
    def have_excluded_words(cls, link):
        for forbidden_word in cls.excluded_words:
            if forbidden_word in link:
                return True
        return False

    def __init__(self,url):
        clean_url = GoogleCrawl.url_cleaner(url)
        self.adress = clean_url
        self.domain_name = clean_url.strip().split(".")[0]


    def query_google(self,*args, **kwargs):
        page = kwargs.get("page") if kwargs.get("page") else 0
        params = f"&num=100&start={page*100 + 1}"
        url = f"{GoogleCrawl.google_query_prefix}{self.adress}{params}"
        print("url", url)
        return simple_get(url)
        
    def html_parser(self,*args, **kwargs):
        response = self.query_google(*args,**kwargs)
        #print("response", response)
        return BeautifulSoup(response, 'html.parser')

    def get_self_links(self,*args, **kwargs):
        html = self.html_parser(**kwargs)
        #pprint(html)
        all_links = [x.get("href") for x in html.find_all("a")]

        #all links include my domain
        links_includes_me = list(filter(lambda x: self.domain_name in x, all_links))

        #clear google parameters
        my_links_wo_params = list(map(lambda x: GoogleCrawl.link_cleaner(x), links_includes_me))
        #return my_links_wo_params
        
        #exclude other links
        my_links = list(filter(lambda x: not GoogleCrawl.have_excluded_words(x), my_links_wo_params ))
        return my_links



pixly = GoogleCrawl("pixly.app")


def pixly_indexed_parser(page_number):
    url = prepare_url(page_number)
    response = simple_get(url)
    html = BeautifulSoup(response, 'html.parser')
    link_list = []
    google_index_links = html.find_all("a")
    google_index_links.filter(lambda x: "pixly.app" in x)
    for x in google_index_links:
        link = x.get("href")
        print(link)
        link_list.append(link)
    return link_list

def prepare_url(page):
    return f"https://www.google.com/search?q=site:pixly.app&num=100&start={page*100}"

def simple_get(url):
    """
    Attempts to get the content at `url` by making an HTTP GET request.
    If the content-type of response is some kind of HTML/XML, return the
    text content, otherwise return None.
    """
    try:
        with closing(get(url, stream=True)) as resp:
            if is_good_response(resp):
                return resp.content
            else:
                return None

    except RequestException as e:
        log_error('Error during requests to {0} : {1}'.format(url, str(e)))
        return None


def is_good_response(resp):
    """
    Returns True if the response seems to be HTML, False otherwise.
    """
    content_type = resp.headers['Content-Type'].lower()
    return (resp.status_code == 200 
            and content_type is not None 
            and content_type.find('html') > -1)


def log_error(e):
    """
    It is always a good idea to log errors. 
    This function just prints them, but you can
    make it do anything.
    """
    print(e)