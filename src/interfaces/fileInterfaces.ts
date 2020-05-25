import { JsonResultObj } from "./interfaces";
import { StatusResult } from "./simpleGit";

export interface FilesState {
  lastRepoUpdate: number;
  loadedJsons: JsonResultObj[];
  localRepoState: StatusResult | null;
};

export interface LocalStorageRepoState {
  timeStamp: number;
  state: StatusResult;
};

export interface SaveFileResponse {
  fileName: string;
  savedSuccessfully: boolean;
};