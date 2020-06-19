import React from "react";
import { Button } from "@material-ui/core";
import { createStyles, makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles(theme => 
  createStyles({
    clearJsonBtt: {
      fontSize: `${theme.typography.fontSize * .8}px`
    }
  })
);

export default function ClearJsonBtt() {
  const classes = useStyles();
  return(
    <Button className={classes.clearJsonBtt} color="primary" disabled variant="outlined">
      Clear values from unused modules before saving
    </Button>
  );
}