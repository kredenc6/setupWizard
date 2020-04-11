import React from "react";
import { Step, StepButton, StepProps } from "@material-ui/core";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";

interface Props extends StepProps {
  activeStep: number;
  handleStep: (step: number) => () => void;
  index: number;
  isNextStepAllowed: boolean;
  isNextStepToBeCompleted: (index: number) => boolean;
  isStepComplete: (index: number) => boolean;
  menuLabel: string;
  nextStepToBeCompleted: () => number;
};

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    activeStep: {
      "& svg": {
        fill: theme.palette.secondary.main
      },
      "& .MuiStepLabel-active": {
        padding: `0 ${theme.spacing(1)}px`,
        borderBottom: `2px solid ${theme.palette.secondary.main}`,
        borderRadius: "10px"
      }
    },
    disabledStep: {
      "& .MuiStepIcon-completed": {
        fill: theme.palette.text.disabled
      }
    },
    hiddenConnector: {
      "& .MuiStepConnector-root": {
        display: "none"
      }
    }
  })
);

const SwStep = (props: Props) => {
  const classes = useStyles();
  const {
    activeStep,
    handleStep,
    index,
    isNextStepAllowed,
    isNextStepToBeCompleted,
    isStepComplete,
    menuLabel,
    nextStepToBeCompleted,
    ...stepProps
  } = props;

  const isANextStepperButton = (index: number) => {
    return activeStep === index;
  };

  const shouldDisableStepperButton = (index: number) => {
    if(!isNextStepAllowed && activeStep <= index) return true; // disable for further steps on invalid value
    if(index + 1 > nextStepToBeCompleted()) return true; // don't skip uncompleted steps

    // don't disable if:
    if(isANextStepperButton(index) && isNextStepAllowed) return false; // is a next step + next step is allowed
    if(isStepComplete(index + 1)) return false; // is already completed
    if(isStepComplete(index) && isNextStepAllowed) return false; // previous step complete + next step is allowed...
    // ... like on active step 1 when steps 2 and 3 are completed -> 4 is clickable
    
    return true; // otherwise disable
  };

  return(
    <Step
      {...stepProps}
      active={activeStep - 1 === index ||
        (isNextStepToBeCompleted(index) && isNextStepAllowed)}
      className={
        `${(activeStep - 1 === index) ? classes.activeStep : ""} 
         ${shouldDisableStepperButton(index) ? classes.disabledStep : ""}
         ${index === 0 ? classes.hiddenConnector : ""}`}
      completed={isStepComplete(index + 1)}
      disabled={shouldDisableStepperButton(index)}
    >
        <StepButton icon={index + 1} onClick={handleStep(index + 1)}>
          {menuLabel}
        </StepButton>
      
    </Step>
  );
};

export default SwStep;