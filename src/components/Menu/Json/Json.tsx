import React, { useEffect, useState } from "react";
import { Button } from "@material-ui/core";
import { createStyles, makeStyles } from "@material-ui/core/styles";
import RestJsonPropsComponent from "./RestJsonPropsComponent/RestJsonPropsComponent";
import SaveToRepoBtt from "./SaveToRepoBtt/SaveToRepoBtt";
import GitStateReport from "../../sharedComponents/GitStateReport/GitStateReport";
import DataDisplay from "../../sharedComponents/DataDisplay";
import PromptCommitMessage from "../../sharedComponents/GitStateReport/GitActions/PromptCommitMsg/PromptCommitMsg";
import ClearJsonBtt from "./ClearJsonBtt/ClearJsonBtt";
import { downloadJson, handleSaveToRepo, normalizeJsonFileName } from "../../../fileFunctions/fileFunctions";
import { handleCommit, handlePush } from "../../../gitFunctions/gitFunctions";
import { ServerIs, UserInput } from "../../../interfaces/variousInterfaces";
import { JsonResultObj } from "../../../interfaces/jsonInterfaces";
import { GitOpt } from "../../../interfaces/gitInterfaces";
import { FilesState } from "../../../interfaces/fileInterfaces";
import { SWActions } from "../../../sWReducer/sWReducer";

interface Props {
  dispatch: React.Dispatch<SWActions>;
  jsonFilesState: FilesState;
  jsonObj: JsonResultObj;
  serverState: ServerIs;
  userInput: UserInput;
};

const useStyles = makeStyles(({ spacing }) =>
  createStyles({
    menuJson: {
      width: "100%",
      display: "flex",
      justifyContent: "space-between",
      padding: `${spacing(2)}px 0 ${spacing(1)}px ${spacing(1)}px`,
      overflow: "auto"
    },
    jsonWrapper: {
      minWidth: "25rem",
      width: "auto",
      maxHeight: "100%",
      padding: spacing(1),
    },
    buttonsWrapper: {
      height: "100%",
      display: "grid",
      gridGap: spacing(1),
      gridTemplateRows: "auto auto 1fr 1fr auto"
    }
  })
);

export default function Json({ dispatch, jsonFilesState, jsonObj, serverState, userInput }: Props) {
  const { fileStatus, localRepoState } = jsonFilesState;
  const [gitOptions, setGitOptions] = useState<GitOpt>({ commit: false, push: false });
  const [openPrompt, setOpenPrompt] = useState(false);
  const [commitMessage, setCommitMessage] = useState("");
  const classes = useStyles();
  const restJsonProps = Object.entries(jsonObj)
    .filter(([key, _]) => {
      return !Object.keys(userInput.platforms) // skip platforms...
        .concat(["visible_components", "app_topic", "ui_colors"]) // and these properties
        .includes(key); // condition or filter method
  });
  const fileName = normalizeJsonFileName(`${jsonObj.app_topic}.json`);

  useEffect(() => {
    if(jsonFilesState.localRepoState?.conflicted.length) {
      setGitOptions({ commit: false, push: false });
    }
    if(jsonFilesState.localRepoState?.behind) {
      setGitOptions(prev => ({ commit: prev.commit, push: false }));
    }
  },[jsonFilesState.localRepoState]);

  return(
    <section className={classes.menuJson}>
      <PromptCommitMessage
        handleChange={(value: string) => setCommitMessage(value)}
        open={openPrompt}
        sendCommit={async () => {
          const fileStatus = await handleCommit({ dispatch, commitMessage, localRepoState, gitOptions });
          dispatch({ type: "changeJsonFilesState", payload: { fileStatus } });
          
          if(gitOptions.push && fileStatus === "being pushed") {
            dispatch({ type: "changeJsonFilesState", payload: { fileStatus: await handlePush(dispatch) } });
          }
        }}
        setOpen={setOpenPrompt}
        value={commitMessage} />
      <RestJsonPropsComponent
        dispatch={dispatch}
        isVerificationEnabled={serverState === "online" ? true : false}
        restJson={restJsonProps} />
      <div className={classes.buttonsWrapper}>
        <GitStateReport
          dispatch={dispatch}
          jsonFilesState={jsonFilesState}
          serverState={serverState} />
        <ClearJsonBtt />
        <Button color="primary" onClick={() => downloadJson(jsonObj)} variant="contained">
          Download as {fileName}
        </Button>
        <SaveToRepoBtt
          gitOptions={gitOptions}
          fileStatus={fileStatus}
          handleClick={async () => {
            dispatch({ type: "changeJsonFilesState", payload: { fileStatus: "being saved" } });
            dispatch({
              type: "changeJsonFilesState",
              payload: { fileStatus: await handleSaveToRepo(gitOptions.commit, dispatch, jsonObj, setOpenPrompt) }
            })
          }}
          fileName={fileName}
          repoState={localRepoState}
          serverState={serverState}
          setGitOptions={setGitOptions} />
      </div>
      <DataDisplay classes={{ jsonWrapper: classes.jsonWrapper }} data={jsonObj} />
    </section>
  );
};