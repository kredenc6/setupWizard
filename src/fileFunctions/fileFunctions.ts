import { createMessage } from "../sWReducer/messageHandlingFunctions";
import { refreshRepoState } from "../gitFunctions/gitFunctions";
import { JsonResultObj } from "../interfaces/interfaces";
import { FileStatus, SaveFileResponse } from "../interfaces/fileInterfaces";
import { SERVER_ADDRESS } from "../initialStates/constants";
import { SWActions } from "../sWReducer/sWReducer";

export const handleSaveToRepo = async (
    shouldCommit: boolean,
    dispatch: React.Dispatch<SWActions>,
    jsonObj: JsonResultObj,
    setOpenPrompt: React.Dispatch<React.SetStateAction<boolean>>
  ): Promise<FileStatus> => {

  const savedSuccessfuly = await saveJson(SERVER_ADDRESS, jsonObj);
  if(!savedSuccessfuly) {
    dispatch({
      type: "addMessage",
      payload: createMessage("error", `Failed to save ${jsonObj.app_topic}.json to repo. No commits or pushes were handled.`)
    });
    return "ready";
  }
  dispatch({
    type: "addMessage",
    payload: createMessage("success", `${jsonObj.app_topic}.json saved.`)
  });

  await refreshRepoState(dispatch);
  if(shouldCommit) {
    setOpenPrompt(true);
    return "being commited";
  }
  return "ready";
};

export async function fetchJsonFiles(serverAddress: string, callback?: (jsonObjs: JsonResultObj[]) => void) {
  // TODO: there should probably be a check whether the jsonObj is JsonResultObj
  return await fetch(`${serverAddress}/jsonFiles`)
    .then(response => response.json())
    .then((jsonObjStrArr: string[]) => {
      const jsonObjArr = jsonObjStrArr.map(jsonObjStr => {
          try {
            return JSON.parse(jsonObjStr);
          } catch(e) {
            console.warn(`Json parsing error: ${e.message}`);
            return null;
          }
        })
        .filter(jsonObj => jsonObj !== null) as JsonResultObj[];

      if(callback) {
        callback(jsonObjArr);
      }
      return jsonObjArr;
    })
    .catch(err => {
      console.log(err.message);
      return [] as JsonResultObj[];
    });
}

export async function saveJson(serverAddress: string, jsonObj: JsonResultObj, callback?: (response: SaveFileResponse) => any) {
  const fileName = normalizeJsonFileName(`${jsonObj.app_topic}.json`);
  return await
    fetch(`${serverAddress}/saveJson`, {
      method: "POST",
      headers: new Headers({ "Content-Type": "application/json" }),
      body: JSON.stringify({ name: fileName, data: jsonObj})
    })
      .then(response => response.json())
      .then((saveFileResponse: SaveFileResponse) => {
        if(callback) callback(saveFileResponse);
        return saveFileResponse.savedSuccessfully;
      })
      .catch(err => {
        console.log(err.message);
        return false;
      })
}

export function normalizeJsonFileName(name: string) {
  return name.trim().replace(/\s/g, "_").toLowerCase();
}

export function downloadJson(jsonObj: JsonResultObj) {
  const fileName = normalizeJsonFileName(`${jsonObj.app_topic}.json`);
  const json = JSON.stringify(jsonObj, null, 2);
  const blob = new Blob([json],{type:'application/json'});
  const href = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = href;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export function loadJsons(fileList: FileList) {
  const fetchedJsons: Promise<JsonResultObj | undefined>[] = [];

  for(let i=0; i < fileList.length; i++) {
    fetchedJsons.push(
      fetch( URL.createObjectURL(fileList[i]) )
        .then(response => response.json())
        .then(json => json)
        .catch(err => console.log(err.message))
    )
  }

  return Promise.all(fetchedJsons)
    .then(resolvedJsons => {
      return resolvedJsons.filter(resolvedJson => resolvedJson) as JsonResultObj[]; // am I missing somethig? It should work without the type assertion
    })
    .catch(err => {
      console.log(err.message);
      return [] as JsonResultObj[];
    });
}