import React from "react";
import { Paper, Typography, TypographyProps } from "@material-ui/core";
import { createStyles, makeStyles } from "@material-ui/core/styles";
import capitalizeFirstLetter from "../../miscellaneous/capitalizeFirstLetter";

interface Props extends TypographyProps {
  serverStateComponent: JSX.Element;
  text: string;
};

const useStyles = makeStyles(theme =>
  createStyles({
    menuHeading: {
      position: "relative",
      paddingBottom: theme.spacing(1),
      "z-index": 1
    }
  })
);

export default function MenuHeading(props: Props) {
  const classes = useStyles();
  const { serverStateComponent , text, ...typographyProps } = props;
  
  return (
    <Paper className={classes.menuHeading}>
      <Typography align="center" variant="h2" {...typographyProps}>
        {capitalizeFirstLetter(text)}
        {serverStateComponent}
      </Typography>
    </Paper>
  );
};