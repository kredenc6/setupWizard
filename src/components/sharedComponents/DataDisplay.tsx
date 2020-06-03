import React from "react";
import { Paper } from "@material-ui/core";
import { makeStyles } from "@material-ui/core";
import SimpleBar from "simplebar-react";
import "simplebar/dist/simplebar.min.css";

interface Props {
  classes: {
    jsonWrapper: string;
    json?: string;
  },
  data: any;
  indentation?: number;
};

const useStyles = makeStyles({
  jsonWrapper: {
    width: "100%",
    margin: "0 8px",
    overflow: "hidden"
  },
  simplebar: {
    maxHeight: "100%"
  },
  json: {
    "&:hover": {
      cursor: "text"
    }
  }
});

export default function DataDisplay({ classes, data, indentation = 2 }: Props) {
  const styleClasses = useStyles();
  return(
    // <Paper style={{ margin: "0 8px", overflow: "hidden", width: "100%" }}>
    <Paper className={`${styleClasses.jsonWrapper} ${classes.jsonWrapper}`}>
      <SimpleBar className={styleClasses.simplebar}>
        <pre>
          <code className={`${styleClasses.json} ${classes.json || ""}`}>
            {JSON.stringify(data, null, indentation)}
          </code>
        </pre>
      </SimpleBar>
    </Paper>
  );
}