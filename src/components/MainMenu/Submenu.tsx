import React from "react";
import { Paper } from "@material-ui/core";
import { createStyles, makeStyles } from "@material-ui/core/styles";
import SubmenuHeading from "../sharedComponents/SubMenuHeading";

interface Props {
  className?: string;
  component: JSX.Element;
  heading: string;
};

const useStyles = makeStyles(theme =>
  createStyles({
    subMenuWrapper: {
      display: "grid",
      gridTemplateRows: "auto auto-fill",
      padding: theme.spacing(2)
    }
  })
);

export default function Submenu({ className, component, heading }: Props) {
  const classes = useStyles();
  
  return(
    <Paper className={`${classes.subMenuWrapper} ${className || ""}`}>
      <SubmenuHeading text={heading} />
      {component}
    </Paper>
  );
}