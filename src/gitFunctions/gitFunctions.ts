import { createMessage } from "../sWReducer/messageHandlingFunctions";
import { MergeSummary, StatusResult } from "../interfaces/simpleGit";
import { LocalStorageRepoState, FileStatus } from "../interfaces/fileInterfaces";
import { CommitResponse, PushResponse, GitOpt } from "../interfaces/gitInterfaces";
import { SWActions } from "../sWReducer/sWReducer";
import { REMOTE_REPO_CHECK_INTERVAL, SERVER_ADDRESS } from "../initialStates/constants";

interface HandleCommitProps {
  commitMessage: string;
  dispatch: React.Dispatch<SWActions>;
  gitOptions?: GitOpt;
  localRepoState: StatusResult | null;
};

export const handleMerge = async (dispatch: React.Dispatch<SWActions>) => {
  const mergeSummary = await mergeRemoteRepo(SERVER_ADDRESS);
  const messageTopic = mergeSummary ? "success" : "warning";
  const messageText = mergeSummary? "Merge successful." : "Merge failed.";
  dispatch({ type: "addMessage", payload: createMessage(messageTopic, messageText) });
  refreshRepoState(dispatch);
  return mergeSummary;
};

export const handleCommit =
  async ({ commitMessage, dispatch, gitOptions, localRepoState }: HandleCommitProps): Promise<FileStatus> => {
  if(!localRepoState) {
    dispatch({ type: "addMessage", payload: createMessage("error", "Invalid repo state! No files commited.") });
    return "ready";
  }

  const filesForCommit = getFileNamesForCommit(localRepoState) || [];
  if(!filesForCommit.length) {
    dispatch({ type: "addMessage", payload: createMessage("error", "It seems git did not register the new file addition.") });
    console.log("Before commiting again try refreshing the repo or re-save the file.");
    console.log("No files were commited.");
    return "ready";
  }

  const commitResponse = await commitRepo(SERVER_ADDRESS, commitMessage, filesForCommit);
  const messageType = commitResponse?.commitedFilesCount ? "success" : "warning";
  const messageText = commitResponse ? `${commitResponse.commitedFilesCount} file(s) commited.` : "Commit failed.";
  dispatch({ type: "addMessage", payload: createMessage(messageType, messageText) });
  
  refreshRepoState(dispatch);
  
  if(commitResponse && gitOptions?.push) {
    return "being pushed";
  }

  return "ready";
};

export const handlePush = async (dispatch: React.Dispatch<SWActions>): Promise<FileStatus> => {
  const pushSucces = await pushToRemoteRepo(SERVER_ADDRESS);
  const messageType = pushSucces ? "success" : "warning";
  const messageText = pushSucces ? "Push was successful." : "Push failed";
  dispatch({ type: "addMessage", payload: createMessage(messageType, messageText) });
  refreshRepoState(dispatch);
  return "ready";
};

export async function refreshRepoState(dispatch: React.Dispatch<SWActions>) {
  return fetchRepoStatus(SERVER_ADDRESS)
    .then(state => {
      if(state) {
        const timeStamp = Date.now();
        localStorage.setItem("repoState", JSON.stringify({ timeStamp, state }));
        dispatch({ type: "changeJsonFilesState", payload: { localRepoState: state, lastRepoUpdate: timeStamp } });
        dispatch({ type: "addMessage", payload: createMessage("info", "Repo state updated.") });
      
      } else {
        dispatch({ type: "addMessage", payload: createMessage("error", "Failed to fetch remote repo status.") });
      }
    });
}

export const shouldRepoStateBeRefreshed = (lastUpdateTime: number, timeNow = Date.now()) => {
  const isTimeIntervalExceeded = timeNow - lastUpdateTime > REMOTE_REPO_CHECK_INTERVAL;
  return isTimeIntervalExceeded;
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
    .catch(err => {
      console.log(err.message);
      return null;
    });
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