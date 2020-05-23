import React from "react";
import { Button, Box } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import GitOptions from "../GitOptions/GitOptions";
import { JsonResultObj, ServerIs } from "../../../interfaces/interfaces";
import { GitOpt } from "../../../interfaces/gitInterfaces";
import { StatusResult } from "../../../interfaces/simpleGit";

interface Props {
  gitOptions: GitOpt;
  handleClick: () => void;
  repoState: StatusResult | null;
  serverState: ServerIs;
  jsonObj: JsonResultObj;
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

export default function SaveButton({ gitOptions, handleClick, repoState, serverState, jsonObj, setGitOptions }: Props) {
  const classes = useStyles();

  return(
    <Box className={classes.buttonWrapper}>
      <Button
        className={classes.root}
        color="primary"
        disabled={serverState === "offline"}
        onClick={handleClick}
        variant="contained"
      >
        <p>{`Save to repo as ${jsonObj.app_topic}.json`}</p>
      </Button>
      <GitOptions
        disabled={serverState === "offline"}
        gitOptions={gitOptions}
        repoState={repoState}
        setGitOptions={setGitOptions} />
    </Box>
  );
};