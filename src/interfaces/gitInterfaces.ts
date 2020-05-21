import { CommitSummary } from "./simpleGit";

export interface GitOpt {
  commit: boolean;
  push: boolean;
};

export interface CommitResponse {
  addedFilesCount: number;
  commitSummary: CommitSummary;
};

export interface PushResponse {
  success: boolean;
};