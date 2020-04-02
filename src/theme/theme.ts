import { createMuiTheme } from "@material-ui/core/styles";
import { purple, blue } from "@material-ui/core/colors";

const theme = createMuiTheme({
    palette: {
      primary: {
        main: purple[400],
      },
      secondary: {
        main: blue[400],
      }
    }
});

export default theme;