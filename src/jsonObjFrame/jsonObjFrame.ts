import { JsonResultObj } from "../interfaces/interfaces";

const jsonObjFrame: JsonResultObj = {
  "title": "",
  "app_topic": "",
  "apk_suffix": "",
  "show_add_free_privacy_policy": false,
  "feedback_email_address": "info@norakomi.com",
  "youtube_api_key": "",
  "youtube_fallback_api_key": "",
  
  "ad_settings": {
    "ad_mob_app_id": "",
    "ad_mob_ad_unit_id": ""
  },
  "ui_colors": {
    "name": "default",
    "primaryColor": "#52a9ba",
    "primaryLightColor": "#86dbec",
    "primaryDarkColor": "#127a8a",
    "primaryTextColor": "#000000",
    "secondaryColor": "#bcaaa4",
    "secondaryTextColor": "#fafafa",
    "accent": "#FF4081",
    "fab": "#ba8d4d"
  },
  "visible_components": [],
  "facebook": {
    "channel": ""
  },
  "instagram": {
    "main_channel": "",
    "other_channels": []
  },
  "reddit": {
    "sub_reddit": "",
    "search_query": ""
  },
  "websites": [],
  "videos": [
    {
      "source": "youtube",
      "show_in_app": false,
      "queries": ["placeholder1","placeholder2", "placeholder3"],
      "blocked_videos": []
    },
    {
      "source": "vimeo",
      "show_in_app": false,
      "queries": [],
      "blocked_videos": []
    }
  ],
  "audio": [
    {
      "source": "soundcloud",
      "show_in_app": false,
      "queries": ["placeholder1","placeholder2"],
      "blocked_tracks": ["placeholders", ";-p", ":-D"]
    }
  ],
  "books": [
    {
      "source": "bol",
      "show_in_app": false,
      "queries": [],
      "blocked_book_ids": []
    },
    {
      "source": "PH_Amazon",
      "show_in_app": false,
      "queries": [],
      "blocked_book_ids": ["aaa", "bbb"]
    },
    {
      "source": "PH_Tarzan",
      "show_in_app": false,
      "queries": ["one", "two", "three"],
      "blocked_book_ids": ["10", "14"]
    }
  ],
  "twitter": [
    {
      "channel_name": "",
      "url": "",
      "main_feed": false,
      "show_in_app": false
    }
  ],
  "events": {}
};

export default jsonObjFrame;