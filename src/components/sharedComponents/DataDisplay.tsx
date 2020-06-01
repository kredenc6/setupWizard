import React from "react";
import { makeStyles } from "@material-ui/core";
import SimpleBar from "simplebar-react";
import "simplebar/dist/simplebar.min.css";

interface Props {
  classes?: {
    jsonWrapper?: string;
    json?: string;
  },
  data: any;
  indentation?: number;
};

const useStyles = makeStyles({
  json: {
    "&:hover": {
      cursor: "text"
    }
  }
});

export default function DataDisplay({ classes, data, indentation = 2 }: Props) {
  const jsonClass = useStyles();
  return(
    <SimpleBar className={classes?.jsonWrapper || ""}>
      <pre>
        <code className={`${jsonClass.json} ${classes?.json || ""}`}>
          {JSON.stringify(data, null, indentation)}
        </code>
      </pre>
    </SimpleBar>
  );
}