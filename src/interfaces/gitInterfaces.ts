import { CommitSummary } from "./simpleGit";

export interface GitOpt {
  commit: boolean;
  push: boolean;
};

export interface CommitResponse {
  commitedFilesCount: number;
  commitSummary: CommitSummary | null;
};

export interface PushResponse {
  success: boolean;
};