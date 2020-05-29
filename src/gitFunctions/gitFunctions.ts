import { createMessage } from "../sWReducer/messageHandlingFunctions";
import { MergeSummary, StatusResult } from "../interfaces/simpleGit";
import { LocalStorageRepoState, FilesState, FileStatus } from "../interfaces/fileInterfaces";
import { CommitResponse, PushResponse, GitOpt } from "../interfaces/gitInterfaces";
import { SWActions } from "../sWReducer/sWReducer";
import Interval from "../classes/Interval";
import { SERVER_ADDRESS } from "../initialStates/constants";

interface HandleCommitProps {
  commitMessage: string;
  dispatch: React.Dispatch<SWActions>;
  gitOptions?: GitOpt;
  jsonFilesState: FilesState;
  remoteRepoCheckInterval: Interval;
  serverState: string;
}

export const handleCommit =
  async ({ dispatch, commitMessage, jsonFilesState, serverState, remoteRepoCheckInterval, gitOptions }: HandleCommitProps): Promise<FileStatus> => {
  if(!jsonFilesState.localRepoState) {
    dispatch({ type: "addMessage", payload: createMessage("error", "Invalid repo state! No files commited.") });
    return "ready";
  }

  const filesForCommit = getFileNamesForCommit(jsonFilesState.localRepoState) || [];
  if(!filesForCommit.length) {
    dispatch({ type: "addMessage", payload: createMessage("error", "It seems git did not register the new file addition.") });
    console.log("Before commiting again try refreshing the repo or re-save the file.");
    console.log("No files were commited.");
    return "ready";
  }

  const commitResponse = await commitRepo(SERVER_ADDRESS, commitMessage, filesForCommit);
  console.log(commitResponse?.commitedFilesCount);
  const messageType = commitResponse?.commitedFilesCount ? "success" : "warning";
  const messageText = commitResponse ? `${commitResponse.commitedFilesCount} file(s) commited.` : "Commit failed.";
  dispatch({ type: "addMessage", payload: createMessage(messageType, messageText) });
  
  if(commitResponse && gitOptions?.push) {
    return "being pushed";
  }

  remoteRepoCheckInterval.executeNow(true, [serverState, jsonFilesState.lastRepoUpdate, true]); // force repo state update
  return "ready";
};

export const handlePush = async (dispatch: React.Dispatch<SWActions>): Promise<FileStatus> => {
  const pushSucces = await pushToRemoteRepo(SERVER_ADDRESS);
  const messageType = pushSucces ? "success" : "warning";
  const messageText = pushSucces ? "Push was successful." : "Push failed";
  dispatch({ type: "addMessage", payload: createMessage(messageType, messageText) });
  return "ready";
};


export async function fetchRepoStatus(
  serverAddress: string, callback?: (repoState: StatusResult) => void) {
    return await fetch(`${serverAddress}/gitRepo/status`)
      .then(response => response.json())
      .then((repoState: StatusResult) => {
        if(callback) callback(repoState);
        return repoState; 
      })
      .catch(err => {
        console.log(err.message);
        return null;
      });
}

export async function commitRepo(serverAddress: string, message: string, files: string[]) {
  const body = JSON.stringify({ message, files });
  
  return await fetch(`${serverAddress}/gitRepo/commit`,
    { headers: new Headers({ "Content-Type": "application/json" }), method: "POST", body })
      .then(response => response.json())
      .then((commitResponse: CommitResponse) => commitResponse)
      .catch(err => {
        console.log(err.message);
        return null;
      });
}

export async function pushToRemoteRepo(serverAddress: string) {
  return await fetch(`${serverAddress}/gitRepo/push`, { method: "POST" })
    .then(response => response.json())
    .then((pushResponse: PushResponse) => pushResponse.success)
    .catch(err => {
      console.log(err.message);
      return null;
    });
}

export async function mergeRemoteRepo(serverAddress: string) {
  return await fetch(`${serverAddress}/gitRepo/merge`)
    .then(response => response.json())
    .then((mergeResponse: MergeSummary | null) => mergeResponse)
    .catch(err => console.log(err.message));
}

export function getLocalStorageRepoState() {
  const repoStateString = localStorage.getItem("repoState") || undefined;
  return repoStateString ? JSON.parse(repoStateString) as LocalStorageRepoState : undefined;
}

export function getFileNamesForCommit(gitState: StatusResult) {
  const GET_FILENAMES_FROM = ["created", "deleted", "modified", "not_added", "renamed", "staged"];
  const fileNames: Set<string> = new Set();

  Object.entries(gitState).forEach(([key, value]) => {
    if(GET_FILENAMES_FROM.includes(key)) {
      for(const fileName of value) {
        fileNames.add(fileName);
      }
    }
  });

  return Array.from(fileNames);
}