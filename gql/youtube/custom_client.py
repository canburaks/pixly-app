from google_auth_oauthlib.flow import InstalledAppFlow
flow = InstalledAppFlow.from_client_secrets_file("yt_client.json", scopes=["https://www.googleapis.com/auth/youtube.force-ssl"])
credentials = flow.run_console()

import googleapiclient
youtube = googleapiclient.discovery.build('youtube', 'v3', credentials=credentials)
yc = youtube.captions()   

yt_request = yc.download_media(id="5dZDZmteNc8yNUkByhMIn-TqKrOTJzJyYZBtQQAk2kM=")  
file = open("file.txt", "wb") 
download = googleapiclient.http.MediaIoBaseDownload(file, yt_request)







###############################################

SCOPES = ['https://www.googleapis.com/auth/youtube.force-ssl']
SERVICE_ACCOUNT_FILE = 'yt_client.json'

credentials = service_account.Credentials.from_service_account_file(
        SERVICE_ACCOUNT_FILE, scopes=SCOPES)


import io
import os

import google_auth_oauthlib.flow
import googleapiclient.discovery
import googleapiclient.errors
import _pickle as pickle
from googleapiclient.http import MediaIoBaseDownload

scopes = ["https://www.googleapis.com/auth/youtube.force-ssl"]

def main(caption_id):
    # Disable OAuthlib's HTTPS verification when running locally.
    # *DO NOT* leave this option enabled in production.
    os.environ["OAUTHLIB_INSECURE_TRANSPORT"] = "1"

    api_service_name = "youtube"
    api_version = "v3"
    client_secrets_file = "yt_client.json"

    # Get credentials and create an API client
    flow = google_auth_oauthlib.flow.InstalledAppFlow.from_client_secrets_file(
        client_secrets_file, scopes)

    credentials = flow.run_console()
    youtube = googleapiclient.discovery.build(
        api_service_name, api_version, credentials=credentials)

    id = caption_id if caption_id else "6m4787y3_tBU9Lx-5bsmlwCSfpIAgowvFxOezCFSEVI="
    request = youtube.captions().download(
        id=id
    )
    #       with the location where the downloaded content should be written.
    ## TODO: For this request to work, you must replace "YOUR_FILE"
    fh = io.FileIO("caption.pickle", "wb")

    download = MediaIoBaseDownload(fh, request)
    complete = False
    while not complete:
        status, complete = download.next_chunk()
        print(status, complete)


def save_pickle(file, file_dir, compress=False):
    import _pickle as pickle
    if compress:
        import bz2
        with bz2.BZ2File(file_dir,"w") as f:
            pickle.dump(file, f)
        print("Saved by compressing to:'{}'".format(file_dir))
    with open(file_dir, "wb") as f:
        pickle.dump(file, f)
    print("Saved to:'{}'".format(file_dir))


def get_pickle(file_dir, compress=False):
    import _pickle as pickle
    if compress:
        import bz2
        with bz2.BZ2File(file_dir,"r") as f:
            file = pickle.load(f)
        return file
    with open(file_dir, "rb") as f:
        file = pickle.load(f)
    return file

def save_json(file, file_dir):
    import json
    with open(file_dir, "w") as f:
        json.dump(file, f)
    print("Saved to:'{}'".format(file_dir))


def get_json(file_dir):
    import json    
    with open(file_dir, "r") as f:
        file = json.load(f)
    return file
