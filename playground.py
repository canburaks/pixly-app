# Standard library imports
from tqdm import tqdm
import json
import datetime as dt
from datetime import datetime, timezone
from collections import Counter
from pprint import pprint

# Django imports
from django.utils.text import slugify
from django_bulk_update.helper import bulk_update

# Database utility functions
def set_recs_non_recommended(start, end):
    """Bulk update recommendations to set is_recommended=False for a range of records"""
    all_recs = Recommendation.objects.all()
    print("Current elements: ", all_recs.count())
    all_recs = all_recs[start: end]
    for m in tqdm(all_recs):
        m.is_recommended = False
    print("start updating: ")
    bulk_update(all_recs, update_fields=["is_recommended"])

# SEO related functions
def generate_title(movie):
    """Generate SEO-friendly title for a movie including year, content type and metadata"""
    # Start with year
    year_text = f"({movie.year}) - " 
    text = year_text
    
    # Add content types
    if movie.have_content_similars:
        text += "Similars, Recommendations, "
    
    # Add video types
    video_tags = set(movie.video_tags)
    if "trailer" in video_tags:
        tags_without_trailer = video_tags.difference({"trailer"})  
        if len(tags_without_trailer) > 0:
            text += "Videos"
        else:
            text += "Trailer"
            
    # Add crew info
    if movie.have_crew:
        text += ", Cast."
        
    # Add movie name with length limit
    added_text_length = len(text)
    available_chars = 69 - added_text_length
    if len(movie.name) > available_chars - 1:
        name = movie.name[:available_chars - 2].title() + ".."
    else:
        name = movie.name.title() + " "
    
    title = name + text
    print(f"title length: {len(title)}")
    return title

def generate_description(movie):
    """Generate SEO-friendly description including director, tags, awards and summary"""
    text = ""
    dn = movie.director_names
    tag_names = movie.tag_names
    genres = movie.genre_names
    
    # Format director name(s)
    director_name = ""
    if dn:
        if len(dn) == 1:
            director_name = dn[0]
        elif len(dn) == 2:
            director_name = f"{dn[0]} and {dn[1]}"
        elif len(dn) > 2:
            director_name = "many directors"
            
    # Add movie characteristics
    definition = ""
    pheno_text = ""
    if "mindfuck" in tag_names or "thought-provoking" in tag_names:
        pheno_text = "thought-provoking"
    elif "feel-good-movie" in tag_names or "feel-good" in tag_names:
        pheno_text = "feeling good"
        
    # Add awards info
    award_text = ""
    if any(award in tag_names for award in ["golden-bear-winner", "golden-lion-winner", "palme-dor-winner"]):
        if len(pheno_text) > 0:
            award_text = "awarded"
            
    # Combine characteristics        
    definition = pheno_text
    if award_text:
        definition += f" {award_text}"

    # Generate final description
    if "documentary" in tag_names:
        tags_wo_doc = set(tag_names).difference({"documentary"})
        text += f"A {movie.year} documentary which has {', '.join(tags_wo_doc)} topics."
    else:
        # Handle regular movies
        if movie.year in [2018, 2019]:
            if movie.imdb_rating > 8:
                text += f"One of the best {definition} movies of {movie.year} directed by {director_name}."
            elif movie.imdb_rating > 7.5:
                text += f"One of the good {definition} movies of {movie.year} directed by {director_name}."
        else:
            if movie.imdb_rating > 8.2:
                text += f"One of the best {definition} movies directed by {director_name}."
            else:
                text += f"A {director_name} movie released in {movie.year}."

    # Add similar movies info
    if movie.have_content_similars:
        if movie.have_similars:
            text += f" Find similar movies and good movie recommendations based on "
        else:
            text += f" Find movies similar to "  
        available_num = 159 - len(text)
        text += f"{movie.name[:available_num]}."
    else:
        current_num = len(text)
        available_num = 159 - current_num
        text += movie.summary[:available_num] 

    return text

# Social media link generators
def imdb_link(imdb_id):
    """Generate IMDB profile link"""
    return f"https://www.imdb.com/title/{imdb_id}"

def imdb_person_link(imdb_id):
    """Generate IMDB person link"""
    return f"https://www.imdb.com/name/{imdb_id}"

def twitter_link(name):
    """Generate Twitter profile link"""
    return f"https://www.twitter.com/{name}"

def instagram_link(name):
    """Generate Instagram profile link"""
    return f"https://www.instagram.com/{name}"

def facebook_link(name):
    """Generate Facebook profile link"""
    return f"https://www.facebook.com/{name}"

# ... rest of the code ...
