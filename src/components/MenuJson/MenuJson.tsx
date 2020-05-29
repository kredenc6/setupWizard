import React, { useState } from "react";
import { Button } from "@material-ui/core";
import { createStyles, makeStyles } from "@material-ui/core/styles";
import RestJsonPropsComponent from "./RestJsonPropsComponent/RestJsonPropsComponent";
import SaveToRepoBtt from "./SaveToRepoBtt/SaveToRepoBtt";
import GitStateReport from "../sharedComponents/GitStateReport/GitStateReport";
import DataDisplay from "../sharedComponents/DataDisplay";
import PromptCommitMessage from "../sharedComponents/GitStateReport/GitActions/PromptCommitMsg/PromptCommitMsg";
import ClearJsonBtt from "./ClearJsonBtt/ClearJsonBtt";
import { SERVER_ADDRESS } from "../../initialStates/constants";
import { downloadJson, saveJson } from "../../fileFunctions/fileFunctions";
import { handleCommit, handlePush } from "../../gitFunctions/gitFunctions";
import { createMessage } from "../../sWReducer/messageHandlingFunctions";
import { JsonObjKey, JsonResultObj, ServerIs, UserInput } from "../../interfaces/interfaces";
import { GitOpt } from "../../interfaces/gitInterfaces";
import { FilesState, FileStatus } from "../../interfaces/fileInterfaces";
import Interval from "../../classes/Interval";
import { SWActions } from "../../sWReducer/sWReducer";

interface Props {
  dispatch: React.Dispatch<SWActions>;
  jsonFilesState: FilesState;
  jsonObj: JsonResultObj;
  remoteRepoCheckInterval: Interval;
  serverState: ServerIs;
  userInput: UserInput;
};

const useStyles = makeStyles(theme =>
  createStyles({
    menuJson: {
      width: "100%",
      display: "flex",
      justifyContent: "space-between"
    },
    jsonWrapper: {
      minWidth: "25rem",
      maxHeight: "100%",
      padding: "1rem",
      "overflow-y": "auto"
    },
    buttonsWrapper: {
      height: "100%",
      display: "grid",
      gridGap: theme.spacing(1),
      gridTemplateRows: "auto auto 1fr 1fr auto"
    }
  })
);

export default function MenuJson(
  { dispatch, jsonFilesState, jsonObj, remoteRepoCheckInterval, serverState, userInput }: Props) {
  const [gitOptions, setGitOptions] = useState<GitOpt>({ commit: false, push: false });
  const [openPrompt, setOpenPrompt] = useState(false);
  const [commitMessage, setCommitMessage] = useState("");
  const classes = useStyles();
  const restJsonProps = Object.entries(jsonObj)
    .filter(([key, _]) => {
      return !Object.keys(userInput.modules) // skip modules...
        .concat(["visible_components", "app_topic", "ui_colors"]) // and these properties
        .includes(key); // condition or filter method
  });

  const handleJsonChange = (key: JsonObjKey, changedModule: JsonResultObj[JsonObjKey]) => {
    dispatch({ type: "changeJson", payload: { [key]: changedModule } });
  };

  const handleSaveToRepo = async (): Promise<FileStatus> => {
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

    //TODO failed update is not catched
    await remoteRepoCheckInterval.executeNow(true, [serverState, jsonFilesState.lastRepoUpdate, true]); //  force repo state update
    
    if(gitOptions.commit) {
      setOpenPrompt(true);
      return "being commited";
    }
    return "ready";
  };

  // const handleCommit = async (): Promise<FileStatus> => {
  //   console.log("lksdfjsdlkfjsdlk");
  //   if(!jsonFilesState.localRepoState) {
  //     dispatch({ type: "addMessage", payload: createMessage("error", "Invalid repo state! No files commited.") });
  //     return "ready";
  //   }

  //   const filesForCommit = getFileNamesForCommit(jsonFilesState.localRepoState) || [];
  //   if(!filesForCommit.length) {
  //     dispatch({ type: "addMessage", payload: createMessage("error", "It seems git did not register the new file addition.") });
  //     console.log("Before commiting again try refreshing the repo or re-save the file.");
  //     console.log("No files were commited.");
  //     return "ready";
  //   }

  //   const commitResponse = await commitRepo(SERVER_ADDRESS, commitMsg, filesForCommit);
  //   const messageType = commitResponse?.commitedFilesCount ? "success" : "warning";
  //   const messageText = commitResponse?.commitedFilesCount ? "Commit was successful." : "Commit failed.";
  //   console.log(messageText);
  //   dispatch({ type: "addMessage", payload: createMessage(messageType, messageText) });
    
  //   if(commitResponse && gitOptions.push) {
  //     return "being pushed";
  //   }

  //   remoteRepoCheckInterval.executeNow(true, [serverState, jsonFilesState.lastRepoUpdate, true]); // force repo state update
  //   return "ready";
  // };

  // const handlePush = async (): Promise<FileStatus> => {
  //   const pushSucces = await pushToRemoteRepo(SERVER_ADDRESS);
  //   const messageType = pushSucces ? "success" : "warning";
  //   const messageText = pushSucces ? "Push was successful." : "Push failed";
  //   dispatch({ type: "addMessage", payload: createMessage(messageType, messageText) });
  //   return "ready";
  // };

  return(
    <section className={classes.menuJson}>
      <PromptCommitMessage
        handleChange={(value: string) => setCommitMessage(value)}
        open={openPrompt}
        sendCommit={async () => {
          dispatch({
            type: "changeJsonFilesState",
            payload: { fileStatus: await handleCommit({ dispatch, commitMessage, jsonFilesState, serverState, remoteRepoCheckInterval, gitOptions }) }
          });
          if(gitOptions.push) {
            dispatch({ type: "changeJsonFilesState", payload: { fileStatus: await handlePush(dispatch) } });
          }
        }}
        setOpen={setOpenPrompt}
        value={commitMessage} />
      <div>
        <RestJsonPropsComponent
          handleJsonChange={handleJsonChange}
          isVerificationEnabled={serverState === "online" ? true : false}
          restJson={restJsonProps} />
      </div>
      <div className={classes.buttonsWrapper}>
        <GitStateReport
          dispatch={dispatch}
          jsonFilesState={jsonFilesState}
          remoteRepoCheckInterval={remoteRepoCheckInterval}
          serverState={serverState} />
        <ClearJsonBtt />
        <Button color="primary" onClick={() => downloadJson(jsonObj)} variant="contained">
          Download as {jsonObj.app_topic}.json
        </Button>
        <SaveToRepoBtt
          gitOptions={gitOptions}
          fileStatus={jsonFilesState.fileStatus}
          handleClick={async () => dispatch({ type: "changeJsonFilesState", payload: { fileStatus: await handleSaveToRepo() } })}
          jsonObj={jsonObj}
          repoState={jsonFilesState.localRepoState}
          serverState={serverState}
          setGitOptions={setGitOptions} />
      </div>
      <DataDisplay classes={{ jsonWrapper: classes.jsonWrapper }} data={jsonObj} />
    </section>
  );
};