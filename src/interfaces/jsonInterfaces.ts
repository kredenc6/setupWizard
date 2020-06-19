import { UserInput, UserInputPlatformKeys } from "./variousInterfaces";
import { JsonColorScheme } from "./colorSchemeInterfaces";

export interface JsonResultObj {
  title: string;
  app_topic: string;
  apk_suffix: string;
  show_add_free_privacy_policy: boolean;
  feedback_email_address: string;
  youtube_api_key: string;
  youtube_fallback_api_key: string;
  ad_settings: {
    ad_mob_app_id: string;
    ad_mob_ad_unit_id: string;
  };
  ui_colors: JsonColorScheme;
  visible_components: Array<keyof UserInput["platforms"]>
  facebook: {
    channel: string;
  };
  instagram: {
    main_channel: string;
    other_channels: string[];
  };
  reddit: {
    sub_reddit: string;
    search_query: string;
  };
  websites: string[];
  videos: VideoItem[];
  audio: AudioItem[];
  books: BookItem[];
  twitter: Array<{
    channel_name: string;
    url: string;
    main_feed: boolean;
    show_in_app: boolean;
  }>,
  events: {

  };
};

interface MediaItem {
  source: string;
  show_in_app: boolean;
  queries: string[];
};

export interface AudioItem extends MediaItem {
  blocked_tracks: string[];
};

export interface BookItem extends MediaItem {
  blocked_book_ids: string[];
};

export interface VideoItem extends MediaItem {
  blocked_videos: string[];
};

export type JsonObjKey = keyof JsonResultObj;

export type JsonObjPlatform = JsonResultObj[UserInputPlatformKeys];

export type JsonResultObjFillIns =
  Pick<JsonResultObj, "app_topic" | "audio" | "books" | "facebook" | "instagram" | "reddit" | "videos" | "twitter">;