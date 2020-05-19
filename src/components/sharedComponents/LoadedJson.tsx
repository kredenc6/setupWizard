import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { JsonResultObj } from "../../interfaces/interfaces";

interface Props {
  jsonObj: JsonResultObj;
};

const useStyles = makeStyles({
  LoadedJsonWrapper: {
    minWidth: "25rem",
    width: "100%",
    maxHeight: "100%",
    height: "75vh",
    padding: "1rem",
    overflow: "auto"
  },
  json: {
    "&:hover": {
      cursor: "text"
    }
  }
});

const LoadedJson = ({ jsonObj }: Props) => {
  const classes = useStyles();
  return(
    <article className={classes.LoadedJsonWrapper}>
      <pre>
        <code className={classes.json}>
          {JSON.stringify(jsonObj, null, 2)}
        </code>
      </pre>
    </article>
  );
};

export default LoadedJson;