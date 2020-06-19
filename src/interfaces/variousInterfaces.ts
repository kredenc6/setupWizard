import Interval from "../classes/Interval";
import { FilesState } from "./fileInterfaces";
import { AlertProps } from "@material-ui/lab/Alert";
import { JsonResultObj } from "./jsonInterfaces";
import { ColorSchemeInt } from "./colorSchemeInterfaces";

export interface Classes {
  [propName: string]: string;
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

export interface MenuInt {
  label: string;
  component: JSX.Element;
};

export type ServerIs = "online" | "offline";

export interface IntervalsObj {
  [propName: string]: Interval | null;
  serverCheck: Interval | null;
};

export interface SwState {
  activeStep: number;
  isNextStepAllowed: boolean;
  userInput: UserInput;
  jsonObj: JsonResultObj;
  serverState: ServerIs;
  jsonFilesState: FilesState;
  pendingMessages: MessageProps[];
  activeMessage: MessageProps | undefined;
  intervals: IntervalsObj;
};

export type MessageType = AlertProps["severity"];

export interface MessageProps {
  text: string;
  type: MessageType;
};