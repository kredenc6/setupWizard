import React, { useEffect, useState } from "react";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import ColorScheme from "./ColorScheme/ColorScheme";
import ColorPalette from "./ColorPalette/ColorPalette";
import ColorToolHeading from "./ColorToolHeading";
import UI1 from "./UserInterfaces/UI1";
import { createPaletteFromColor } from "../../miscellaneous/colorSchemeFunctions";
import { SchemeObj, UserInput } from "../../interfaces/interfaces";

import PresetSchemes from "./ColorScheme/PresetSchemes/PresetSchemes";

interface Props {
  handleSchemeChange: <K extends keyof UserInput>(propName: K, value: UserInput[K]) => void;
  schemeObj: SchemeObj;
  selectedScheme: string;
  setIsNextStepAllowed: React.Dispatch<React.SetStateAction<boolean>>;
  setSelectedScheme: React.Dispatch<React.SetStateAction<string>>
};

const styles = {
  menuStyles: {
    width: "100%",
    display: "flex",
    justifyContent: "center"
  },
  left: {
    flexGrow: 1,
    display: "flex",
    flexFlow: "row wrap",
    justifyContent: "space-around"
  },
  right: {
    width: "600px",
    display: "grid",
    gridTemplateRows: "min-content auto min-content 280px",
    overflow: "hidden"
  },
  userInterface: {
    alignSelf: "flex-start"
  }
};
const useStyles = makeStyles(styles);

const MenuStyles = ({ handleSchemeChange, schemeObj, selectedScheme, setIsNextStepAllowed, setSelectedScheme }: Props) => {
  const classes = useStyles();
  const [schemeProperty, setSchemeProperty] = useState<"background" | "text">("background");
  const [selectedPalette, setSelectedPalette] = useState<"primary" | "secondary">("primary");
  const getContrastText = useTheme().palette.getContrastText;

  const assignColor = (color: string | null) => {
    // change background scheme
    if(schemeProperty === "background" && color !== null) {
      const newScheme = createPaletteFromColor(color, getContrastText);
      handleSchemeChange(
        "schemeObj",
        {
         ...schemeObj, [selectedPalette]: newScheme
        });
    }
    // change text color override
    else {
      handleSchemeChange(
        "schemeObj",
        {
          ...schemeObj, textColorOverride: { ...schemeObj.textColorOverride, [selectedPalette]: color }
        });
    }
  };

  // always allow next step
  useEffect(() => {
    setIsNextStepAllowed(true);
  });

  return(
    <section className={classes.menuStyles}>
      <div className={classes.left}>
        <ColorToolHeading text="user interfaces" />
        <PresetSchemes
          handleSchemeChange={handleSchemeChange}
          selectedScheme={selectedScheme}
          setSelectedScheme={setSelectedScheme} />
        <UI1 className={classes.userInterface} schemeObj={schemeObj} />
      </div>
      <div className={classes.right}>
        <ColorToolHeading text="color palette" />
        <ColorPalette onClick={(color: string) => {
          assignColor(color);
          setSelectedScheme("custom");
        }} />
        <ColorToolHeading text="current scheme" />
        <ColorScheme
          schemeObj={schemeObj}
          schemeProperty={schemeProperty}
          selectedPalette={selectedPalette}
          setSchemeProperty={setSchemeProperty}
          setSelectedPalette={setSelectedPalette}
          reset={(color: string | null) => {
            assignColor(color);
            setSelectedScheme("custom");
          }} />
      </div>
    </section>
  );
};

export default MenuStyles;

// TODO: any click on reset button or click on color on color palette triggers setting the "selectedScheme" as 'custom'
// no matter if the resulting "schemeObj" still equals any selected(or not-selected*) preset "schemeObj"
// (it's name shoud be set to "selectedScheme" instead of 'custom')

// * for now all json preset schemes don't get transformed into "colorObj"s anyway ( - only one selected scheme at a time)