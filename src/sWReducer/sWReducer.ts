import { Reducer } from "react";
import jsonObjFrame from "../jsonObjFrame/jsonObjFrame";
import { prefixValue } from "../components/sharedComponents/VerifyUrlTextField";
import determineWebPrefix from "../components/SelectedModule/helpFunctions/determineWebPrefix";
import { JsonResultObj, JsonResultObjFillIns, ServerIs, SwState, UserInput } from "../interfaces/interfaces";
import { FilesState } from "../interfaces/fileInterfaces";

interface Action<S extends string> {
  type: S;
}

interface ActionWithPayload<S extends string, P> extends Action<S> {
  payload: P;
};

export type SWActions = 
  ActionWithPayload<"changeJson", Partial<JsonResultObj>> |
  ActionWithPayload<"changeJsonFilesState", Partial<FilesState>> |
  ActionWithPayload<"changeTopic", string> |
  ActionWithPayload<"changeUserInput", Partial<UserInput>> |
  ActionWithPayload<"selectJson", JsonResultObj> |
  ActionWithPayload<"setActiveStep", number> |
  ActionWithPayload<"setIsNextStepAllowed", boolean> |
  ActionWithPayload<"setServerState", ServerIs> |
  Action<"test">
;


const sWReducer: Reducer<SwState, SWActions> = (state, action) => {
  switch(action.type) {
    
    case "changeJson": {
      const newJsonObj = { ...state["jsonObj"], ...action.payload };
      return { ...state, jsonObj: newJsonObj };
    }
    
    case "changeJsonFilesState": {
      const newjsonFilesState = { ...state["jsonFilesState"], ...action.payload };
      return { ...state, jsonFilesState: newjsonFilesState };
    }

    case "changeTopic": {
      const updatedState = handleTopicChange(action.payload, state);
      return updatedState;
    }

    case "changeUserInput": {
      const newUserInput = { ...state["userInput"], ...action.payload };
      return { ...state, userInput: newUserInput };
    }

    case "selectJson": {
      const updatedState = handleJsonSelection(action.payload, state);
      return updatedState;
    }

    case "setActiveStep": {
      return { ...state, activeStep: action.payload };
    }

    case "setIsNextStepAllowed": {
      return { ...state, isNextStepAllowed: action.payload };
    }

    case "setServerState": {
      return { ...state, serverState: action.payload };
    }

    case "test": {
      console.log("Text successful.");
      return state;
    }

    default: {
      throw new Error("Something went wrong in the reducer.");
    }
  }
};

export default sWReducer;

function handleJsonSelection(newJsonObj: JsonResultObj, state: SwState): SwState {
  const newModules: UserInput["modules"] = JSON.parse(JSON.stringify(state.userInput.modules));
  // find out which modules in json are visible(selected) so it can be transeferd into userInput
  for(const moduleName of Object.keys(state.userInput.modules)) {
    const isSelected = newJsonObj.visible_components.includes(moduleName as keyof UserInput["modules"]);
    newModules[moduleName as keyof UserInput["modules"]].selected = isSelected; // the transfer
  };
  return {
    ...state,
    jsonObj: newJsonObj,
    userInput: { ...state["userInput"], modules: newModules }
  };
}

function handleTopicChange(value: string, state: SwState) {
  const { jsonFilesState, jsonObj, userInput } = state;
  const appTopicIndex = jsonFilesState.loadedJsons.findIndex(loadedJson => loadedJson.app_topic === value);
  const fillModules = userInput.setAlsoAsChannelValues;
  
  if(appTopicIndex !== -1) { // if some loaded json alredy has this app topic set it as active
    return handleJsonSelection(jsonFilesState.loadedJsons[appTopicIndex], state);
  }

  if(userInput.resetJsonOnAppTopicChange) {
    const newJson: JsonResultObj = { ...jsonObjFrame, ...fillInTopicValue(jsonObj, userInput.modules, value, fillModules) };
    return handleJsonSelection(newJson, state);
  } else {
    const changedJson: JsonResultObj = { ...jsonObj, ...fillInTopicValue(jsonObj, userInput.modules, value, fillModules) };
    return { ...state, jsonObj: changedJson };
  }
}

export function fillInTopicValue(jsonObj: JsonResultObj, modules: UserInput["modules"], value: string, toModules = false) {
  if(!toModules) {
    return { 
      app_topic: value,
      twitter: [ { ...jsonObj["twitter"][0], channel_name: value } ]
     };
  }

  const prePrepedModules: JsonResultObjFillIns = {
    app_topic: value,
    audio: [ ...jsonObj.audio.map((audioObj, i) => {
      return { ...audioObj, queries: [ prefixValue(determineWebPrefix(modules.audio, i), value) ] }
    })],
    books: [ ...jsonObj.books.map((bookObj, i) => {
      return { ...bookObj, queries: [ prefixValue(determineWebPrefix(modules.books, i), value) ] }
    })],
    facebook: {
      ...jsonObj.facebook,
      channel: prefixValue(determineWebPrefix(modules.facebook, 0), value)
    },
    instagram: {
      ...jsonObj.instagram,
      main_channel: prefixValue(determineWebPrefix(modules.instagram, 0), value)
    },
    reddit: {
      ...jsonObj.reddit,
      sub_reddit: prefixValue(determineWebPrefix(modules.reddit, 0), value)
    },
    videos:    [ ...jsonObj.videos.map((videoObj, i) => {
      return { ...videoObj, queries: [ prefixValue(determineWebPrefix(modules.videos, i), value) ] }
    })],
    twitter:   [{
      ...jsonObj["twitter"][0],
      channel_name: value,
      url: prefixValue(determineWebPrefix(modules.twitter, 0), value)
    }]
  };

  const selectedModulesObj: Partial<JsonResultObjFillIns> = { app_topic: value };
  jsonObj.visible_components.forEach(module => {
    if(module !== "websites" && module !=="events") {
      assingSelectedModule.call(selectedModulesObj, module);
    }
  })
  
  return selectedModulesObj;

  function assingSelectedModule<K extends keyof JsonResultObjFillIns>(this: Partial<JsonResultObjFillIns>, moduleName: K) {
    this[moduleName] = prePrepedModules[moduleName];
  }
}

