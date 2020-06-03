import React from "react";
import { Box, Chip } from "@material-ui/core";
import { createStyles, makeStyles } from "@material-ui/core/styles";
import MenuHeading from "../sharedComponents/MenuHeading";
import { ServerIs } from "../../interfaces/interfaces";

interface Props {
  component: JSX.Element;
  headingText: string;
  serverState: ServerIs;
};

const useStyles = makeStyles(theme => 
  createStyles({
    menu: {
      height: "100%",
      width: "100%",
      display: "grid",
      gridTemplateRows: "auto 1fr"
    },
    headingWrapper: {
      textAlign: "center"
    },
    serverStatus: {
      position: "absolute",
      top: theme.spacing(1),
      right: theme.spacing(1),
      color: ({ serverState }: { serverState: ServerIs }) => {
        return serverState === "offline" ? "red" : "green";
      }
    }
  })
);

export default function Menu({ component, headingText, serverState }: Props) {
  const classes = useStyles({ serverState });

  return (
    <Box className={classes.menu}>
      <MenuHeading
        serverStateComponent={
          <Chip label={`Server ${serverState}`} className={classes.serverStatus} variant="outlined" />
        }
        text={headingText} />
      {component}
    </Box>
  );
}