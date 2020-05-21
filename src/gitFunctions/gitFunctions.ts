import { MergeSummary, StatusResult } from "../interfaces/simpleGit";
import { LocalStorageRepoState } from "../interfaces/fileInterfaces";
import { CommitResponse, PushResponse } from "../interfaces/gitInterfaces";

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
      .catch(err => console.log(err.message));
}

export async function pushToRemoteRepo(serverAddress: string) {
  return await fetch(`${serverAddress}/gitRepo/push`, { method: "POST" })
    .then(response => response.json())
    .then((pushResponse: PushResponse) => pushResponse.success)
    .catch(err => console.log(err.message));
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