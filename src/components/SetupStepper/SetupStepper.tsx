import React, { useCallback, useEffect, useState } from 'react';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import { Paper, Stepper} from '@material-ui/core';
import SwStepperButtons from "./SwStepperButtons/SwStepperButtons";
import SwStepConnector from "./SwStepConnector/SwStepConnector";
import SwStep from "./SwStep/SwStep";
import { SWActions } from '../../sWReducer/sWReducer';

interface Props {
  activeStep: number;
  dispatch: React.Dispatch<SWActions>
  menuLabels: string[];
  isNextStepAllowed: boolean;
};

const useStyles = makeStyles(theme =>
  createStyles({
    stepper: {
      width: "99%",
      margin: "0 auto",
      paddingTop: theme.spacing(1),
      zIndex: 1
    }
  })
);

export default function SetupStepper ({ activeStep, dispatch, menuLabels, isNextStepAllowed }: Props) {
  const classes = useStyles();
  const [completed, setCompleted] = useState(new Set<number>());
  const [isFinished, setIsFinished] = useState(false);

  const totalSteps = () => {
    return menuLabels.length;
  };

  const isFirstStep = () => {
    return activeStep === 1;
  }

  const isLastStep = () => {
    return activeStep === totalSteps();
  };

  const handleNext = () => {
    if(isLastStep()) return;
    dispatch({ type: "setActiveStep", payload: activeStep + 1 });
  };

  const handleBack = () => {
    dispatch({ type: "setActiveStep", payload: activeStep - 1 });
  };
  
  const handleStep = (step: number) => () => {
    dispatch({ type: "setActiveStep", payload: step });
  };
  
  const isStepComplete = useCallback(
    (step: number) => completed.has(step),
    [completed]
    );
    
  const handleReset = () => {
    dispatch({ type: "setActiveStep", payload: 1 });
    setCompleted(new Set<number>());
    setIsFinished(false);
  };

  const nextStepToBeCompleted = () => {
    if(completed.size === 0) return 1;

    const sortedArr = Array.from(completed).sort((a, b) => a - b); // sort completed steps array from min to max
    const nextStep = sortedArr.find((step, i, arr) => step + 1 !== arr[i + 1]) as number + 1; // ...
    // ...find the last completed step in a row and add 1 to it(the next step)
    return nextStep;
  }

  const isNextStepToBeCompleted = (index: number) => {
    if(nextStepToBeCompleted() === index + 1) return true;
    
    return false;
  };

  // handling setting steps as complete/not-complete
  useEffect(() => {
    // add step as complete
    if(isNextStepAllowed && !isStepComplete(activeStep)) {
      setCompleted(prevCompleted => {
        const newCompleted = new Set(prevCompleted);
        newCompleted.add(activeStep);
        return newCompleted;
      });
    }
    // remove step as complete
    if(!isNextStepAllowed && isStepComplete(activeStep)) {
      setCompleted(prevCompleted => {
        const newCompleted = new Set(prevCompleted);
        newCompleted.delete(activeStep);
        return newCompleted;
      });
    }
  },[activeStep, isNextStepAllowed, isStepComplete]);

  return(
    <Paper className={classes.stepper}>
      <SwStepperButtons 
        isFinished={isFinished}
        handleBack={handleBack}
        handleNext={handleNext}
        handleReset={handleReset}
        isFirstStep={isFirstStep}
        isLastStep={isLastStep}
        isNextStepAllowed={isNextStepAllowed} />
      <Stepper
        alternativeLabel
        connector={<SwStepConnector />}
        nonLinear
      >
        {menuLabels.map((menuLabel, index) => {
          return (
            <SwStep
              activeStep={activeStep}
              handleStep={handleStep}
              index={index}
              isNextStepAllowed={isNextStepAllowed}
              isNextStepToBeCompleted={isNextStepToBeCompleted}
              isStepComplete={isStepComplete}
              key={menuLabel}
              menuLabel={menuLabel}
              nextStepToBeCompleted={nextStepToBeCompleted} />
          );
        })}
      </Stepper>
    </Paper>
  );
};