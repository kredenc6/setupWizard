import React, { useEffect, useReducer } from 'react';
import { CssBaseline } from "@material-ui/core";
import { makeStyles, ThemeProvider } from "@material-ui/core/styles";
import Menu from "./components/Menu/Menu";
import MainMenu from "./components/MainMenu/MainMenu";
import MenuStyles from "./components/MenuStyles/MenuStyles";
import MenuSelectedModules from "./components/MenuSelectedModules/MenuSelectedModules";
import MenuJson from "./components/MenuJson/MenuJson";
import SetupStepper from "./components/SetupStepper/SetupStepper";
import MessageSnackBar from "./components/sharedComponents/MessageSnackBar";
import theme from "./theme/theme";
import getServerState from "./miscellaneous/getServerState";
import Interval from "./classes/Interval";
import sWReducer from "./sWReducer/sWReducer";
import { createMessage } from "./sWReducer/messageHandlingFunctions";
import { initialReducerState } from "./initialStates/initialStates";
import { SERVER_STATUS_CHECK_INTERVAL, SERVER_ADDRESS } from "./initialStates/constants";
import { refreshRepoState, shouldRepoStateBeRefreshed } from "./gitFunctions/gitFunctions";
import { MenuInt } from "./interfaces/interfaces";

const useStyles = makeStyles({
  wizardWrapper: {
    maxWidth: "1980px",
    width: "100wv",
    height: "100vh",
    display: "grid",
    gridTemplateColumns: "100%",
    gridTemplateRows: `calc(100% - 150px - ${theme.spacing(1)}px) 150px`, // row structure: ...
    // ... `calc(100vh - stepper height - wizardWrapper padding) stepper height`
    justifyContent: "stretch",
    justifyItems: "center",
    margin: "0 auto"
  }
});

export default function SetupWizard() {
  const classes = useStyles();
  const [state, dispatch ] = useReducer(sWReducer, initialReducerState);

  useEffect(() => {
    const serverCheck = new Interval(SERVER_STATUS_CHECK_INTERVAL, async () => {
      dispatch({ type: "setServerState", payload: await getServerState(SERVER_ADDRESS) });
    });
    dispatch({ type: "setIntervals", payload: { serverCheck } });
  },[]);

  useEffect(() => {
    if(state.intervals.serverCheck && !state.intervals.serverCheck.isRunning) {
      state.intervals.serverCheck.start();
    }

    return () => {
      if(state.intervals.serverCheck) {
        state.intervals.serverCheck.stop();
      }
    }
  },[state.intervals]);
  
  useEffect(() => {
    dispatch({ type: "addMessage", payload: createMessage("server", state.serverState) });
  },[state.serverState]);
  
  useEffect(() => {
    if(shouldRepoStateBeRefreshed(state.jsonFilesState.lastRepoUpdate)) {
      refreshRepoState(dispatch);
    }
  },[state.jsonFilesState.lastRepoUpdate, state.serverState]);

  const menus: MenuInt[] = [
    {
      label: "Main menu",
      component: <Menu
        component={<MainMenu
          dispatch={dispatch}
          jsonFilesState={state.jsonFilesState}
          jsonObj={state.jsonObj}
          serverState={state.serverState}
          setAsChannelValues={state.userInput.setAlsoAsChannelValues}
          resetOtherValues={state.userInput.resetJsonOnAppTopicChange}
          userInput={state.userInput} />
        }
        headingText="Main menu"
        serverState={state.serverState} />
    },
    {
      label: "Color scheme",
      component: <MenuStyles
        dispatch={dispatch}
        schemeObj={state.userInput.schemeObj}
        selectedScheme={state.userInput.schemeObj.name} />
    },
    {
      label: "Selected modules",
      component: <Menu
        component={<MenuSelectedModules
          dispatch={dispatch}
          jsonObj={state.jsonObj}
          modules={state.userInput.modules}
          serverState={state.serverState} />
        }
        headingText="Selected modules"
        serverState={state.serverState} />
    },
    {
      label: "config.json",
      component: <Menu
        component={<MenuJson
          dispatch={dispatch}
          jsonFilesState={state.jsonFilesState}
          jsonObj={state.jsonObj}
          serverState={state.serverState}
          userInput={state.userInput} />
        }
        headingText="config.json"
        serverState={state.serverState} />
    }
  ];

  return(
    <CssBaseline>
      <ThemeProvider theme={ theme }>
        <main className={classes.wizardWrapper}>
          <MessageSnackBar
            dispatch={dispatch}
            message={state.activeMessage} />
          {menus[state.activeStep - 1].component}
          <SetupStepper
            activeStep={state.activeStep}
            dispatch={dispatch}
            menuLabels={menus.map(({ label }) => label)}
            isNextStepAllowed={state.isNextStepAllowed} />
        </main>
      </ThemeProvider>
    </CssBaseline>
  );
};