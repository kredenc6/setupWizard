import React from "react";
import { Button, Box } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import GitOptions from "../GitOptions/GitOptions";
import { ServerIs } from "../../../interfaces/interfaces";
import { GitOpt } from "../../../interfaces/gitInterfaces";
import { FileStatus } from "../../../interfaces/fileInterfaces";
import { StatusResult } from "../../../interfaces/simpleGit";

interface Props {
  gitOptions: GitOpt;
  handleClick: () => void;
  fileName: string;
  fileStatus: FileStatus;
  repoState: StatusResult | null;
  serverState: ServerIs;
  setGitOptions: React.Dispatch<React.SetStateAction<GitOpt>>;
};

const useStyles = makeStyles({
  buttonWrapper: {
    display: "flex",
    flexDirection: "column"
  },
  root: {
    flexGrow: 1,
    borderBottomRightRadius: 0,
    borderBottomLeftRadius: 0
  }
});

export default function SaveButton({ gitOptions, fileStatus, handleClick, repoState, serverState, fileName, setGitOptions }: Props) {
  const classes = useStyles();
  const disabled = serverState === "offline" || fileStatus !== "ready";

  return(
    <Box className={classes.buttonWrapper}>
      <Button
        className={classes.root}
        color="primary"
        disabled={disabled}
        onClick={handleClick}
        variant="contained"
      >
        {fileStatus === "ready" ?
            `Save to repo as ${fileName}`
          :
            `File is ${fileStatus}.`}
      </Button>
      <GitOptions
        disabled={disabled}
        gitOptions={gitOptions}
        repoState={repoState}
        setGitOptions={setGitOptions} />
    </Box>
  );
}
