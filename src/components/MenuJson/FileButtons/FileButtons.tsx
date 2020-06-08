import React from "react";
import { Button } from "@material-ui/core";
import { createStyles, makeStyles } from "@material-ui/core/styles";
import SaveToRepoBtt from "../SaveToRepoBtt/SaveToRepoBtt";
import GitStateReport from "../../sharedComponents/GitStateReport/GitStateReport";
import ClearJsonBtt from "../ClearJsonBtt/ClearJsonBtt";
import { downloadJson, handleSaveToRepo, normalizeJsonFileName } from "../../../fileFunctions/fileFunctions";
import { SWActions } from "../../../sWReducer/sWReducer";
import { GitOpt } from "../../../interfaces/gitInterfaces";
import { FilesState } from "../../../interfaces/fileInterfaces";
import { JsonResultObj, ServerIs, UserInput } from "../../../interfaces/interfaces";

interface Props {
  dispatch: React.Dispatch<SWActions>;
  gitOptions: GitOpt;
  jsonFilesState: FilesState;
  jsonObj: JsonResultObj;
  serverState: ServerIs;
  userInput: UserInput;
};

const useStyles = makeStyles(({ spacing }) =>
  createStyles({
    buttonsWrapper: {
      height: "100%",
      display: "grid",
      gridGap: spacing(1),
      gridTemplateRows: "auto auto 1fr 1fr auto"
    }
  })
);

const FileButtons = React.memo(({ dispatch, gitOptions, jsonFilesState, jsonObj, serverState }: Props) => {
  const classes = useStyles();
  const { fileStatus, localRepoState } = jsonFilesState;
  const fileName = normalizeJsonFileName(`${jsonObj.app_topic}.json`);

  return(
    <div className={classes.buttonsWrapper}>
    </div>
  );
});

export default FileButtons;