import React from "react";
import { makeStyles } from "@material-ui/core/styles";

interface Props {
  serverStatus: string;
};

const useStyles = makeStyles({
  serverStatus: {
    textAlign: "center",
    textDecoration: "underline",
    textDecorationColor: "#777"
  },
  statusText: ({ serverStatus }: Props) => ({
    color: serverStatus === "online" ? "green" : "red",
    fontWeight: 700
  })
});

const ServerStatus = ({ serverStatus }: Props) => {
  const classes = useStyles({ serverStatus })
  return(
    <p className={classes.serverStatus}>
      {serverStatus === "no connection" ?
        <span><span className={classes.statusText}>No connection</span> to proxy server.</span>
        :
        <span>Proxy server is <span className={classes.statusText}>{serverStatus}</span>.</span>
      }
    </p>
  );
};

export default ServerStatus;