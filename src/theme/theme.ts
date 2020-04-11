import { createMuiTheme } from "@material-ui/core/styles";
import { blue, purple } from "@material-ui/core/colors";

const theme = createMuiTheme({
    palette: {
      primary: {
        main: purple[400]
      },
      secondary: {
        main: blue[400]
      },
      divider: "rgba(50, 50, 50, .5)"
    }
});

export default theme;