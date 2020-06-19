import { darken, lighten, rgbToHex, Theme } from "@material-ui/core/styles";
import rgbaToHex from "../miscellaneous/rgbaToHex";
import theme from "../theme/theme";
import { Palette, JsonColorScheme, ColorSchemeInt } from "../interfaces/colorSchemeInterfaces";
const { getContrastText } = theme.palette;

const normalizeColor = (color: string) => {
  if(color.startsWith("#")) {
    if(color.length === 7) return color;
    return `#${color[1]}${color[1]}${color[2]}${color[2]}${color[3]}${color[3]}`;
  }
  if(color.startsWith("rgba")) return rgbaToHex(color);
  if(color.startsWith("rgb")) return rgbToHex(color);
  throw new Error("Unknown color format.");
};

export const createPaletteFromColor = (background: string): Palette => {
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

export const createPaletteFromPresetScheme = (presetScheme: JsonColorScheme, type: "primary" | "secondary"): Palette => {
    const mainColor = presetScheme[`${type}Color` as keyof JsonColorScheme];
    
    if(!mainColor) throw new Error(`${type}Color property cannot be an empty string.`);

    const lightColor     = presetScheme[`${type}LightColor` as keyof JsonColorScheme] || rgbToHex( lighten(mainColor, 0.2) );
    const darkColor      = presetScheme[`${type}DarkColor`  as keyof JsonColorScheme] || rgbToHex( darken(mainColor,  0.3) );
    const mainTextColor  = presetScheme[`${type}TextColor`  as keyof JsonColorScheme] || getContrastText(mainColor);
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
  (primary: Palette, secondary: Palette, schemeName?: string, textColorOverride?: ColorSchemeInt["textColorOverride"]): ColorSchemeInt => {
    return {
      name: schemeName ? schemeName : "custom",
      primary,
      secondary,
      textColorOverride: textColorOverride || { primary: null, secondary: null }
    };
};

export const createSchemeObjFromPresetScheme = (presetScheme: JsonColorScheme) => {
    return createSchemeObjFromPalettes(
      createPaletteFromPresetScheme(presetScheme, "primary"),
      createPaletteFromPresetScheme(presetScheme, "secondary"),
      presetScheme.name
    );
};

export const createSchemeObjFromTheme = (theme: Theme): ColorSchemeInt => {
  return {
    name: "custom",
    primary: createPaletteFromColor(theme.palette.primary.main),
    secondary: createPaletteFromColor(theme.palette.secondary.main),
    textColorOverride: {
      primary: null,
      secondary: null
    }
  };
};

export const createJsonColorSchemeObj = (schemeObj: ColorSchemeInt): JsonColorScheme => {
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