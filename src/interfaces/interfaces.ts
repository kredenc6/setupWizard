export interface Classes {
  [propName: string]: string;
};

export interface SchemeObj {
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
  appTopic: string;
  schemeObj: SchemeObj;
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
  webPrefix?: string;
  selected: boolean;
  webPage?: string;
}

export interface Menu {
  label: string;
  component: JSX.Element;
}

export interface JSONResultObj {
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
  visible_components: {
    [propName: number]: keyof UserInput["modules"];
  };
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
  videos: Videos[];
  audio: Audio[];
  books: Books[];
  twitter: Array<{
    channel_name: string;
    url: string;
    main_feed: boolean;
    show_in_app: boolean;
  }>,
  events: string;
};

interface Media {
  source: string;
  show_in_app: boolean;
  queries: string[];
};

interface Audio extends Media {
  blocked_tracks: string[];
};

interface Books extends Media {
  blocked_book_ids: string[];
};

interface Videos extends Media {
  blocked_videos: string[];
};
