import Interval from "../classes/Interval";
import { FilesState } from "./fileInterfaces";

export interface Classes {
  [propName: string]: string;
};

export interface ColorSchemeInt {
  name: string;
  primary: Palette;
  secondary: Palette;
  textColorOverride: {
    primary: string | null;
    secondary: string | null;
  }
};

export interface Palette {
  light: string;
  main: string;
  dark: string;
  contrastText: {
    light: string;
    main: string;
    dark: string;
  }
};

export interface JsonScheme {
  name: string;
  primaryColor: string;
  primaryLightColor: string;
  primaryDarkColor: string;
  primaryTextColor: string;
  secondaryColor: string;
  secondaryTextColor: string;
  accent: string;
  fab: string;
};

export interface UserInput {
  resetJsonOnAppTopicChange: boolean;
  setAlsoAsChannelValues: boolean;
  schemeObj: ColorSchemeInt;
  modules: {
    audio: Module;
    books: Module;
    events: Module;
    facebook: Module;
    instagram: Module;
    reddit: Module;
    twitter: Module;
    videos: Module;
    websites: Module;
  }
};

export interface Module {
  [propName: string]: any;
  selected: boolean;
  VERIFY_BY_PROXY?: string[];
  WEB_PREFIX?: string[];
};

export type UserInputModuleKeys = keyof UserInput["modules"];

export interface Menu {
  label: string;
  component: JSX.Element;
};

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
  ui_colors: JsonScheme;
  visible_components: Array<keyof UserInput["modules"]>
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

export type JsonObjModule = JsonResultObj[UserInputModuleKeys];

export type JsonResultObjFillIns =
  Pick<JsonResultObj, "app_topic" | "audio" | "books" | "facebook" | "instagram" | "reddit" | "videos" | "twitter">;

export type ServerIs = "online" | "offline";

export interface IntervalsObj {
  [propName: string]: Interval;
  serverCheck: Interval;
  remoteRepoCheck: Interval;
};

export interface SwState {
  activeStep: number;
  isNextStepAllowed: boolean;
  userInput: UserInput;
  jsonObj: JsonResultObj;
  serverState: ServerIs;
  jsonFilesState: FilesState;
};
