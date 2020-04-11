import { darken, lighten, rgbToHex } from "@material-ui/core/styles";

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

export default createScheme;