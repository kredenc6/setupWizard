import React from "react";
import { Button } from "@material-ui/core";
import { createStyles, makeStyles } from "@material-ui/core/styles";
import UploadButton from "./UploadButton";
import GitStateReport from "../sharedComponents/GitStateReport/GitStateReport";
import AvailableJsonsButton from "../MainMenu/AvailableJsonsButton";
import { ServerIs } from "../../interfaces/interfaces";
import { FilesState } from "../../interfaces/fileInterfaces";
import Interval from "../../classes/Interval";

interface Props {
  fetchJsonsFromLocalRepo: () => void;
  handleManualJsonLoading: (value: FileList) => void;
  jsonFilesState: FilesState;
  remoteRepoCheckInterval: Interval;
  serverState: ServerIs;
  setIsJsonSelectionOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

const useStyles = makeStyles(theme => 
  createStyles({
    updateBtt: {
      padding: `${theme.spacing(1) / 2}px`,
      fontSize: theme.typography.fontSize,
      fontWeight: theme.typography.fontWeightRegular,
      color: theme.palette.text.primary,
      "&:hover": {
        cursor: "pointer"
      }
    },
    bttGroup: {
      width: "100%",
      display: "grid",
      gridTemplateColumns: "auto auto",
      gridTemplateRows: "auto auto",
      gridGap: theme.spacing(1),
      padding: theme.spacing(1)
    }
  })
);

export default function MenuFileState(
  { fetchJsonsFromLocalRepo, handleManualJsonLoading, jsonFilesState, remoteRepoCheckInterval, serverState, setIsJsonSelectionOpen }: Props) {
  const classes = useStyles();

  return (
    <article>
      <div className={classes.bttGroup}>
        <GitStateReport
          gitState={jsonFilesState.localRepoState}
          lastRepoUpdate={jsonFilesState.lastRepoUpdate}
          remoteRepoCheckInterval={remoteRepoCheckInterval}
          serverState={serverState} />
        <AvailableJsonsButton
          handleClick={() => setIsJsonSelectionOpen(true)}
          jsonFileCount={jsonFilesState.loadedJsons.length} />
        <UploadButton
          childClass={classes.updateBtt}
          handleManualJsonLoading={handleManualJsonLoading}
          text="Load JSON(s) manualy" />
        <Button
          children="Load JSON(s) from repo"
          disabled={serverState === "offline"}
          className={classes.updateBtt}
          onClick={fetchJsonsFromLocalRepo} />
      </div>
    </article>
  );
}