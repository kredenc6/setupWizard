import React from 'react';
import SteppDescription from "./Steppinstruction/SteppInstruction";
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import { Stepper, Step, StepButton, Button, Typography } from '@material-ui/core';

interface Props {
  menusInfo: Array<
    { 
      label: string,
      instruction: string,
      isOptional: boolean
    }
  >;
  mediaModules: {};
  activeStep: number;
  setActiveStep: React.Dispatch<React.SetStateAction<number>>;
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: '100%',
    },
    button: {
      marginRight: theme.spacing(1),
    },
    backButton: {
      marginRight: theme.spacing(1),
    },
    completed: {
      display: 'inline-block',
    },
    instructions: {
      marginTop: theme.spacing(1),
      marginBottom: theme.spacing(1)
    }
  })
);

function createSteps(arr: any[]) {
  return arr.map((_, i) => i + 1);
}

const SetupStepper = ({ menusInfo, mediaModules, activeStep, setActiveStep }: Props) => {
  const classes = useStyles();
  const [completed, setCompleted] = React.useState(new Set<number>());
  const [skipped, setSkipped] = React.useState(new Set<number>());
  const steps = createSteps(menusInfo);

  const totalSteps = () => {
    return menusInfo.length;
  };

  const isStepOptional = (step: number) => {
    return step === 1;
  };

  const handleSkip = () => {
    if (!isStepOptional(activeStep)) {
      // You probably want to guard against something like this
      // it should never occur unless someone's actively trying to break something.
      throw new Error("You can't skip a step that isn't optional.");
    }

    setActiveStep(prevActiveStep => prevActiveStep + 1);
    setSkipped(prevSkipped => {
      const newSkipped = new Set(prevSkipped.values());
      newSkipped.add(activeStep);
      return newSkipped;
    });
  };

  const skippedSteps = () => {
    return skipped.size;
  };

  const completedSteps = () => {
    return completed.size;
  };

  const allStepsCompleted = () => {
    return completedSteps() === totalSteps() - skippedSteps();
  };

  const isLastStep = () => {
    return activeStep === totalSteps() - 1;
  };

  const handleNext = () => {
    const newActiveStep =
      isLastStep() && !allStepsCompleted()
        ? // It's the last step, but not all steps have been completed
          // find the first step that has been completed
          steps.findIndex((step, i) => !completed.has(i))
        : activeStep + 1;

    setActiveStep(newActiveStep);
  };

  const handleBack = () => {
    setActiveStep(prevActiveStep => prevActiveStep - 1);
  };

  const handleStep = (step: number) => () => {
    setActiveStep(step);
  };

  const handleComplete = () => {
    const newCompleted = new Set(completed);
    newCompleted.add(activeStep);
    setCompleted(newCompleted);

    /**
     * Sigh... it would be much nicer to replace the following if conditional with
     * `if (!this.allStepsComplete())` however state is not set when we do this,
     * thus we have to resort to not being very DRY.
     */
    if (completed.size !== totalSteps() - skippedSteps()) {
      handleNext();
    }
  };

  const handleReset = () => {
    setActiveStep(0);
    setCompleted(new Set<number>());
    setSkipped(new Set<number>());
  };

  const isStepSkipped = (step: number) => {
    return skipped.has(step);
  };

  function isStepComplete(step: number) {
    return completed.has(step);
  }

  return (
    <div className={ classes.root }>
      <Stepper alternativeLabel nonLinear activeStep={ activeStep }>
        { menusInfo.map((menuInfo, index) => {
          const stepProps: { completed?: boolean } = {};
          const buttonProps: { optional?: React.ReactNode } = {};
          if (menuInfo.isOptional) {
            buttonProps.optional = <Typography variant="caption">Optional</Typography>;
          }
          if (isStepSkipped(index)) {
            stepProps.completed = false;
          }
          return (
            <Step key={ menuInfo.label } { ...stepProps }>
              <StepButton
                onClick={ handleStep(index) }
                completed={ isStepComplete(index) }
                { ...buttonProps }
              >
                { menuInfo.label }
              </StepButton>
            </Step>
          );
        })}
      </Stepper>
      <div>
        { allStepsCompleted() ? (
          <div>
            <SteppDescription
              className={ classes.instructions }
              instruction="All steps completed - you're finished." />
            <Button onClick={ handleReset }>Reset</Button>
          </div>
        ) : (
          <div>
            <SteppDescription
              className={ classes.instructions }
              instruction={ menusInfo[activeStep].instruction } />
            <div>
              <Button disabled={ activeStep === 0 } onClick={ handleBack } className={ classes.button }>
                Back
              </Button>
              <Button
                variant="contained"
                color="primary"
                onClick={ handleNext }
                className={ classes.button }
              >
                Next
              </Button>
              {isStepOptional(activeStep) && !completed.has(activeStep) && (
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleSkip}
                  className={classes.button}
                >
                  Skip
                </Button>
              )}
              {activeStep !== steps.length &&
                (completed.has(activeStep) ? (
                  <Typography variant="caption" className={classes.completed}>
                    Step {activeStep + 1} already completed
                  </Typography>
                ) : (
                  <Button variant="contained" color="primary" onClick={handleComplete}>
                    {completedSteps() === totalSteps() - 1 ? 'Finish' : 'Complete Step'}
                  </Button>
                ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SetupStepper;


// import React from "react";
// import { Stepper as MaterialStepper, Step } from "@material-ui/core";

// interface Props {
//   menus: Array<
//     { 
//       description: string,
//       component: JSX.Element
//     }
//   >;
//   mediaModules: {};
// }

// const Stepper = ({ menus, mediaModules }: Props) => {
//   // const stepComponents = menus.map(menu => <Step />);
//   const stepperComponents = menus.map((menu, i) => {
//     if(i !== menus.length - 1) {
//       return(
//         <React.Fragment key={ menu.description }>
//           <Step description={ menu.description } />
//           <div className={ classes.sliderDotConnector }></div>
//         </React.Fragment>
//       );
//     }
//   return(
//     <section>
//       <MaterialStepper alternativeLabel>
//         <Step />
//         <Step />
//       </MaterialStepper>
//     </section>
//   );
// };

// export default Stepper;