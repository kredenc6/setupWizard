import React from "react";
import { TextField, TextFieldProps } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";

const StyledTextField = withStyles(({ spacing }) => ({
  root: {
    margin: `${spacing(1)}px ${spacing(1) / 4}px`
  }
}))(TextField);

const SwTextField = (props: TextFieldProps) => {
  return <StyledTextField {...props} variant="outlined" />;
};

export default SwTextField;