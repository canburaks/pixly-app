
#sample_list_id = "PLe0M5_Gz6Xovqm32EJZw6WBBW8ZY-uT4i"
"""
yt_pixlymovie_api = "AIzaSyBdIAvGGzQn_IieJtZrrdLp1theKPe_FU0"

def get_sample(id):
    import requests
    import json
    key = "AIzaSyBdIAvGGzQn_IieJtZrrdLp1theKPe_FU0"
    url = f'https://www.googleapis.com/youtube/v3/videos?part=snippet%2CcontentDetails&id={id}&key={key}'
    req = requests.get(url)
    return req.json()

def get_caption_id(video_id):
    import requests
    import json
    key = "AIzaSyBdIAvGGzQn_IieJtZrrdLp1theKPe_FU0"
    url = f'https://www.googleapis.com/youtube/v3/captions?part=snippet&videoId={video_id}&key={key}'
    req = requests.get(url)
    return req.json()


import os
import pandas as pd
import sys
cwd = os.getcwd()

def get_playlist(playlist_id, maxResults=50, pageToken=None):
    #Return list of dictionary video specifications
    import requests
    API_KEY = yt_pixlymovie_api
    if not pageToken:
        url = ("https://www.googleapis.com/youtube/v3/playlistItems?"
            "part=snippet%2CcontentDetails&maxResults={}&playlistId={}&key={}").format(maxResults, playlist_id, API_KEY)
        req = requests.get(url)
    elif pageToken:
        url = ("https://www.googleapis.com/youtube/v3/playlistItems?"
        "part=snippet%2CcontentDetails&maxResults={}&pageToken={}&playlistId={}&key={}").format(maxResults, pageToken,playlist_id, API_KEY)
        req = requests.get(url)
    return req.json()


def get_video_info(video_id):
    import requests
    API_KEY = yt_pixlymovie_api
    url= ("https://www.googleapis.com/youtube/v3/videos?id={}"
        "&key={}&part=snippet").format(video_id, API_KEY)
    response = requests.get(url)
    #return response.json().get("items")[0]
    return response.json().get("items")


def create_entry(playlist_id):
    response = get_playlist(playlist_id, pageToken=None)
    total_number_of_videos = response.get("pageInfo").get("totalResults")
    base_video_url = "https://www.youtube.com/watch?v="
    base_playlist_url ="https://www.youtube.com/playlist?list="
    base_channel_url = "https://www.youtube.com/channel/"
    if total_number_of_videos<50:
        video_list = response.get("items")
        new_dict = []
        for item in video_list:
            vd = {}
            yt_id = item.get("contentDetails").get("videoId")
            vd["title"] = item.get("snippet").get("title")
            vd["summary"] = item.get("snippet").get("description")
            vd["link"] = base_video_url + yt_id
            vd["thumbnail"] = item.get("snippet").get("thumbnails").get("medium").get("url")

            detail_response = get_video_info(yt_id)
            vd["channel_url"] = detail_response.get("snippet").get("channelId")
            vd["channel_name"] = detail_response.get("snippet").get("channelTitle")

if __name__=="__main__":
    playlist_id = sys.argv[1]
    get_playlist(str(playlist_id))
"""