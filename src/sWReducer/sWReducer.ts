import { Reducer } from "react";
import jsonObjFrame from "../initialStates/jsonObjFrame";
import { prefixValue } from "../prefixFunctions/prefixFunctions";
import determineWebPrefix from "../components/Menu/SelectedPlatforms/SelectedPlatform/helpFunctions/determineWebPrefix";
import { createMessage, placeNewMessage } from "./messageHandlingFunctions";
import { MessageProps, ServerIs, SwState, UserInput, UserInputPlatformKeys } from "../interfaces/variousInterfaces";
import { JsonResultObj, JsonResultObjFillIns } from "../interfaces/jsonInterfaces";
import { FilesState } from "../interfaces/fileInterfaces";
import Interval from "../classes/Interval";

interface Action<S extends string> {
  type: S;
}

interface ActionWithPayload<S extends string, P> extends Action<S> {
  payload: P;
};

export type SWActions = 
  Action<"messageDelivered"> |
  ActionWithPayload<"addMessage", (MessageProps)> |
  ActionWithPayload<"changeJson", Partial<JsonResultObj>> |
  ActionWithPayload<"changeJsonFilesState", Partial<FilesState>> |
  ActionWithPayload<"changeSelectedPlatforms", { isSelected: boolean, platformName: UserInputPlatformKeys }> |
  ActionWithPayload<"changeTopic", string> |
  ActionWithPayload<"changeUserInput", Partial<UserInput>> |
  ActionWithPayload<"selectJson", JsonResultObj> |
  ActionWithPayload<"setActiveStep", number> |
  ActionWithPayload<"setIntervals", { [propName: string]: Interval } | null> |
  ActionWithPayload<"setIsNextStepAllowed", boolean> |
  ActionWithPayload<"setServerState", ServerIs> |
  ActionWithPayload<"updateRepoState", number>
;

const sWReducer: Reducer<SwState, SWActions> = (state, action) => {
  switch(action.type) {
    
    case "addMessage": {
      return { ...state, ...placeNewMessage(action.payload, state) };
    }

    case "changeJson": {
      const newJsonObj = { ...state["jsonObj"], ...action.payload };
      return { ...state, jsonObj: newJsonObj };
    }
    
    case "changeJsonFilesState": {
      const newjsonFilesState = { ...state["jsonFilesState"], ...action.payload };
      return  { ...state, jsonFilesState: newjsonFilesState };
    }

    case "changeSelectedPlatforms": {
      const updatedState = handleSelectedComponentsChange(state, action.payload.isSelected, action.payload.platformName);
      const isNextStepAllowed = allowNextStepFromMainMenu(updatedState.userInput.platforms, updatedState.jsonObj.app_topic);
      return { ...updatedState, isNextStepAllowed };
    }

    case "changeTopic": {
      const updatedState = handleTopicChange(action.payload, state);
      const isNextStepAllowed = allowNextStepFromMainMenu(updatedState.userInput.platforms, updatedState.jsonObj.app_topic);
      return { ...updatedState, isNextStepAllowed };
    }

    case "changeUserInput": {
      const newUserInput = { ...state["userInput"], ...action.payload };
      return { ...state, userInput: newUserInput };
    }

    case "messageDelivered": {
      const activeMessage = state.pendingMessages.shift();
      return { ...state, activeMessage, pendingMessages: state.pendingMessages };
    }

    case "selectJson": {
      const updatedState = handleJsonSelection(action.payload, state);
      const isNextStepAllowed = allowNextStepFromMainMenu(updatedState.userInput.platforms, updatedState.jsonObj.app_topic);
      return { ...updatedState, isNextStepAllowed };
    }

    case "setActiveStep": {
      return { ...state, activeStep: action.payload };
    }

    case "setIntervals": {
      const newIntervals = { ...state.intervals, ...action.payload };
      return { ...state, intervals: newIntervals };
    }

    case "setIsNextStepAllowed": {
      return { ...state, isNextStepAllowed: action.payload };
    }

    case "setServerState": {
      if(state.serverState === action.payload) return state;
      return { ...state, serverState: action.payload };
    }

    default: {
      const errorMessage = createMessage("error", "Unknown case in the reducer!");
      return { ...state, ...placeNewMessage(errorMessage, state) };
    }
  }
};

export default sWReducer;

function handleJsonSelection(newJsonObj: JsonResultObj, state: SwState): SwState {
  const newPlatforms: UserInput["platforms"] = JSON.parse(JSON.stringify(state.userInput.platforms));
  // find out which platforms in json are visible(selected) so it can be transeferd into userInput
  for(const platformName of Object.keys(state.userInput.platforms)) {
    const isSelected = newJsonObj.visible_components.includes(platformName as keyof UserInput["platforms"]);
    newPlatforms[platformName as keyof UserInput["platforms"]].selected = isSelected; // the transfer
  };
  return {
    ...state,
    jsonObj: newJsonObj,
    userInput: { ...state["userInput"], platforms: newPlatforms }
  };
}

