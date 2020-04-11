import { Theme } from "@material-ui/core/styles";
import createScheme from "./createScheme";
import { SchemeObj } from "../interfaces/interfaces";

export const createColorObj: ((theme: Theme) => SchemeObj) = theme => {
  return {
    primary: createScheme(theme.palette.primary.main, theme.palette.getContrastText),
    secondary: createScheme(theme.palette.secondary.main, theme.palette.getContrastText),
    textColorOverride: {
      primary: null,
      secondary: null
    }
  };
};

export default createColorObj;