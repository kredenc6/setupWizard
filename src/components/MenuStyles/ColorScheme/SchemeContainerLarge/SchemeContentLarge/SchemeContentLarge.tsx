import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import SchemeResetButton from "../../SchemeResetButton";
import SchemeTextIcon from "../../SchemeTextIcon";
import ColorText from "../../ColorText";

interface Props {
  text: string;
  background: string;
  contrastText: string;
  active: boolean;
  reset: (color: string | null) => void;
};

const styles = {
  schemeContentLarge: {
    width: "100%",
    height: "50%",
    display: "flex",
    flexFlow: "column nowrap",
    justifyContent: "space-between",
    padding: ".5rem"
  }
};

const useStyles = makeStyles(styles);

const SchemeContentLarge = ({ text, background, contrastText, active, reset }: Props) => {
  const classes = useStyles();
  return(
    <div className={classes.schemeContentLarge} style={{ backgroundColor: background }}>
      <ColorText text={background} contrastText={contrastText} />
      <SchemeTextIcon text={text} background={background} contrastText={contrastText} active={active} />
      <SchemeResetButton
        value="reset"
        disabled={!active}
        onClick={() => reset("#ffffff")} />
    </div>
  );
};

export default SchemeContentLarge;