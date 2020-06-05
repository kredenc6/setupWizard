import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import ColorScheme from "./ColorScheme/ColorScheme";
import ColorPalette from "./ColorPalette/ColorPalette";
import ColorToolHeading from "./ColorToolHeading";
import UI1 from "./UserInterfaces/UI1";
import { createJsonSchemeObj, createPaletteFromColor } from "../../miscellaneous/colorSchemeFunctions";
import PresetSchemes from "./ColorScheme/PresetSchemes/PresetSchemes";
import { ColorSchemeInt } from "../../interfaces/interfaces";
import { SWActions } from "../../sWReducer/sWReducer";


interface Props {
  dispatch: React.Dispatch<SWActions>;
  schemeObj: ColorSchemeInt;
  selectedScheme: string;
};

const useStyles = makeStyles({
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
});

export default function MenuStyles( { dispatch, schemeObj, selectedScheme }: Props) {
  const classes = useStyles();
  const [schemeProperty, setSchemeProperty] = useState<"background" | "text">("background");
  const [selectedPalette, setSelectedPalette] = useState<"primary" | "secondary">("primary");

  const assignColor = (color: string | null) => {
    // change background scheme
    if(schemeProperty === "background" && color !== null) {
      const newPalette = createPaletteFromColor(color);
      const newColorScheme = { ...schemeObj, [selectedPalette]: newPalette, name: "custom" };
      const ui_colors = createJsonSchemeObj(newColorScheme);
      dispatch({ type: "changeUserInput", payload: { schemeObj: newColorScheme } });
      dispatch({ type: "changeJson", payload: { ui_colors } });
    }
    // change text color override
    else {
      const newColorScheme = {
        ...schemeObj,
        textColorOverride: { ...schemeObj.textColorOverride, [selectedPalette]: color },
        name: "cutom"
       };
      const ui_colors = createJsonSchemeObj(newColorScheme);
      dispatch({ type: "changeUserInput", payload: { schemeObj: newColorScheme } });
      dispatch({ type: "changeJson", payload: { ui_colors } });
    }
  };

  // always allow next step
  useEffect(() => {
    dispatch({ type: "setIsNextStepAllowed", payload: true });
  },[dispatch]);

  return(
    <section className={classes.menuStyles}>
      <div className={classes.left}>
        <ColorToolHeading text="user interfaces" />
        <PresetSchemes dispatch={dispatch} selectedScheme={selectedScheme} />
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

// TODO: any click on reset button or click on color on color palette triggers setting the "selectedScheme" as 'custom'
// no matter if the resulting "schemeObj" still equals any selected(or not-selected*) preset "schemeObj"
// (it's name shoud be set to "selectedScheme" instead of 'custom')

// * for now all json preset schemes don't get transformed into "colorObj"s anyway ( - only one selected scheme at a time)