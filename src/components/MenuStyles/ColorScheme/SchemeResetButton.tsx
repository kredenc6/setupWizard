import React from "react";
import { Box, Button, } from "@material-ui/core";
import { styled } from "@material-ui/core/styles";

interface Props {
  value: string;
  disabled: boolean;
  onClick: () => void;
};

const styles = {
  border: "1px solid #fff"
};
const StyledButton = styled(Button)(styles);

const SchemeResetButton = ({ value, disabled, onClick }: Props) => {
  return(
    <Box visibility={disabled ? "hidden" : "visible"}>
      <StyledButton
        variant="outlined"
        disabled={disabled}
        onClick={onClick}
        size="small"
      >
        {value}
      </StyledButton>
    </Box>
  );
};

export default SchemeResetButton;