import React from "react";
import { Box } from "@material-ui/core";
import { createStyles, makeStyles } from "@material-ui/core/styles";
import MenuHeading from "../sharedComponents/MenuHeading";

interface Props {
  component: JSX.Element;
  headingText: string;
};

const useStyles = makeStyles(theme => 
  createStyles({
    menu: {
      padding: theme.spacing(1),
      border: "2px solid pink"
    }
  })
);

export default function Menu({ component, headingText }: Props) {
  const classes = useStyles();
  return (
    <Box className={classes.menu}>
      <MenuHeading text={headingText} />
      {component}
    </Box>
  );
}