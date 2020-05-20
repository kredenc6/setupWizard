import React from "react";
import { Button } from "@material-ui/core";
import { createStyles, makeStyles } from "@material-ui/core/styles";
import RestJsonPropsComponent from "./RestJsonPropsComponent/RestJsonPropsComponent";
import SaveToRepoBtt from "./SaveToRepoBtt/SaveToRepoBtt";
import GitStateReport from "../sharedComponents/GitStateReport/GitStateReport";
import DataDisplay from "../sharedComponents/DataDisplay";
import { downloadJson } from "../../fileFunctions/fileFunctions";
import { JsonObjKey, JsonResultObj, ServerIs, UserInput } from "../../interfaces/interfaces";
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
      gridTemplateRows: "auto 1fr 1fr"
    }
  })
);

export default function MenuJson({ handleJsonChange, jsonFilesState, jsonObj, remoteRepoCheckInterval, serverState, userInput }: Props) {
  const classes = useStyles();
  const restJsonProps = Object.entries(jsonObj)
    .filter(([key, _]) => {
      return !Object.keys(userInput.modules) // skip modules...
        .concat(["visible_components", "app_topic", "ui_colors"]) // and these properties
        .includes(key); // condition or filter method
    });

  return(
    <section className={classes.menuJson}>
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
        <Button color="primary" onClick={() => downloadJson(jsonObj)} variant="contained">
          Download as {jsonObj.app_topic}.json
        </Button>
        <SaveToRepoBtt jsonObj={jsonObj} />
      </div>
      <DataDisplay classes={{ jsonWrapper: classes.jsonWrapper }} data={jsonObj} />
    </section>
  );
};