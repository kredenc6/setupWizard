import React, { forwardRef } from "react";
import { InputAdornment, TextField, TextFieldProps } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import { unprefixValue } from "../../prefixFunctions/prefixFunctions";

interface Props {
  inputAdornment?: string;
};

const StyledTextField = withStyles(({ spacing, typography }) => ({
  root: {
    minWidth: `${typography.fontSize * 35}px`,
    margin: `${spacing(1)}px ${spacing(1) / 4}px`
  }
}))(TextField);

const SwTextField = forwardRef((props: TextFieldProps & Props, ref: React.Ref<HTMLInputElement>) => {
  
  const { inputAdornment, value, ...textFieldProps } = props;
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
    value={inputAdornment ? unprefixValue(inputAdornment, value as string) : value as string}
    variant="outlined" />;
});

export default SwTextField;