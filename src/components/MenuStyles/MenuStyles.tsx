import React, { useEffect, useState } from "react";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import ColorScheme from "./ColorScheme/ColorScheme";
import ColorPalette from "./ColorPalette/ColorPalette";
import ColorToolHeading from "./ColorToolHeading";
import UI1 from "./UserInterfaces/UI1";
import { createJsonSchemeObj, createPaletteFromColor } from "../../miscellaneous/colorSchemeFunctions";
import { JsonScheme, SchemeObj, UserInput } from "../../interfaces/interfaces";

import PresetSchemes from "./ColorScheme/PresetSchemes/PresetSchemes";

interface Props {
  handleJsonChange: (value: JsonScheme) => void;
  handleSchemeChange: <K extends keyof UserInput>(propName: K, value: UserInput[K]) => void;
  schemeObj: SchemeObj;
  selectedScheme: string;
  setIsNextStepAllowed: React.Dispatch<React.SetStateAction<boolean>>;
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

const MenuStyles = (
  { handleJsonChange, handleSchemeChange, schemeObj, selectedScheme, setIsNextStepAllowed }: Props) => {
  const classes = useStyles();
  const [schemeProperty, setSchemeProperty] = useState<"background" | "text">("background");
  const [selectedPalette, setSelectedPalette] = useState<"primary" | "secondary">("primary");
  const getContrastText = useTheme().palette.getContrastText;

  const assignColor = (color: string | null) => {
    handleSchemeChange("selectedScheme", "custom");
    // change background scheme
    if(schemeProperty === "background" && color !== null) {
      const newScheme = createPaletteFromColor(color, getContrastText);
      const newSchemeObj = { ...schemeObj, [selectedPalette]: newScheme };
      handleSchemeChange("schemeObj", newSchemeObj);
      handleJsonChange( createJsonSchemeObj(newSchemeObj) );
    }
    // change text color override
    else {
      const newSchemeObj = { ...schemeObj, textColorOverride: { ...schemeObj.textColorOverride, [selectedPalette]: color } };
      handleSchemeChange("schemeObj", newSchemeObj);
      handleJsonChange( createJsonSchemeObj(newSchemeObj) );
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
          setSelectedScheme={(value: string) => handleSchemeChange("selectedScheme", value)} />
        <UI1 className={classes.userInterface} schemeObj={schemeObj} />
      </div>
      <div className={classes.right}>
        <ColorToolHeading text="color palette" />
        <ColorPalette
          activeColor={schemeProperty === "text" ?
            schemeObj["textColorOverride"][selectedPalette] || ""
           :
            schemeObj[selectedPalette].main}
          onClick={(color: string) => assignColor(color)} />
        <ColorToolHeading text="current scheme" />
        <ColorScheme
          schemeObj={schemeObj}
          schemeProperty={schemeProperty}
          selectedPalette={selectedPalette}
          setSchemeProperty={setSchemeProperty}
          setSelectedPalette={setSelectedPalette}
          reset={(color: string | null) => assignColor(color)} />
      </div>
    </section>
  );
};

export default MenuStyles;


// TODO: any click on reset button or click on color on color palette triggers setting the "selectedScheme" as 'custom'
// no matter if the resulting "schemeObj" still equals any selected(or not-selected*) preset "schemeObj"
// (it's name shoud be set to "selectedScheme" instead of 'custom')

// * for now all json preset schemes don't get transformed into "colorObj"s anyway ( - only one selected scheme at a time)