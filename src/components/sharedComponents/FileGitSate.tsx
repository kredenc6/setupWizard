import React from "react";
import { Chip } from "@material-ui/core";
import { createStyles, makeStyles } from "@material-ui/core";

interface Props {
  fileGitState: string[];
};

const useStyles = makeStyles(theme => 
  createStyles({
    gitStateWrapper: {
      display: "flex",
      justifyContent: "center",
      "& > *": {
        margin: `${theme.spacing(2)}px ${theme.spacing(1)}px`
      }
    },
    state: {
      margin: `0 ${theme.spacing(1)}px`,
      fontSize: `${theme.typography.fontSize * 0.8}px`,
    },
    "MuiChip-root": {
      backgroundColor: "pink"
    },
    red: {
      backgroundColor: "#f00"
    }
}));

const FileGitState = ({ fileGitState }: Props) => {
  const classes = useStyles();
  const stateComponents = fileGitState.map(state =>
    <Chip
      className={state === "conflicted" ? classes.red : "" }
      color="primary"
      key={state}
      label={state}
      size="small" />
  );
  
  return(
    <div className={classes.gitStateWrapper}>
      {stateComponents}
    </div>
  );
};

export default FileGitState;