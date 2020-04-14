import React from "react";
import { TextField, TextFieldProps } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";

const StyledTextField = withStyles(({ spacing }) => ({
  root: {
    width: "80%",
    marginTop: spacing(4)
  }
}))(TextField);

const SwTextField = (props: TextFieldProps) => {
  return <StyledTextField {...props} variant="outlined" />;
};

export default SwTextField;