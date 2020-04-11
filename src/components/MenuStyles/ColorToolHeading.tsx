import React from "react";
import { Typography } from "@material-ui/core";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";

interface Props {
  text: string;
};

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    schemeHeading: {
      padding: ".7rem 2rem",
      fontSize: "1rem",
      color: "#666",
      "text-transform": "uppercase",
      borderBottom: `1px solid ${theme.palette.divider}`
    }
  })
);

const ColorToolHeading = ({ text }: Props) => {
  const classes = useStyles();
  return(
    <div style={{ width: "100%" }}>
      <Typography variant="h6" children={text} className={classes.schemeHeading} />
    </div>
  );
};

export default ColorToolHeading;