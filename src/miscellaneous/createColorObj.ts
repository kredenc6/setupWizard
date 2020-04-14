import { Theme } from "@material-ui/core/styles";
import { createPaletteFromColor } from "./createScheme";
import { SchemeObj } from "../interfaces/interfaces";

export const createColorObj: ((theme: Theme) => SchemeObj) = theme => {
  return {
    primary: createPaletteFromColor(theme.palette.primary.main, theme.palette.getContrastText),
    secondary: createPaletteFromColor(theme.palette.secondary.main, theme.palette.getContrastText),
    textColorOverride: {
      primary: null,
      secondary: null
    }
  };
};

export default createColorObj;