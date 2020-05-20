import React from "react";
import { Paper } from "@material-ui/core";
import { createStyles, makeStyles } from "@material-ui/core/styles";
import SubmenuHeading from "../sharedComponents/SubMenuHeading";

interface Props {
  component: JSX.Element;
  heading: string;
};

const useStyles = makeStyles(theme =>
  createStyles({
    subMenuWrapper: {
      display: "grid",
      gridTemplateRows: "auto auto-fill",
      padding: theme.spacing(1)
    }
  })
);

export default function Submenu({ component, heading }: Props) {
  const classes = useStyles();
  
  return(
    <Paper className={classes.subMenuWrapper}>
      <SubmenuHeading text={heading} />
      {component}
    </Paper>
  );
}