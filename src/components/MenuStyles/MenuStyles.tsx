import React, { useEffect, useState } from "react";
import { makeStyles, Theme, } from "@material-ui/core/styles";
import ColorScheme from "./ColorScheme/ColorScheme";
import ColorPalette from "./ColorPalette/ColorPalette";
import ColorToolHeading from "./ColorToolHeading";
import UI1 from "./UserInterfaces/UI1";
import createScheme from "../../miscellaneous/createScheme";
import { SchemeObj } from "../../interfaces/interfaces";
import { UserInputKeys } from "../../SetupWizard";

interface Props {
  handleSchemeChange: <T>(propName: UserInputKeys, value: T) => void
  schemeObj: SchemeObj;
  setIsNextStepAllowed: React.Dispatch<React.SetStateAction<boolean>>;
  theme: Theme;
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
    justifyContent: "center"
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

const MenuStyles = ({ handleSchemeChange, schemeObj, setIsNextStepAllowed, theme }: Props) => {
  const classes = useStyles();
  const [schemeProperty, setSchemeProperty] = useState<"background" | "text">("background");
  const [selectedScheme, setSelectedScheme] = useState<"primary" | "secondary">("primary");
  const getContrastText = theme.palette.getContrastText;

  const assignColor = (color: string | null) => {
    // change background scheme
    if(schemeProperty === "background" && color !== null) {
      const newScheme = createScheme(color, getContrastText);
      handleSchemeChange(
        "schemeObj",
        {
         ...schemeObj, [selectedScheme]: newScheme
        });
    }
    // change text color override
    else {
      handleSchemeChange(
        "schemeObj",
        {
          ...schemeObj, textColorOverride: { ...schemeObj.textColorOverride, [selectedScheme]: color }
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
        <UI1 className={classes.userInterface} schemeObj={schemeObj} />
      </div>
      <div className={classes.right}>
        <ColorToolHeading text="color palette" />
        <ColorPalette onClick={assignColor} />
        <ColorToolHeading text="current scheme" />
        <ColorScheme
          schemeObj={schemeObj}
          schemeProperty={schemeProperty}
          setSchemeProperty={setSchemeProperty}
          selectedScheme={selectedScheme}
          setSelectedScheme={setSelectedScheme}
          reset={(color: string | null) => assignColor(color)} />
      </div>
    </section>
  );
};

export default MenuStyles;