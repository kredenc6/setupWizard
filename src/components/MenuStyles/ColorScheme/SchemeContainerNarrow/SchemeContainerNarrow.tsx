import React from "react";
import { Box } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import SchemeTextIcon from "../ShemeTextIcon";
import SchemeResetButton from "../SchemeResetButton";
import ColorText from "../ColorText";

interface Props {
  title: string;
  background: string;
  contrastText: string;
  active: boolean;
  reset: (color: string | null) => void;
  onClick: () => void;
};

const styles = {
  narrowSchemeContainer: {
    height: "50%",
    padding: ".6rem",
    border: "1px solid grey",
    "&:hover": {
      cursor: "pointer",
      boxShadow: "0 0 30px 0 #bbb"
    }
  },
  narrowSchemeContent: {
    width: "100%",
    height: "80%",
    display: "flex",
    flexFlow: "column nowrap",
    justifyContent: "space-between",
    padding: ".3rem"
  }
};

const useStyles = makeStyles(styles);

const SchemeContainerNarrow  = ({ title, background, contrastText, active, reset, onClick }: Props) => {
  const classes = useStyles();
  return(
    <Box className={classes.narrowSchemeContainer} onClick={onClick} boxShadow={active ? 15 : 0}>
      <p style={{ height: "20%" }}>{title}</p>
      <div className={classes.narrowSchemeContent} style={{ backgroundColor: background }}>
        <ColorText text={background} contrastText={contrastText} />
        <SchemeTextIcon text="T" contrastText={contrastText} background={background} active={active} />
        <SchemeResetButton value="reset" disabled={!active} onClick={() => reset(null)} />
      </div>
    </Box>
  );
};

export default SchemeContainerNarrow;