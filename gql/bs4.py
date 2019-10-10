from requests import get
from requests.exceptions import RequestException
from contextlib import closing
from bs4 import BeautifulSoup


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

def parse_imdb_movie(imdb_id):
    url = "https://www.imdb.com/title/" + imdb_id
    response = simple_get(url)
    html = BeautifulSoup(response, 'html.parser')
    divRating = [div for div in html.select('div') if div.attrs.get("class")==["imdbRating"] ]
    spanRating = divRating[0].select("span")[0]
    rating = float(spanRating.contents[0])
    spanVotes = [span for span in divRating[0].select("span") if span.attrs.get("class")==["small"] ]
    votes = int((spanVotes[0].contents[0]).replace(",",""))
    return rating, votes






