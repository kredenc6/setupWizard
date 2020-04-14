export interface Classes {
  [propName: string]: string;
};

export interface SchemeObj {
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

export interface PresetScheme {
  name: string;
  primaryColor: string;
  primaryLightColor: string;
  primaryDarkColor: string;
  primaryTextColor: string;
  secondaryColor: string;
  secondaryLightColor: string;
  secondaryDarkColor: string;
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
    video: Module;
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