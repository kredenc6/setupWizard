
import React from "react";
import { Typography } from "@material-ui/core";
import { useTheme, withStyles } from "@material-ui/core/styles";

interface Props {
  text: string;
};

const MenuHeading = ({ text }:Props) => {
  const theme = useTheme();
  const StyledHeading = withStyles({
    root: {
      marginBottom: theme.spacing(3)
    }
  })(Typography);

  return <StyledHeading align="center" children={text} variant="h2" />;
};

export default MenuHeading;