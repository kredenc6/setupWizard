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
import { commitRepo, pushToRemoteRepo } from "../../gitFunctions/gitFunctions";
import { JsonObjKey, JsonResultObj, ServerIs, UserInput } from "../../interfaces/interfaces";
import { GitOpt } from "../../interfaces/gitInterfaces";
import { FilesState } from "../../interfaces/fileInterfaces";
import Interval from "../../classes/Interval";

interface Props {
  jsonFilesState: FilesState;
  handleJsonChange: (key: JsonObjKey, changedModule: JsonResultObj[JsonObjKey]) => void;
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
  { handleJsonChange, jsonFilesState, jsonObj, remoteRepoCheckInterval, serverState, userInput }: Props) {
  const [gitOptions, setGitOptions] = useState<GitOpt>({ commit: false, push: false });
  const [openPrompt, setOpenPrompt] = useState(false);
  const [commitMsg, setCommitMsg] = useState("");
  const classes = useStyles();
  const restJsonProps = Object.entries(jsonObj)
    .filter(([key, _]) => {
      return !Object.keys(userInput.modules) // skip modules...
        .concat(["visible_components", "app_topic", "ui_colors"]) // and these properties
        .includes(key); // condition or filter method
    });

    const handleSaveToRepo = async () => {
      const savedSuccessfuly = await saveJson(SERVER_ADDRESS, jsonObj);
      if(!savedSuccessfuly) {
        console.log(`Failed to save ${jsonObj.app_topic}.json to repo. No commits or pushes were handled.`);
        return;
      }
      console.log(`${jsonObj.app_topic}.json saved successfuly: ${savedSuccessfuly}`);

      await remoteRepoCheckInterval.executeNow(true, [serverState, true]); // update repo state
      
      if(gitOptions.commit) {
        setOpenPrompt(true);
      }
    };

    const handleCommit = async () => {
      const notAddedFiles = jsonFilesState.localRepoState?.not_added || [];
      const commitResponse = await commitRepo(SERVER_ADDRESS, commitMsg, notAddedFiles);
      console.log(`Commit was successful: ${commitResponse ? true : false}`);
      
      if(commitResponse && gitOptions.push) {
        const pushSucces = await pushToRemoteRepo(SERVER_ADDRESS);
        console.log(`Changes pushed succesffuly: ${pushSucces}`);
      }
      remoteRepoCheckInterval.executeNow(true, [serverState, true]); // update repo state
    };

  return(
    <section className={classes.menuJson}>
      <PromptCommitMessage
        handleChange={(value: string) => setCommitMsg(value)}
        open={openPrompt}
        sendCommit={handleCommit}
        setOpen={setOpenPrompt}
        value={commitMsg} />
      <div>
        <RestJsonPropsComponent
          handleJsonChange={handleJsonChange}
          isVerificationEnabled={serverState === "online" ? true : false}
          restJson={restJsonProps} />
      </div>
      <div className={classes.buttonsWrapper}>
        <GitStateReport
          gitState={jsonFilesState.localRepoState}
          lastRepoUpdate={jsonFilesState.lastRepoUpdate}
          remoteRepoCheckInterval={remoteRepoCheckInterval}
          serverState={serverState} />
        <ClearJsonBtt />
        <Button color="primary" onClick={() => downloadJson(jsonObj)} variant="contained">
          Download as {jsonObj.app_topic}.json
        </Button>
        <SaveToRepoBtt
          gitOptions={gitOptions}
          handleClick={handleSaveToRepo}
          jsonObj={jsonObj}
          repoState={jsonFilesState.localRepoState}
          serverState={serverState}
          setGitOptions={setGitOptions} />
      </div>
      <DataDisplay classes={{ jsonWrapper: classes.jsonWrapper }} data={jsonObj} />
    </section>
  );
};