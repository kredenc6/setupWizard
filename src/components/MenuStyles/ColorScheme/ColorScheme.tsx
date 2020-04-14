import React from "react";
import { makeStyles, createStyles } from "@material-ui/core/styles";
import SchemeContainerLarge from "./SchemeContainerLarge/SchemeContainerLarge";
import SchemeContainerNarrow from "./SchemeContainerNarrow/SchemeContainerNarrow";
import { SchemeObj } from "../../../interfaces/interfaces";

interface Props {
  reset: (color: string | null) => void;
  schemeObj: SchemeObj;
  schemeProperty: "background" | "text";
  selectedPalette: "primary" | "secondary";
  setSchemeProperty: React.Dispatch<React.SetStateAction<"background" | "text">>;
  setSelectedPalette: React.Dispatch<React.SetStateAction<"primary" | "secondary">>;
};

const styles = createStyles(
  {
    colorSchemeWrapper: {
      width: "100%",
      display: "flex",
      flexFlow: "row wrap",
      alignContent: "flex-start"
    },
    colorSchemes: {
      width: "100%",
      height: "100%",
      display: "flex", 
    },
    narrowSchemeWrapper: {
      width: "20%"
    }
  }
);

const useStyles = makeStyles(styles);

const ColorScheme = (props: Props) => {
  const {
    reset,
    schemeObj,
    schemeProperty,
    selectedPalette,
    setSchemeProperty,
    setSelectedPalette
  } = props;
  const classes = useStyles();

  return(
    <article className={classes.colorSchemeWrapper}>
      <div className={classes.colorSchemes}>
        <SchemeContainerLarge
          active={selectedPalette === "primary" && schemeProperty === "background" ? true : false}
          onClick={() => {
            setSelectedPalette("primary");
            setSchemeProperty("background");
          }}
          palette={schemeObj.primary}
          reset={reset}
          title="Primary" />
        <SchemeContainerLarge
          active={selectedPalette === "secondary" && schemeProperty === "background" ? true : false}
          onClick={() => {
            setSelectedPalette("secondary");
            setSchemeProperty("background");
          }}
          palette={schemeObj.secondary}
          reset={reset}
          title="Secondary" />
        <div className={classes.narrowSchemeWrapper}>
          <SchemeContainerNarrow
            active={selectedPalette === "primary" && schemeProperty === "text" ? true : false}
            background={schemeObj.primary.main}
            contrastText={schemeObj.textColorOverride.primary ?
              schemeObj.textColorOverride.primary : schemeObj.primary.contrastText.main}
            onClick={() => {
              setSelectedPalette("primary");
              setSchemeProperty("text");
            }}
            reset={reset}
            title="Text on P" />
          <SchemeContainerNarrow
            active={selectedPalette === "secondary" && schemeProperty === "text" ? true : false}
            background={schemeObj.secondary.main}
            contrastText={schemeObj.textColorOverride.secondary ?
              schemeObj.textColorOverride.secondary : schemeObj.secondary.contrastText.main}
            onClick={() => {
              setSelectedPalette("secondary");
              setSchemeProperty("text");
            }}
            reset={reset}
            title="Text on S" />
        </div>
      </div>
    </article>
  );
};

export default ColorScheme;