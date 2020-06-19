import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import SchemeContentLarge from "./SchemeContentLarge/SchemeContentLarge";
import SchemeContentSmall from "./SchemeContentSmall/SchemeContentSmall";
import { Palette } from "../../../../../interfaces/colorSchemeInterfaces";

import { Box } from "@material-ui/core";

interface Props {
  title: string;
  palette: Palette;
  active: boolean;
  reset: (color: string | null) => void;
  onClick: () => void;
};

const styles = {
  largeScheme: {
    width: "40%",
    height: "100%",
    padding: "1rem",
    border: "1px solid grey",
    "&:hover": {
      cursor: "pointer",
      boxShadow: "0 0 30px 0 #bbb"
    }
  },
  smallSchemesWrapper: {
    width: "100%",
    height: "40%",
    display: "flex",
  }
};

const useStyles = makeStyles(styles);

const SchemeContainerLarge = ({ title, palette, active, reset, onClick }: Props) => {
  const classes = useStyles();
  return(
    <Box boxShadow={active ? 15 : 0} className={classes.largeScheme} onClick={onClick}>
      <p style={{ height: "10%" }}>{title}</p>
      <SchemeContentLarge
        text={title === "Primary" ? "P" : "S"}
        background={palette.main}
        contrastText={palette.contrastText.main}
        reset={reset}
        active={active} />
      <div className={classes.smallSchemesWrapper}>
        <SchemeContentSmall
          text={`${title === "Primary" ? "P" : "S"} - light`}
          background={palette.light}
          contrastText={palette.contrastText.light} />
        <SchemeContentSmall
          text={`${title === "Primary" ? "P" : "S"} - dark`}
          background={palette.dark}
          contrastText={palette.contrastText.dark} />
      </div>
    </Box>
  );
};

export default SchemeContainerLarge;