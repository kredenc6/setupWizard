import { darken, lighten, rgbToHex, Theme } from "@material-ui/core/styles";
import { Palette, JsonScheme, SchemeObj } from "../interfaces/interfaces"; 

export const createPaletteFromColor = (background: string, getContrastText: (background: string) => string): Palette => {
  const lightbackground = rgbToHex( lighten(background, 0.2) ),
        darkbackground  = rgbToHex( darken(background,  0.3) );
  
  return {
    light: lightbackground,
    main:  background,
    dark:  darkbackground,
    contrastText: {
      light: getContrastText(lightbackground),
      main:  getContrastText(background),
      dark:  getContrastText(darkbackground)
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
    secondaryLightColor: schemeObj.secondary.light,
    secondaryDarkColor: schemeObj.secondary.dark,
    secondaryTextColor: schemeObj.secondary.contrastText.main,
    accent: "",
    fab: ""
  };
};