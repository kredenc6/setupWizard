import { createJsonSchemeObj } from "../miscellaneous/colorSchemeFunctions";
import sortObjEntriesAlphabetically from "../miscellaneous/sortObjEntriesAlphabetically";
import { JSONResultObj, UserInput } from "../interfaces/interfaces";

type ModuleKeys = keyof UserInput["modules"];

const createJsonObj = (userInput: UserInput): JSONResultObj => {
 const {
  audio,
  books,
  events,
  instagram,
  facebook,
  reddit,
  twitter,
  videos,
  websites
 } = createJsonModuleDataFromUserInput(userInput);

  const visibleComponents = sortObjEntriesAlphabetically(Object.entries(userInput.modules))
    .filter(([_, module]) => module.selected)
    .map(([key, _]) => key) as ModuleKeys[];
  
  return {
    "title": "title_placeholder",
    "app_topic": userInput.appTopic,
    "apk_suffix": "suffix_placeholder",
    "show_add_free_privacy_policy": false,
    "feedback_email_address": "info@norakomi.com",
    "youtube_api_key": "api_key_placeholder",
    "youtube_fallback_api_key": "fallback_api_key_placeholder",
    "ad_settings": {
      "ad_mob_app_id": "ad_mob_app_id_placeholder",
      "ad_mob_ad_unit_id": "ad_mob_ad_unit_id_placeholder"
    },
    "ui_colors": createJsonSchemeObj(userInput.schemeObj),
    "visible_components": visibleComponents,
    "facebook": facebook,
    "instagram": instagram,
    "reddit": reddit,
    "websites": websites,
    "videos": videos,
    "audio": audio,
    "books": books,
    "twitter": twitter,
    "events": events
  };
};

export default createJsonObj;

const createJsonModuleDataFromUserInput = (userInput: UserInput): Pick<JSONResultObj, ModuleKeys> => {
  return {
    audio: createAudioJsonObj(userInput),
    books: createBooksJsonObj(userInput),
    events: createEventsJsonObj(userInput),
    facebook: createFacebookJsonObj(userInput),
    instagram: createInstagramJsonObj(userInput),
    reddit: createRedditJsonObj(userInput),
    twitter: createTwitterJsonObj(userInput),
    videos: createVideosJsonObj(userInput),
    websites: createWebsitesJsonObj(userInput)
  };
};

const createAudioJsonObj = (userInput: UserInput) => {
  return [
    {
      "source": "source_placeholder",
      "show_in_app": userInput.modules.audio.selected,
      "queries": [
        userInput.appTopic
      ],
      "blocked_tracks": []
    }
  ];
};

const createBooksJsonObj = (userInput: UserInput) => {
  return [
    {
      "source": "source_placeholder",
      "show_in_app": userInput.modules.books.selected,
      "queries": [
        userInput.appTopic
      ],
      "blocked_book_ids": []
    }
  ];
};

const createEventsJsonObj = (userInput: UserInput) => {
  return "events_placeholder";
};

const createInstagramJsonObj = (userInput: UserInput) => {
  return {
    "main_channel": "main_channel_placeholder",
    "other_channels": []
  };
};

const createFacebookJsonObj = (userInput: UserInput) => {
  return {
    "channel": "facebook_placeholder"
  };
};

const createRedditJsonObj = (userInput: UserInput) => {
  return {
    "sub_reddit": "sub_reddit_placeholder",
    "search_query": "search_query_placeholder"
  };
};

const createTwitterJsonObj = (userInput: UserInput) => {
  return [
    {
      "channel_name": "channel_name_placeholder",
      "url": "url_placeholder",
      "main_feed": true,
      "show_in_app": userInput.modules.twitter.selected
    }
  ];
};

const createVideosJsonObj = (userInput: UserInput) => {
  return [
    {
      "source": "source_placeholder",
      "show_in_app": userInput.modules.videos.selected,
      "queries": [
        userInput.appTopic
      ],
      "blocked_videos": []
    }
  ];
};

const createWebsitesJsonObj = (userInput: UserInput) => {
  return [
    "url_placeholder",
    "url_placeholder",
    "url_placeholder"
  ];
};

