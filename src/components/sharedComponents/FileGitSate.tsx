import React from "react";
import { Chip } from "@material-ui/core";
import { createStyles, makeStyles } from "@material-ui/core";

interface Props {
  fileGitState: string[];
};

const useStyles = makeStyles(theme => 
  createStyles({
    gitStateWrapper: {
      position: "absolute",
      left: 0,
      bottom: ".2rem",
      width: "100%",
      display: "flex",
      justifyContent: "flex-end",
      "& > *": {
        margin: `0 ${theme.spacing(1)}px`
      },
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
      color="secondary"
      key={state}
      label={state}
      variant="outlined"
      size="small" />
  );
  
  return(
    <div className={classes.gitStateWrapper}>
      {stateComponents}
    </div>
  );
};

export default FileGitState;