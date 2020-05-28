import { SwState, UserInput } from "../interfaces/interfaces";
import { FilesState } from "../interfaces/fileInterfaces";
import jsonObjFrame from "./jsonObjFrame";
import theme from "../theme/theme";
import { getLocalStorageRepoState } from "../gitFunctions/gitFunctions";
import { createSchemeObjFromPresetScheme } from "../miscellaneous/colorSchemeFunctions";

export const initialFilesState: FilesState = {
  lastRepoUpdate: getLocalStorageRepoState()?.timeStamp || 0,
  loadedJsons: [],
  localRepoState: null,
  fileStatus: "ready"
};

export const initialUserInput: UserInput = {
  resetJsonOnAppTopicChange: true,
  setAlsoAsChannelValues: true,
  schemeObj: createSchemeObjFromPresetScheme(jsonObjFrame.ui_colors, theme.palette.getContrastText),
  modules: {
    audio: {
      selected: false,
      VERIFY_BY_PROXY: ["queries"],
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
      VERIFY_BY_PROXY: ["url"],
      WEB_PREFIX: ["https://www.twitter.com/"]
    },
    videos: {
      selected: false,
      VERIFY_BY_PROXY: ["queries"],
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
  activeMessage: undefined
};