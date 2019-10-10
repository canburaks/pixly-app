
class Youtube:
    key = "AIzaSyBdIAvGGzQn_IieJtZrrdLp1theKPe_FU0"
    client_id = "858188088335-t3nqoj5pvcgk1p81t6ahapkvc7b1sm17.apps.googleusercontent.com"
    client_secret = "OWk-iJ6YUSgfU5wiRFbZ2xJn"

    def __init__(self, yt_id):
        self.id = yt_id

    def get_data(self):
        import requests
        url = f'https://www.googleapis.com/youtube/v3/videos?part=snippet%2CtopicDetails%2CcontentDetails&id={self.id}&key={Youtube.key}'
        req = requests.get(url)
        return req.json()

    def get_caption_raw_data(self):
        import requests
        import json
        key = "AIzaSyBdIAvGGzQn_IieJtZrrdLp1theKPe_FU0"
        url = f'https://www.googleapis.com/youtube/v3/captions?part=snippet&videoId={self.id}&key={Youtube.key}'
        req = requests.get(url)
        return req.json()
    
    def get_caption_data(self):
        raw_data = self.get_caption_raw_data()
        captions = raw_data.get("items")
        #check how many caption is there
        if captions and len(captions) > 0:
            data_list = []
            for cap in captions:
                data = {}
                data["id"] = cap.get("id")
                #check snippet 
                snippet = cap.get("snippet")
                if snippet:
                    data["auto_sync"] = snippet.get("isAutoSynced")
                    data["updated_at"] = snippet.get("lastUpdated")
                    data["status"] = snippet.get("status")
                    
                    lang_code = snippet.get("language")
                    data["lang_code"] = lang_code
                    if lang_code in list(lang_codes.keys()):
                        data["lang"] = lang_codes.get(lang_code)
                    
                    data["type"] = snippet.get("trackKind")
                data_list.append(data)
            return data_list

    @classmethod
    def get_caption(cls, caption_id):
        import requests
        import json
        #sample_caption_id = '5dZDZmteNc8yNUkByhMIn-TqKrOTJzJyYZBtQQAk2kM='
        key = "AIzaSyBdIAvGGzQn_IieJtZrrdLp1theKPe_FU0"
        url = f'https://www.googleapis.com/youtube/v3/captions/{caption_id}?key={key}'
        req = requests.get(url)
        return req



lang_codes = {
    "ar": "Arabic",
    "bg": "Bulgarian",
    "ca": "Catalan ; Valencian",
    "cs": "Czech",
    "da": "Danish",
    "de": "German",
    "el": "Modern Greek",
    "en": "English",
    "es": "Spanish; Castilian",
    "et": "Estonian",
    "fa": "Persian",
    "fi": "Finnish",
    "fr-CA": "French (Canada)",
    "fr": "French",
    "hr": "Croatian",
    "hu": "Hungarian",
    "id": "Indonesian",
    "it": "Italian",
    "he": "Hebrew",
    "iw": "Hebrew",
    "ja": "Japanese",
    "ka": "Georgian",
    "ko": "Korean",
    "ku": "Kurdish",
    "lt": "Lithuanian",
    "lv": "Latvian",
    "mk": "Macedonian",
    "nl": "Dutch ; Flemish",
    "pl": "Polish",
    "pt-BR ": "Portuguese (Brazil)",
    "pt": "Portuguese",
    "ro": "Romanian; Moldavian; Moldovan",
    "ru": "Russian",
    "sk": "Slovak",
    "sl": "Slovenian",
    "sq": "Albanian",
    "sr-Latn": "Serbian (Latin)",
    "sr": "Serbian",
    "th": "Thai",
    "sv": "Swedish",
    "tr": "Turkish",
    "uk": "Ukrainian",
    "vi": "Vietnamese",
    "zh-CN": "Chinese",
    "zh-TW": "Chinese (Taiwan)"
}

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
