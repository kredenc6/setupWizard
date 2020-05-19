import { JsonResultObj, SaveFileResponse } from "../interfaces/interfaces";

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
        .filter(jsonObj => jsonObj !== null);

      if(callback) {
        callback(jsonObjArr);
      }
      return jsonObjArr;
    })
    .catch(err => {
      console.log(err.message);
      return null;
    });
}

export async function saveJson(serverAddress: string, jsonObj: JsonResultObj, callback?: (response: SaveFileResponse) => void) {
  return await
    fetch(`${serverAddress}/saveJson`, {
      method: "POST",
      headers: new Headers({ "Content-Type": "application/json" }),
      body: JSON.stringify({ name: `${jsonObj.app_topic}.json`, data: jsonObj})
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

function normalizeJsonfileName(name: string) {
  return name.trim().replace(/\s/g, "_").toLowerCase();
}

export function downloadJson(jsonObj: JsonResultObj) {
  const fileName = normalizeJsonfileName(jsonObj.app_topic);
  const json = JSON.stringify(jsonObj, null, 2);
  const blob = new Blob([json],{type:'application/json'});
  const href = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = href;
  link.download = fileName + ".json";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}