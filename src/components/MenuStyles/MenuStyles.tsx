import React, { useState } from "react";
import { makeStyles, Theme, darken, lighten, rgbToHex  } from "@material-ui/core/styles";
import ColorScheme from "./ColorScheme/ColorScheme";
import ColorPalette from "./ColorPalette/ColorPalette";
import PaletteHeading from "./PaletteHeading";
import { ColorObj } from "../../interfaces/interfaces";

import UI1 from "./UserInterfaces/UI1";

interface Props {
  theme: Theme;
};

const styles = {
  menuStyles: {
    height: "100vh",
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
    alignSelf: "flex-end",
    width: "600px",
    display: "flex",
    flexFlow: "row wrap"
  },
  userInterface: {
    alignSelf: "flex-start"
  }
};

const useStyles = makeStyles(styles);

const createColorObj: (theme: Theme) => ColorObj = theme => {
  return {
    primary: createScheme(theme.palette.primary.main, theme.palette.getContrastText),
    secondary: createScheme(theme.palette.secondary.main, theme.palette.getContrastText),
    textColorOverride: {
      primary: null,
      secondary: null
    }
  };
};

const createScheme = (background: string, getContrastText: (background: string) => string) => {
  const lightbackground = rgbToHex( lighten(background, 0.2) ),
        darkbackground = rgbToHex( darken(background, 0.3) );
  return {
    light: lightbackground,
    main: background,
    dark: darkbackground,
    contrastText: {
      light: getContrastText(lightbackground),
      main: getContrastText(background),
      dark: getContrastText(darkbackground)
    }
  };
};

const MenuStyles = ({ theme }: Props) => {
  const classes = useStyles();
  const [schemeProperty, setSchemeProperty] = useState<"background" | "text">("background");
  const [selectedScheme, setSelectedScheme] = useState<"primary" | "secondary">("primary");
  const [colorObj, setColorObj] = useState(createColorObj(theme));
  const getContrastText = theme.palette.getContrastText;

  const assignColor = (color: string | null) => {
    // change background scheme
    if(schemeProperty === "background" && color !== null) {
      const newScheme = createScheme(color, getContrastText);
      setColorObj(prevColorObj => {
        return { ...prevColorObj, [selectedScheme]: newScheme }
      });
    }
    // change text color override
    else {
      setColorObj(prevColorObj => {
        return { ...prevColorObj, textColorOverride: { ...prevColorObj.textColorOverride, [selectedScheme]: color} }
      });
    }
  };

  return(
    <section className={classes.menuStyles}>
      <div className={classes.left}>
        <PaletteHeading text="user interfaces" />
        <UI1 className={classes.userInterface} colorObj={colorObj} />
      </div>
      <div className={classes.right}>
        <ColorPalette onClick={assignColor} />
        <ColorScheme
          colorObj={colorObj}
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