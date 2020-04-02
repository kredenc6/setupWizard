import React, { useState, useCallback } from "react";
import { makeStyles, createStyles } from "@material-ui/core/styles";
import PaletteHeading from "../PaletteHeading";
import SchemeContainerLarge from "./SchemeContainerLarge/SchemeContainerLarge";
import SchemeContainerNarrow from "./SchemeContainerNarrow/SchemeContainerNarrow";
import { ColorObj } from "../../../interfaces/interfaces";

interface Props {
  colorObj: ColorObj;
  selectedScheme: "primary" | "secondary";
  setSelectedScheme: React.Dispatch<React.SetStateAction<"primary" | "secondary">>;
  schemeProperty: "background" | "text";
  setSchemeProperty: React.Dispatch<React.SetStateAction<"background" | "text">>;
  reset: (color: string | null) => void;
};

const styles = createStyles(
  {
    colorSchemeWrapper: {
      width: "100%",
      height: "400px",
      display: "flex",
      flexFlow: "row wrap",
      alignContent: "flex-start",
    },
    colorSchemes: {
      width: "100%",
      height: ({ headingHeight }: ({ headingHeight: string; })) => `calc(400px - ${headingHeight})`,
      display: "flex", 
    },
    narrowSchemeWrapper: {
      width: "20%"
    }
  }
);

const useStyles = makeStyles(styles);

const ColorScheme = ({ colorObj, selectedScheme, setSelectedScheme, schemeProperty, setSchemeProperty, reset }: Props) => {
  const [headingHeight, setHeadingHeight] = useState("0px");
  const measuredRef = useCallback((node: HTMLDivElement | null) => {
    if (node !== null) {
      setHeadingHeight(window.getComputedStyle(node).height);
    }
  }, []);
  const classes = useStyles({ headingHeight });

  return(
    <article className={classes.colorSchemeWrapper}>
      <PaletteHeading text="current scheme" ref={measuredRef} />
      <div className={classes.colorSchemes}>
        <SchemeContainerLarge
          title="Primary"
          palette={colorObj.primary}
          active={selectedScheme === "primary" && schemeProperty === "background" ? true : false}
          reset={reset}
          onClick={() => {
            setSelectedScheme("primary");
            setSchemeProperty("background");
          }} />
        <SchemeContainerLarge
          title="Secondary"
          palette={colorObj.secondary}
          active={selectedScheme === "secondary" && schemeProperty === "background" ? true : false}
          reset={reset}
          onClick={() => {
            setSelectedScheme("secondary");
            setSchemeProperty("background");
          }} />
        <div className={classes.narrowSchemeWrapper}>
          <SchemeContainerNarrow
            title="Text on P"
            background={colorObj.primary.main}
            contrastText={colorObj.textColorOverride.primary ?
              colorObj.textColorOverride.primary : colorObj.primary.contrastText.main}
            active={selectedScheme === "primary" && schemeProperty === "text" ? true : false}
            reset={reset}
            onClick={() => {
              setSelectedScheme("primary");
              setSchemeProperty("text");
            }} />
          <SchemeContainerNarrow
            title="Text on S"
            background={colorObj.secondary.main}
            contrastText={colorObj.textColorOverride.secondary ?
              colorObj.textColorOverride.secondary : colorObj.secondary.contrastText.main}
            active={selectedScheme === "secondary" && schemeProperty === "text" ? true : false}
            reset={reset}
            onClick={() => {
              setSelectedScheme("secondary");
              setSchemeProperty("text");
            }} />
        </div>
      </div>
    </article>
  );
};

export default ColorScheme;