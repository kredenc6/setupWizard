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

const SwTextField = forwardRef((props: TextFieldProps & Props, ref: React.Ref<HTMLInputElement>) => {
  const { inputAdornment, ...textFieldProps } = props;
  const inputProps = {
    autoComplete: "off",
    spellCheck: false,
    startAdornment: inputAdornment ?
      <InputAdornment position="start">{inputAdornment}</InputAdornment>
      : 
      null
  };

  return <StyledTextField
    {...textFieldProps}
    InputProps={inputProps}
    inputRef={ref}
    variant="outlined" />;
});

export default SwTextField;