import { StatusResult } from "../interfaces/simpleGit";

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
      .then(commitJson => commitJson)
      .catch(err => console.log(err.message));
}

export async function pushToRemoteRepo(serverAddress: string) {
  return await fetch(`${serverAddress}/gitRepo/push`, { method: "POST" })
    .then(response => response.json())
    .then(pushJson => pushJson)
    .catch(err => console.log(err.message));
}

export async function mergeRemoteRepo(serverAddress: string) {
  return await fetch(`${serverAddress}/gitRepo/merge`)
    .then(response => response.json())
    .then(mergeJson => mergeJson)
    .catch(err => console.log(err.message));
}