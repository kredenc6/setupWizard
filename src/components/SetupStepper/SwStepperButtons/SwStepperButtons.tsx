import React, { useState } from "react";
import { Button } from "@material-ui/core";
import { createStyles, makeStyles, Theme, withStyles } from "@material-ui/core/styles";
import SteppDescription from "../Steppinstruction/SteppInstruction";

interface Props {
  allStepsCompleted: () => boolean;
  isFinished: boolean;
  handleBack: () => void;
  handleNext: () => void;
  handleReset: () => void;
  isFirstStep: () => boolean;
  isLastStep: () => boolean;
  isNextStepAllowed: boolean;
  setIsFinished: React.Dispatch<React.SetStateAction<boolean>>;
};

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    button: {
      marginRight: theme.spacing(1),
    },
    instructions: {
      marginTop: theme.spacing(1),
      marginBottom: theme.spacing(1)
    },
    stepperButtonsWrapper: {
      display: "flex",
      justifyContent: "center"
    }
  })
);

const BackButton = withStyles({
  root: {
    "&.invisible": {
      color: "transparent",
      backgroundColor: "transparent",
      border: "none"
    }
  }
})(Button);

const SwStepperButtonsWrapper = (props: Props) => {
  const classes = useStyles();
  const {
    allStepsCompleted,
    isFinished,
    handleBack,
    handleNext,
    handleReset,
    isFirstStep,
    isLastStep,
    isNextStepAllowed,
    setIsFinished
  } = props;

  return(
    <div className={classes.stepperButtonsWrapper}>
      {isFinished ?
          <>
            <SteppDescription
              className={classes.instructions}
              instruction="All steps completed - you're finished." />
            <Button onClick={handleReset}>Reset</Button>
          </>
        :
          <>
            <BackButton
              className={`${classes.button} ${isFirstStep() ? "invisible" : ""}`}
              disabled={isFirstStep()}
              onClick={handleBack}
            >
              Back
            </BackButton>
            {isLastStep() ?
                <Button color="primary" disabled={!allStepsCompleted()} onClick={() => setIsFinished(true)} variant="contained">
                  Finish
                </Button>
              : 
                <Button
                  className={classes.button}
                  color="primary"
                  disabled={!isNextStepAllowed}
                  onClick={handleNext}
                  variant="contained"
                >
                  Next
                </Button>
            }
        
          </>
      }
    </div>
  );
}

export default SwStepperButtonsWrapper;