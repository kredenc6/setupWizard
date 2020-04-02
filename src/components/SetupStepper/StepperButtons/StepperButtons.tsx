export default function() {
  return null;
}

// // THIS DEVELOPMENT SHOULD GO ALONGSIDE THE MENUS DEVELOPMENT
// // I'm not sure which buttons will be needed and which will be redundant. 

// import React from "react";
// import { Button, Typography } from "@material-ui/core";

// // interface Props {
// //   handleReset: any;
// //   handleNext: any;
// //   handleSkip: any;
// //   handleBack: any;
// //   activeStep: number;
// //   completed: boolean;
// //   classes: any;
// // }

// const StepperButtons = () => {
//   return(
//     <div>
//         { allStepsCompleted() ? (
//           <div>
//             <Button onClick={ handleReset }>Reset</Button>
//           </div>
//         ) : (
//           <div>
//             <div>
//               <Button disabled={ activeStep === 0 } onClick={ handleBack } className={ classes.button }>
//                 Back
//               </Button>
//               <Button
//                 variant="contained"
//                 color="primary"
//                 onClick={ handleNext }
//                 className={ classes.button }
//               >
//                 Next
//               </Button>
//               {isStepOptional(activeStep) && !completed.has(activeStep) && (
//                 <Button
//                   variant="contained"
//                   color="primary"
//                   onClick={handleSkip}
//                   className={classes.button}
//                 >
//                   Skip
//                 </Button>
//               )}
//               {activeStep !== steps.length &&
//                 (completed.has(activeStep) ? (
//                   <Typography variant="caption" className={classes.completed}>
//                     Step {activeStep + 1} already completed
//                   </Typography>
//                 ) : (
//                   <Button variant="contained" color="primary" onClick={handleComplete}>
//                     {completedSteps() === totalSteps() - 1 ? 'Finish' : 'Complete Step'}
//                   </Button>
//                 ))}
//             </div>
//           </div>
//         )}
//       </div>
//   );
// };

// export default StepperButtons;