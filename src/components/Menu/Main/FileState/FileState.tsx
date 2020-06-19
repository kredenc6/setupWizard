import React from "react";
import { Button } from "@material-ui/core";
import { createStyles, makeStyles } from "@material-ui/core/styles";
import UploadButton from "./UploadButton";
import GitStateReport from "../../../sharedComponents/GitStateReport/GitStateReport";
import AvailableJsonsButton from "../../../Menu/Main/AvailableJsonsButton";
import { fetchJsonFiles, loadJsons } from "../../../../fileFunctions/fileFunctions";
import { SERVER_ADDRESS } from "../../../../initialStates/constants";
import { ServerIs } from "../../../../interfaces/interfaces";
import { FilesState } from "../../../../interfaces/fileInterfaces";
import { SWActions } from "../../../../sWReducer/sWReducer";

interface Props {
  dispatch: React.Dispatch<SWActions>;
  jsonFilesState: FilesState;
  serverState: ServerIs;
  setIsJsonSelectionOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

const useStyles = makeStyles(({ palette, spacing, typography }) => 
  createStyles({
    updateBtt: {
      padding: `${spacing(1) / 2}px`,
      fontSize: typography.fontSize,
      fontWeight: typography.fontWeightRegular,
      color: palette.text.primary,
      "&:hover": {
        cursor: "pointer"
      }
    },
    bttGroup: {
      width: "100%",
      display: "grid",
      gridTemplateColumns: "auto auto",
      gridTemplateRows: "auto auto",
      gridGap: spacing(1),
      padding: spacing(1)
    }
  })
);

const FileState = React.memo(({ dispatch, jsonFilesState, serverState, setIsJsonSelectionOpen }: Props) => {
  const classes = useStyles();

  return (
    <article>
      <div className={classes.bttGroup}>
        <GitStateReport
          dispatch={dispatch}
          jsonFilesState={jsonFilesState}
          serverState={serverState} />
        <AvailableJsonsButton
          handleClick={() => setIsJsonSelectionOpen(true)}
          jsonFileCount={jsonFilesState.loadedJsons.length} />
        <UploadButton
          childClass={classes.updateBtt}
          handleManualJsonLoading={async (fileList: FileList) => {
            const loadedJsons = await loadJsons(fileList);
            dispatch({ type: "changeJsonFilesState", payload: { loadedJsons } });
          }}
          text="Load JSON(s) manualy" />
        <Button
          children="Load JSON(s) from repo"
          disabled={serverState === "offline"}
          className={classes.updateBtt}
          onClick={async () => {
            const loadedJsons = await fetchJsonFiles(SERVER_ADDRESS);
            dispatch({ type: "changeJsonFilesState", payload: { loadedJsons } });
            
          }} />
      </div>
    </article>
  );
});

export default FileState;