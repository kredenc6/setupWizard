import { SwState, UserInput } from "../interfaces/variousInterfaces";
import { FilesState } from "../interfaces/fileInterfaces";
import jsonObjFrame from "./jsonObjFrame";
import { getLocalStorageRepoState } from "../gitFunctions/gitFunctions";
import { createSchemeObjFromPresetScheme } from "../miscellaneous/colorSchemeFunctions";

export const initialFilesState: FilesState = {
  lastRepoUpdate: getLocalStorageRepoState()?.timeStamp || 0,
  loadedJsons: [],
  localRepoState: getLocalStorageRepoState()?.state || null,
  fileStatus: "ready"
};

export const initialUserInput: UserInput = {
  resetJsonOnAppTopicChange: true,
  setAlsoAsChannelValues: true,
  schemeObj: createSchemeObjFromPresetScheme(jsonObjFrame.ui_colors),
  platforms: {
    audio: {
      selected: false,
      VERIFY_BY_PROXY: ["blocked_tracks", "queries"],
      WEB_PREFIX: ["https://www.soundcloud.com/"]
    },
    books: {
      selected: false
    },
    events: {
      selected: false
    },
    instagram: {
      selected: false,
      VERIFY_BY_PROXY: ["main_channel", "other_channels"],
      WEB_PREFIX: ["https://www.instagram.com/"]
    },
    facebook: {
      selected: false,
      VERIFY_BY_PROXY: ["channel"],
      WEB_PREFIX: ["https://www.facebook.com/"]
    },
    reddit: {
      selected: false,
      VERIFY_BY_PROXY: ["sub_reddit"],
      WEB_PREFIX: ["https://www.reddit.com/r/"]
    },
    twitter: {
      selected: false,
      WEB_PREFIX: ["https://www.twitter.com/"]
    },
    videos: {
      selected: false,
      VERIFY_BY_PROXY: ["blocked_videos", "queries"],
      WEB_PREFIX: ["https://www.youtube.com/", "https://vimeo.com/"]
    },
    websites: {
      selected: false,
      VERIFY_BY_PROXY: ["SELF"]
    }
  }
};

export const initialReducerState: SwState = {
  activeStep: 1,
  isNextStepAllowed: false,
  userInput: initialUserInput,
  jsonObj: jsonObjFrame,
  serverState: "offline",
  jsonFilesState: initialFilesState,
  pendingMessages: [],
  activeMessage: undefined,
  intervals: {
    serverCheck: null
  }
};