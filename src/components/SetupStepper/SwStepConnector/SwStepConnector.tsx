import React from "react";
import { StepConnector, StepConnectorProps } from "@material-ui/core";
import { Theme, withStyles } from "@material-ui/core/styles";

const WithStylesConnector = withStyles((theme: Theme) => ({
  completed: {
    '& $line': {
      borderColor: `${theme.palette.primary.main}`,
    },
  },
  disabled: {
    "&:not(.MuiStepConnector-active)": {
      "& $line": {
        borderTopStyle: "dashed",
        borderColor: theme.palette.text.disabled
      }
    }
  },
  line: {
    borderTopWidth: 2,
    borderRadius: 1
  }
}))(StepConnector);


const SwStepConnector = (props: StepConnectorProps) => {
  return(
    <WithStylesConnector {...props}/>
  );
};

export default SwStepConnector;