import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import ColorText from "../../ColorText";

interface Props {
  text: string;
  background: string;
  contrastText: string;
};

const styles = {
  schemeContentSmall: {
    width: "50%",
    padding: ".5rem",
  }
};

const useStyles = makeStyles(styles);

const SchemeContentSmall = ({ text, background, contrastText }: Props) => {
  const classes = useStyles();
  return(
    <div className={classes.schemeContentSmall} style={{ backgroundColor: background }}>
      <p style={{ color: contrastText }}>{text}</p>
      <ColorText text={background} contrastText={contrastText} />
    </div>
  );
};

export default SchemeContentSmall;