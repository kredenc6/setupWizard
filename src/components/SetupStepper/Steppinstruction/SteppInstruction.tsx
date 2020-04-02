import React from "react";
import { Typography } from "@material-ui/core";

interface Props {
  className: string;
  instruction: string;
}

const SteppInstruction = ({ className, instruction }: Props) => {
  return(
    <Typography className={ className }>
      { instruction }
    </Typography>
  );
};

export default SteppInstruction;