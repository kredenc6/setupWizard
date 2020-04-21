import React, { useCallback, useEffect, useState } from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { Stepper} from '@material-ui/core';
import SwStepperButtons from "./SwStepperButtons/SwStepperButtons";
import SwStepConnector from "./SwStepConnector/SwStepConnector";
import SwStep from "./SwStep/SwStep";

interface Props {
  activeStep: number;
  menuLabels: string[];
  isNextStepAllowed: boolean;
  setActiveStep: React.Dispatch<React.SetStateAction<number>>;
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: '100%',
      paddingTop: theme.spacing(1),
      borderTop: `1px solid ${theme.palette.divider}`
    }
  })
);

const SetupStepper = ({ activeStep, menuLabels, isNextStepAllowed, setActiveStep }: Props) => {
  const classes = useStyles();
  const [completed, setCompleted] = useState(new Set<number>());
  const [isFinished, setIsFinished] = useState(false);

  const totalSteps = () => {
    return menuLabels.length;
  };

  const completedSteps = () => {
    return completed.size;
  };

  const allStepsCompleted = () => {
    return completedSteps() === totalSteps();
  };

  const isFirstStep = () => {
    return activeStep === 1;
  }

  const isLastStep = () => {
    return activeStep === totalSteps();
  };

  const handleNext = () => {
    if(isLastStep()) return;
    setActiveStep(activeStep + 1);
  };

  const downloadJson = () => {
    
  }

  const handleBack = () => {
    setActiveStep(prevActiveStep => prevActiveStep - 1);
  };

  const handleStep = (step: number) => () => {
    setActiveStep(step);
  };

  const isStepComplete = useCallback(
    (step: number) => completed.has(step),
    [completed]
  );

  const handleReset = () => {
    setActiveStep(1);
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
    <div className={ classes.root }>
      <SwStepperButtons 
        allStepsCompleted={allStepsCompleted}
        isFinished={isFinished}
        handleBack={handleBack}
        handleNext={handleNext}
        downloadJson={downloadJson}
        handleReset={handleReset}
        isFirstStep={isFirstStep}
        isLastStep={isLastStep}
        isNextStepAllowed={isNextStepAllowed}
        setIsFinished={setIsFinished} />
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
    </div>
  );
};

export default SetupStepper;