import React, { forwardRef } from "react";
import { InputAdornment, TextField, TextFieldProps } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";

interface Props {
  inputAdornment?: string;
};

const StyledTextField = withStyles(({ spacing }) => ({
  root: {
    margin: `${spacing(1)}px ${spacing(1) / 4}px`
  }
}))(TextField);

const SwTextField = forwardRef((props: TextFieldProps & Props, ref: React.Ref<HTMLDivElement>) => {
  const { inputAdornment, ...textFieldProps } = props
  // return <StyledTextField {...props} ref={ref} variant="outlined" />;

  return <StyledTextField
    {...textFieldProps}
    InputProps={inputAdornment ?
      { startAdornment: <InputAdornment position="start">{inputAdornment}</InputAdornment> }
      : 
      {}}
    ref={ref}
    variant="outlined" />;
});

export default SwTextField;