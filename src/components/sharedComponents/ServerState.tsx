import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { ServerIs } from "../../interfaces/interfaces";

interface Props {
  serverState: ServerIs;
};

const useStyles = makeStyles({
  serverState: {
    textAlign: "center",
    textDecoration: "underline",
    textDecorationColor: "#777"
  },
  statusText: ({ serverState }: Props) => ({
    color: serverState === "online" ? "green" : "red",
    fontWeight: 700
  })
});

const ServerState = ({ serverState }: Props) => {
  const classes = useStyles({ serverState });
  return(
    <aside className={classes.serverState}>
      <span>Proxy server is <span className={classes.statusText}>{serverState}</span>.</span>
    </aside>
  );
};

export default ServerState;