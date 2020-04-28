import React from "react";
import { Button } from "@material-ui/core";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import SteppDescription from "../Steppinstruction/SteppInstruction";

interface Props {
  // allStepsCompleted: () => boolean;
  isFinished: boolean;
  handleBack: () => void;
  handleNext: () => void;
  handleReset: () => void;
  isFirstStep: () => boolean;
  isLastStep: () => boolean;
  isNextStepAllowed: boolean;
  // setIsFinished: React.Dispatch<React.SetStateAction<boolean>>;
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
    },
    invisible: {
      color: "transparent !important",
      backgroundColor: "transparent !important",
      border: "none !important"
    }
  })
);

const SwStepperButtonsWrapper = (props: Props) => {
  const classes = useStyles();
  const {
    isFinished,
    handleBack,
    handleNext,
    handleReset,
    isFirstStep,
    isLastStep,
    isNextStepAllowed,
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
            <Button
              className={`${classes.button} ${isFirstStep() ? classes.invisible : ""}`}
              disabled={isFirstStep()}
              onClick={handleBack}
            >
              Back
            </Button>
            {isLastStep() ?
                <Button className={classes.invisible} color="primary" disabled={true} variant="contained">
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