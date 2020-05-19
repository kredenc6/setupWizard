import React from "react";
import { Button, ButtonProps } from "@material-ui/core";

interface Props {
  handleClick: () => void;
};

const AvailableJsonsButton = ({ disabled, handleClick }: ButtonProps & Props) => {
  return(
    <Button
      color="secondary"
      disabled={disabled}
      onClick={handleClick}
      variant="outlined"
    >
      Show jsons
    </Button>
  );
};

export default AvailableJsonsButton;