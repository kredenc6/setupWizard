import { darken, lighten, rgbToHex, Theme } from "@material-ui/core/styles";
import rgbaToHex from "../miscellaneous/rgbaToHex";
import { Palette, JsonScheme, SchemeObj } from "../interfaces/interfaces";

const normalizeColor = (color: string) => {
  if(color.startsWith("#")) {
    if(color.length === 7) return color;
    return `#${color[1]}${color[1]}${color[2]}${color[2]}${color[3]}${color[3]}`;
  }
  if(color.startsWith("rgba")) return rgbaToHex(color);
  if(color.startsWith("rgb")) return rgbToHex(color);
  throw new Error("Unknown color format.");
};

export const createPaletteFromColor = (background: string, getContrastText: (background: string) => string): Palette => {
  const lightbackground   = rgbToHex( lighten(background, 0.2) ),
        darkbackground    = rgbToHex( darken(background,  0.3) ),
        lightContrastText = normalizeColor( getContrastText(lightbackground) ),
        mainContrastText  = normalizeColor( getContrastText(background) ),
        darkContrastText  = normalizeColor( getContrastText(darkbackground) );
  
  return {
    light: lightbackground,
    main:  background,
    dark:  darkbackground,
    contrastText: {
      light: lightContrastText,
      main:  mainContrastText,
      dark:  darkContrastText
    }
  };
};

export const createPaletteFromPresetScheme =
  (presetScheme: JsonScheme, type: "primary" | "secondary", getContrastText: (background: string) => string): Palette => {
    const mainColor = presetScheme[`${type}Color` as keyof JsonScheme];
    
    if(!mainColor) throw new Error(`${type}Color property cannot be an empty string.`);

    const lightColor     = presetScheme[`${type}LightColor` as keyof JsonScheme] || rgbToHex( lighten(mainColor, 0.2) );
    const darkColor      = presetScheme[`${type}DarkColor`  as keyof JsonScheme] || rgbToHex( darken(mainColor,  0.3) );
    const mainTextColor  = presetScheme[`${type}TextColor`  as keyof JsonScheme] || getContrastText(mainColor);
    const lightTextColor = getContrastText(lightColor);
    const darkTextColor  = getContrastText(darkColor);

    return {
      light: lightColor,
      main:  mainColor,
      dark:  darkColor,
      contrastText: {
        light: lightTextColor,
        main:  mainTextColor,
        dark:  darkTextColor
      }
    };
};

export const createSchemeObjFromPalettes =
  (primary: Palette, secondary: Palette, schemeName?: string, textColorOverride?: SchemeObj["textColorOverride"]): SchemeObj => {
    return {
      name: schemeName ? schemeName : "custom",
      primary,
      secondary,
      textColorOverride: textColorOverride || { primary: null, secondary: null }
    };
};

export const createSchemeObjFromPresetScheme =
  (presetScheme: JsonScheme, getContrastText: (background: string) => string): SchemeObj => {
    return createSchemeObjFromPalettes(
      createPaletteFromPresetScheme(presetScheme, "primary", getContrastText),
      createPaletteFromPresetScheme(presetScheme, "secondary", getContrastText),
      presetScheme.name
    );
};

export const createSchemeObjFromTheme = (theme: Theme): SchemeObj => {
  return {
    name: "custom",
    primary: createPaletteFromColor(theme.palette.primary.main, theme.palette.getContrastText),
    secondary: createPaletteFromColor(theme.palette.secondary.main, theme.palette.getContrastText),
    textColorOverride: {
      primary: null,
      secondary: null
    }
  };
};

export const createJsonSchemeObj = (schemeObj: SchemeObj): JsonScheme => {
  return {
    name: schemeObj.name,
    primaryColor: schemeObj.primary.main,
    primaryLightColor: schemeObj.primary.light,
    primaryDarkColor: schemeObj.primary.dark,
    primaryTextColor: schemeObj.primary.contrastText.main,
    secondaryColor: schemeObj.secondary.main,
    secondaryTextColor: schemeObj.secondary.contrastText.main,
    accent: "#FF4081",
    fab: "#ba8d4d"
  };
};