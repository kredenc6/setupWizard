import { darken, lighten, rgbToHex } from "@material-ui/core/styles";
import { Palette, PresetScheme, SchemeObj } from "../interfaces/interfaces"; 

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
  (presetScheme: PresetScheme, type: "primary" | "secondary", getContrastText: (background: string) => string): Palette => {
    const mainColor = presetScheme[`${type}Color` as keyof PresetScheme];
    
    if(!mainColor) throw new Error(`${type}Color property cannot be an empty string.`);

    const lightColor     = presetScheme[`${type}LightColor` as keyof PresetScheme] || rgbToHex( lighten(mainColor, 0.2) );
    const darkColor      = presetScheme[`${type}DarkColor`  as keyof PresetScheme] || rgbToHex( darken(mainColor,  0.3) );
    const mainTextColor  = presetScheme[`${type}TextColor`  as keyof PresetScheme] || getContrastText(mainColor);
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
  (primary: Palette, secondary: Palette, textColorOverride?: SchemeObj["textColorOverride"]): SchemeObj => {
    textColorOverride = textColorOverride || { primary: null, secondary: null };
    
    return {
      primary,
      secondary,
      textColorOverride
    };
};

export const createSchemeObjFromPresetScheme =
  (presetScheme: PresetScheme, getContrastText: (background: string) => string): SchemeObj => {
    return createSchemeObjFromPalettes(
      createPaletteFromPresetScheme(presetScheme, "primary", getContrastText),
      createPaletteFromPresetScheme(presetScheme, "secondary", getContrastText)
    );
};