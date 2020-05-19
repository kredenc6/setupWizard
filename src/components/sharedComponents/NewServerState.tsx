import React from "react";
import { createStyles, makeStyles } from "@material-ui/core";
import { ServerIs } from "../../interfaces/interfaces";

interface Props {
  serverState: ServerIs;
};

const useStyles = makeStyles(theme =>
  createStyles({
    serverState: {
      position: "fixed",
      right: theme.spacing(1),
      padding: theme.spacing(1),
      textAlign: "center",
      border: `1px solid ${theme.palette.divider}`,
      borderRadius: "20px",
      "&:hover": {
        cursor: "default"
      }
    },
    statusText: ({ serverState }: Props) => ({
      color: serverState === "online" ? "green" : "red",
      fontWeight: 700
    })
  }
));

const NewServerState = ({ serverState}: Props) => {
  const classes = useStyles({ serverState });
  return(
    <div className={classes.serverState}>
      <p>Server</p>
      <p><span className={classes.statusText}>{serverState === "online" ? "connected" : "not connected"}</span>.</p>
    </div>
  );
}

export default NewServerState;