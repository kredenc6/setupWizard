import React, { useState } from "react";
import { Dialog, DialogContent } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import SimpleBar from "simplebar-react";
import AvailableJsonsAppBar from "./AvailableJsonsAppBar/AvailableJsonsAppBar";
import JsonCard from "./JsonCard/JsonCard";
import DataDisplay from "../sharedComponents/DataDisplay";
import { JsonResultObj } from "../../interfaces/interfaces";
import { StatusResult } from "../../interfaces/simpleGit";
import { FilesState } from "../../interfaces/fileInterfaces";
import "simplebar/dist/simplebar.min.css";

interface Props {
  activeJsonObj: JsonResultObj;
  handleJsonSelection: (jsonObj: JsonResultObj) => void;
  jsonFilesState: FilesState;
  open: boolean;
  setIsJsonSelectionOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

const useStyles = makeStyles({
  dialog: {
    maxHeight: "90vh"
  },
  dialogContent: {
    display: "flex",
    flexFlow: "row nowrap",
    overflow: "hidden"
  },
  simpleBar: {
    width: "70%"
  },
  jsonFileCards: {
    display: "flex",
    flexFlow: "row wrap",
    justifyContent: "center",
    overflow: "auto"
  },
  jsonObjView: {
    display: "inline-box",
    width: "30%"
  },
  jsonWrapper: {
    minWidth: "25rem",
    width: "100%",
    maxHeight: "100%",
    height: "75vh",
    padding: "1rem"
  }
});

export default function AvaiableJsons ({ activeJsonObj, handleJsonSelection, jsonFilesState, open, setIsJsonSelectionOpen }: Props) {
  const classes = useStyles();
  const { loadedJsons, localRepoState: gitState } = jsonFilesState;
  const [selectedJsonObj, setSelectedJsonObj] = useState<JsonResultObj>(activeJsonObj);

  const handleCardClick = (jsonAppTopic: string) => {
    if(jsonAppTopic === selectedJsonObj.app_topic) {
      handleJsonSelection(selectedJsonObj);
    } else {
      const newSelectedJsonObj = loadedJsons.find(json => json.app_topic === jsonAppTopic);
      if(newSelectedJsonObj) {
        setSelectedJsonObj(newSelectedJsonObj);
      }
    }
  };

  const handleCardDblClick = (jsonAppTopic: string) => {
    const newSelectedJsonObj = loadedJsons.find(json => json.app_topic === jsonAppTopic);
    if(newSelectedJsonObj) {
      handleJsonSelection(newSelectedJsonObj);
    }
  };

  const jsonCardComponents = loadedJsons.map(({ app_topic }) =>
    <JsonCard
      active={app_topic === `${activeJsonObj.app_topic}`}
      handleCardClick={handleCardClick}
      handleCardDblClick={handleCardDblClick}
      fileGitState={getFileGitState(`${app_topic}.json`, gitState)}
      jsonAppTopic={app_topic}
      key={app_topic}
      selected={app_topic === `${selectedJsonObj.app_topic}`} />);

  return(
    <Dialog
      className={classes.dialog}
      fullWidth maxWidth="xl"
      onKeyDown={e => {
        if(e.key === "Escape") setIsJsonSelectionOpen(false);
      }}
      open={open}
    >
      <AvailableJsonsAppBar fileCount={jsonFilesState.loadedJsons.length} setIsJsonSelectionOpen={setIsJsonSelectionOpen} />
      <DialogContent className={classes.dialogContent}>
        <SimpleBar className={classes.simpleBar}>
          <div className={classes.jsonFileCards}>
            {jsonCardComponents}
          </div>
        </SimpleBar>
        <div className={classes.jsonObjView}>
          <DataDisplay classes={{ jsonWrapper: classes.jsonWrapper }} data={selectedJsonObj} />
        </div>
      </DialogContent>
    </Dialog>
  );
};

function getFileGitState(fileName: string, gitState: StatusResult | null) {
  if(!gitState) return [];

  const fileGitState: string[] = [];
  for(let [key, value] of Object.entries(gitState)) {
    if(Array.isArray(value)) {
      if(value.includes(fileName)) {
        fileGitState.push(key);
      }
    }
  }
  return fileGitState;
}