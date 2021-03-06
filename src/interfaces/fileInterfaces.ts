import { JsonResultObj } from "./jsonInterfaces";
import { StatusResult } from "./simpleGit";

export type FileStatus = "ready" | "being saved" | "being commited" | "being pushed";

export interface FilesState {
  lastRepoUpdate: number;
  loadedJsons: JsonResultObj[];
  localRepoState: StatusResult | null;
  fileStatus: FileStatus;
};

export interface LocalStorageRepoState {
  timeStamp: number;
  state: StatusResult;
};

export interface SaveFileResponse {
  fileName: string;
  savedSuccessfully: boolean;
};