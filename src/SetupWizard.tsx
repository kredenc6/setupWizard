import React, { useEffect, useReducer } from 'react';
import { CssBaseline } from "@material-ui/core";
import { makeStyles, ThemeProvider } from "@material-ui/core/styles";
import MainMenu from "./components/MainMenu/MainMenu";
import MenuStyles from "./components/MenuStyles/MenuStyles";
import MenuJson from "./components/MenuJson/MenuJson";
import SelectedModule from "./components/SelectedModule/SelectedModule";
import SetupStepper from "./components/SetupStepper/SetupStepper";
import ServerState from "./components/sharedComponents/ServerState";
import MessageSnackBar from "./components/sharedComponents/MessageSnackBar";
import theme from "./theme/theme";
import sortObjEntriesAlphabetically from "./miscellaneous/sortObjEntriesAlphabetically";
import getServerState from "./miscellaneous/getServerState";
import capitalizeFirstLetter from "./miscellaneous/capitalizeFirstLetter";
import Interval from "./classes/Interval";
import sWReducer from "./sWReducer/sWReducer";
import { createMessage } from "./sWReducer/messageHandlingFunctions";
import { initialReducerState } from "./initialStates/initialStates";
import { SERVER_STATUS_CHECK_INTERVAL, SERVER_ADDRESS } from "./initialStates/constants";
import { refreshRepoState, shouldRepoStateBeRefreshed } from "./gitFunctions/gitFunctions";
import { JsonObjModule, MenuInt, UserInputModuleKeys } from "./interfaces/interfaces";

import Menu from "./components/Menu/Menu";

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
    margin: "0 auto",
    padding: `${theme.spacing(1)}px ${theme.spacing(1)}px 0`
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

  const SelectedModuleComponents: MenuInt[] =
    sortObjEntriesAlphabetically(Object.entries(state.userInput.modules))
    .filter(([_, module]) => module.selected)
    .map(([key, _]) => {
      return {
        label: capitalizeFirstLetter(key),
        component: <SelectedModule 
          appTopic={state.jsonObj.app_topic}
          dispatch={dispatch}
          jsonModuleObj={state.jsonObj[key as UserInputModuleKeys] as unknown as JsonObjModule}
          moduleSettings={state.userInput.modules[key as UserInputModuleKeys]}
          moduleName={key as UserInputModuleKeys}
          serverState={state.serverState} />
      };
  });

  const menus: MenuInt[] = [
    {
      label: "Main menu",
      component: <MainMenu
          dispatch={dispatch}
          jsonFilesState={state.jsonFilesState}
          jsonObj={state.jsonObj}
          serverState={state.serverState}
          setAsChannelValues={state.userInput.setAlsoAsChannelValues}
          resetOtherValues={state.userInput.resetJsonOnAppTopicChange}
          userInput={state.userInput} />
    },
    {
      label: "Color scheme",
      component: <MenuStyles
        dispatch={dispatch}
        schemeObj={state.userInput.schemeObj}
        selectedScheme={state.userInput.schemeObj.name} />
    },
    ...SelectedModuleComponents,
    {
      label: "config.json",
      component: <MenuJson
        dispatch={dispatch}
        jsonFilesState={state.jsonFilesState}
        jsonObj={state.jsonObj}
        serverState={state.serverState}
        userInput={state.userInput} />
    }
  ];

  return(
    <CssBaseline>
      <ThemeProvider theme={ theme }>
        <main className={classes.wizardWrapper}>
          <MessageSnackBar
            dispatch={dispatch}
            message={state.activeMessage} />
          <ServerState serverState={state.serverState} />
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