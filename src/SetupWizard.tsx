import React, { useEffect, useReducer, useState } from 'react';
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
import sWReducer, { SWActions } from "./sWReducer/sWReducer";
import { initialReducerState } from "./initialStates/initialStates";
import { SERVER_STATUS_CHECK_INTERVAL, REMOTE_REPO_CHECK_INTERVAL, SERVER_ADDRESS } from "./initialStates/constants";
import { fetchRepoStatus, getLocalStorageRepoState } from "./gitFunctions/gitFunctions";
import { IntervalsObj, JsonObjModule, Menu, ServerIs, UserInputModuleKeys } from "./interfaces/interfaces";


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
  const [intervals, setIntervals] = useState<IntervalsObj>({
    serverCheck: new Interval(SERVER_STATUS_CHECK_INTERVAL, async () =>
      dispatch({ type: "setServerState", payload: await getServerState(SERVER_ADDRESS) })),
    remoteRepoCheck: new Interval(REMOTE_REPO_CHECK_INTERVAL, (serverState: ServerIs, forcedRefresh?: boolean) => {
      loadRepoState(serverState, forcedRefresh)
        .then(updateMessage => console.log(updateMessage))
        .catch(err => console.log(err.message));

      function loadRepoState(serverState: ServerIs, forcedRefresh = false): Promise<string> {
        return new Promise((resolve, reject) => {
          const canRefresh = serverState === "online" &&
            ( forcedRefresh || shoudRepoStateBeRefreshed(state.jsonFilesState.lastRepoUpdate) );
          if(canRefresh) {
            refreshRepoState(dispatch)
              .then(updateMessage => resolve(updateMessage))
              .catch((err: Error) => reject(err));
          } else {
            const localRepoState = getLocalStorageRepoState()?.state;
            if(localRepoState) {
              dispatch({ type: "changeJsonFilesState", payload: { localRepoState } });
            }
            resolve("Repo state not updated.");
          }
        });
      }
    })
  });

  useEffect(() => {
    intervals.serverCheck.start(true);

    return () => intervals.serverCheck.stop();
  },[intervals]);
  
  useEffect(() => {
    intervals.remoteRepoCheck.setCallbackProps([state.serverState]);
    if(state.serverState === "offline" || intervals.remoteRepoCheck.isRunning) return;

    intervals.remoteRepoCheck.start(true);

    return () => intervals.remoteRepoCheck.stop();
  },[intervals, state.serverState]);

  const SelectedModuleComponents: Menu[] =
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

  const menus: Menu[] = [
    {
      label: "Main menu",
      component: <MainMenu
        dispatch={dispatch}
        remoteRepoCheckInterval={intervals.remoteRepoCheck}
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
        remoteRepoCheckInterval={intervals.remoteRepoCheck}
        serverState={state.serverState}
        userInput={state.userInput} />
    }
  ];

  return(
    <CssBaseline>
      <ThemeProvider theme={ theme }>
        <main className={classes.wizardWrapper}>
          <MessageSnackBar
            message={`Server is ${state.serverState}.`}
            type={state.serverState === "offline" ? "warning" : "info"} />
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

function shoudRepoStateBeRefreshed(lastUpdateTime: number) {
  const isTimeIntervalExceeded = Date.now() - lastUpdateTime > REMOTE_REPO_CHECK_INTERVAL;
  return isTimeIntervalExceeded;
}

function refreshRepoState(dispatch: React.Dispatch<SWActions>): Promise<string> {
  return new Promise((resolve, reject) => {
    fetchRepoStatus(SERVER_ADDRESS)
      .then(state => {
        if(state) {
          const timeStamp = Date.now();
          localStorage.setItem("repoState", JSON.stringify({ timeStamp, state }));
          dispatch({ type: "changeJsonFilesState", payload: { localRepoState: state, lastRepoUpdate: timeStamp } });
          resolve(`Repo updated at ${new Date(timeStamp)}`);
        
        } else {
          reject(new Error("Failed to fetch remote repo status."));
        }
      });
  });
}
