# -*- coding: utf-8 -*-

# Sample Python code for youtube.captions.download
# NOTE: This sample code downloads a file and can't be executed via this
#       interface. To test this sample, you must run it locally using your
#       own API credentials.

# See instructions for running these code samples locally:
# https://developers.google.com/explorer-help/guides/code_samples#python

import io
import os

import google_auth_oauthlib.flow
import googleapiclient.discovery
import googleapiclient.errors
import _pickle as pickle
from googleapiclient.http import MediaIoBaseDownload

scopes = ["https://www.googleapis.com/auth/youtube.force-ssl"]

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


def main():
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

    request = youtube.captions().download(
        id="6m4787y3_tBU9Lx-5bsmlwCSfpIAgowvFxOezCFSEVI="
    )
    # TODO: For this request to work, you must replace "YOUR_FILE"
    #       with the location where the downloaded content should be written.
    fh = io.FileIO("caption.pickle", "wb")

    download = MediaIoBaseDownload(fh, request)
    complete = False
    while not complete:
      status, complete = download.next_chunk()


if __name__ == "__main__":
    main()