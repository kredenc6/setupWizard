import React, { forwardRef } from "react";
import { Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

interface Props {
  text: string;
}

const styles = {
  schemeHeading: {
    padding: "1rem 2rem",
    color: "#333",
    "text-transform": "uppercase",
    borderBottom: "1px solid #333"
  }
};

const useStyles = makeStyles(styles);

const StylesHeading = forwardRef(({ text }: Props, ref?: any) => {
  const classes = useStyles();
  return(
    <div ref={ref} style={{ width: "100%" }}>
      <Typography variant="h6" children={text} className={classes.schemeHeading} />
    </div>
  );
});

export default StylesHeading;