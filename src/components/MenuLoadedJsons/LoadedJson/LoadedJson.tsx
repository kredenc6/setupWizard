import React from "react";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import { JsonResultObj } from "../../../interfaces/interfaces";

interface Props {
  jsonObj: JsonResultObj;
};

const styles = (theme: Theme) => 
  createStyles({
  LoadedJsonWrapper: {
    minWidth: "25rem",
    maxWidth: "50%",
    height: "100%",
    padding: "1rem",
    borderLeft: `1px solid ${theme.palette.divider}`,
    overflow: "auto"
  },
  json: {
    "&:hover": {
      cursor: "text"
    }
  }
});
const useStyles = makeStyles(theme => styles(theme));

const LoadedJson = ({ jsonObj }: Props) => {
  const classes = useStyles();
  return(
    <aside className={classes.LoadedJsonWrapper}>
      <pre>
        <code className={classes.json}>
          {JSON.stringify(jsonObj, null, 2)}
        </code>
      </pre>
    </aside>
  );
};

export default LoadedJson;