function handleTopicChange(value: string, state: SwState) {
  const { jsonFilesState, jsonObj, userInput } = state;
  const appTopicIndex = jsonFilesState.loadedJsons.findIndex(loadedJson => loadedJson.app_topic === value);
  const fillPlatforms = userInput.setAlsoAsChannelValues;
  
  if(appTopicIndex !== -1) { // if some loaded json alredy has this app topic set it as active
    return handleJsonSelection(jsonFilesState.loadedJsons[appTopicIndex], state);
  }

  if(userInput.resetJsonOnAppTopicChange) {
    const newJson: JsonResultObj = { ...jsonObjFrame, ...fillInTopicValue(jsonObj, userInput.platforms, value, fillPlatforms) };
    return handleJsonSelection(newJson, state);
  } else {
    const changedJson: JsonResultObj = { ...jsonObj, ...fillInTopicValue(jsonObj, userInput.platforms, value, fillPlatforms) };
    return { ...state, jsonObj: changedJson };
  }
}

export function fillInTopicValue(jsonObj: JsonResultObj, platforms: UserInput["platforms"], value: string, toPlatforms = false) {
  if(!toPlatforms) {
    return { 
      app_topic: value,
      twitter: [ { ...jsonObj["twitter"][0], channel_name: value } ]
     };
  }

  const prePrepedPlatforms: JsonResultObjFillIns = {
    app_topic: value,
    audio: [ ...jsonObj.audio.map((audioObj, i) => {
      return { ...audioObj, queries: [ prefixValue(determineWebPrefix(platforms.audio, i), value) ] }
    })],
    books: [ ...jsonObj.books.map((bookObj, i) => {
      return { ...bookObj, queries: [ prefixValue(determineWebPrefix(platforms.books, i), value) ] }
    })],
    facebook: {
      ...jsonObj.facebook,
      channel: prefixValue(determineWebPrefix(platforms.facebook, 0), value)
    },
    instagram: {
      ...jsonObj.instagram,
      main_channel: prefixValue(determineWebPrefix(platforms.instagram, 0), value)
    },
    reddit: {
      ...jsonObj.reddit,
      sub_reddit: prefixValue(determineWebPrefix(platforms.reddit, 0), value)
    },
    videos:    [ ...jsonObj.videos.map((videoObj, i) => {
      return { ...videoObj, queries: [ prefixValue(determineWebPrefix(platforms.videos, i), value) ] }
    })],
    twitter:   [{
      ...jsonObj["twitter"][0],
      channel_name: value,
      url: prefixValue(determineWebPrefix(platforms.twitter, 0), value)
    }]
  };

  const selectedPlatformsObj: Partial<JsonResultObjFillIns> = { app_topic: value };
  jsonObj.visible_components.forEach(platform => {
    if(platform !== "websites" && platform !=="events") {
      assingSelectedPlatform.call(selectedPlatformsObj, platform);
    }
  })
  
  return selectedPlatformsObj;

  function assingSelectedPlatform<K extends keyof JsonResultObjFillIns>(this: Partial<JsonResultObjFillIns>, platformName: K) {
    this[platformName] = prePrepedPlatforms[platformName];
  }
}

function handleSelectedComponentsChange(state: SwState, isSelected: boolean, platformName: UserInputPlatformKeys) {
  const { jsonObj, userInput } = state;
  //adjust userInput
  const updatedPlatforms = { ...userInput.platforms, [platformName]: { ...userInput.platforms[platformName], selected: isSelected } };
  const updatedUserInput = { ...userInput, platforms: updatedPlatforms };
  
  //adjust jsonObj
  const visible_components = Object.entries(updatedPlatforms)
  .filter(([_, platform]) => platform.selected)
  .map(([key, _]) => key) as UserInputPlatformKeys[];

  let newJsonObj = { ...jsonObj, visible_components };

  if(state.userInput.setAlsoAsChannelValues) {
    const adjustedJsonObj = { ...jsonObj, visible_components }
    const filledInPlatforms = fillInTopicValue(adjustedJsonObj, userInput.platforms, jsonObj.app_topic, true);
    
    newJsonObj = { ...newJsonObj, ...filledInPlatforms };
  }

  return { ...state, userInput: updatedUserInput, jsonObj: newJsonObj };
};

function allowNextStepFromMainMenu(platforms: UserInput["platforms"], appTopic: string) {
  //BUG? it's possible to have platform prop "show_in_app" value true and the "visible_components" json prop
  // without the platform - Rik has the say how to implement this
  const isAtLeastOnePlatformSelected = (platforms: UserInput["platforms"]) => {
    return Object.entries(platforms).some(([_, platform]) => {
      return platform.selected;
    });
  };
  const isAppTopicValid = (appTopic: string) => appTopic.trim().length >= 2;
  
  return isAtLeastOnePlatformSelected(platforms) && isAppTopicValid(appTopic);
}