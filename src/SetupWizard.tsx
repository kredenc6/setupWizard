import React, { useEffect, useState } from 'react';
import { CssBaseline } from "@material-ui/core";
import { makeStyles, ThemeProvider } from "@material-ui/core/styles";
import MainMenu from "./components/MainMenu/MainMenu";
import MenuStyles from "./components/MenuStyles/MenuStyles";
import MenuJson from "./components/MenuJson/MenuJson";
import SelectedModule from "./components/SelectedModule/SelectedModule";
import SetupStepper from "./components/SetupStepper/SetupStepper";
import ServerState from "./components/sharedComponents/serverState";
import theme from "./theme/theme";
import sortObjEntriesAlphabetically from "./miscellaneous/sortObjEntriesAlphabetically";
import getServerState from "./miscellaneous/getServerState";
import capitalizeFirstLetter from "./miscellaneous/capitalizeFirstLetter";
import jsonObjFrame from './jsonObjFrame/jsonObjFrame';
import Interval from "./classes/Interval";
import { initialFilesState, initialUserInput } from "./initialStates/initialStates";
import { CHECK_SERVER_STATUS_INTERVAL, REMOTE_REPO_CHECK_INTERVAL, SERVER_ADDRESS } from "./initialStates/constants";
import { fetchRepoStatus, getLocalStorageRepoState } from "./gitFunctions/gitFunctions";
import { fetchJsonFiles, loadJsons } from "./fileFunctions/fileFunctions";
import { IntervalsObj, JsonObjModule, JsonObjKey, JsonResultObj, JsonScheme, Menu, ServerIs, UserInput } from "./interfaces/interfaces";

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
  const [activeStep, setActiveStep] = useState(1);
  const [isNextStepAllowed, setIsNextStepAllowed] = useState(false);
  const [userInput, setUserInput] = useState(initialUserInput);
  const [jsonObj, setJsonObj] = useState(jsonObjFrame);
  const [serverState, setServerState] = useState<ServerIs>("offline");
  const [jsonFilesState, setJsonFilesState] = useState(initialFilesState);
  const [intervals, setIntervals] = useState<IntervalsObj>({
    serverCheck: new Interval(CHECK_SERVER_STATUS_INTERVAL, async () => setServerState(await getServerState(SERVER_ADDRESS))),
    remoteRepoCheck: new Interval(REMOTE_REPO_CHECK_INTERVAL, (serverState: ServerIs, forcedRefresh?: boolean) => {
      loadRepoState(serverState, forcedRefresh)
        .then(updateMessage => console.log(updateMessage))
        .catch(err => console.log(err.message));
    })
  });

  useEffect(() => {
    intervals.serverCheck.start(true);

    return () => intervals.serverCheck.stop();
  },[intervals]);
  
  useEffect(() => {
    intervals.remoteRepoCheck.setCallbackProps([serverState]);
    if(serverState === "offline" || intervals.remoteRepoCheck.isRunning) return;

    intervals.remoteRepoCheck.start(true);

    return () => intervals.remoteRepoCheck.stop();
  },[intervals, serverState]);

  function handleUserInputChange<K extends keyof UserInput>(propName: K, value: UserInput[K]) {
    setUserInput(prev => ({ ...prev, [propName]: value }));
  }

  function handleJsonChange(value: JsonObjModule) {
    setJsonObj(prev => ({ ...prev, ...value }));
  }

  function handleTopicChange(value: string) {
    const appTopicIndex = jsonFilesState.loadedJsons.findIndex(loadedJson => loadedJson.app_topic === value);
    if(appTopicIndex !== -1) { // if some loaded json alredy has this app topic
      handleJsonSelection(jsonFilesState.loadedJsons[appTopicIndex]);
    } else {
      // twitter value change needs a special care to be saved properly
      const twitter = { "twitter": [{ ...jsonObj["twitter"][0], "channel_name": value, "url": value }] }; 
      userInput.resetJsonOnAppTopicChange ?
        userInput.setAlsoAsChannelValues ? // reset
          handleJsonSelection({ ...jsonObjFrame, "app_topic": value, ...fillInChannelValues(value, twitter.twitter) })
          :
          handleJsonSelection({ ...jsonObjFrame, "app_topic": value, ...twitter})
        :
        userInput.setAlsoAsChannelValues ? // don't reset
          handleJsonChange({ "app_topic": value, ...fillInChannelValues(value, twitter.twitter) })
          :
          handleJsonChange({ "app_topic": value, ...twitter })
    }
  }

  async function handleManualJsonLoading(fileList: FileList) {
    const loadedJsons = await loadJsons(fileList);
    intervals.remoteRepoCheck.stop();
    setJsonFilesState(prev => ({ ...prev, loadedJsons, localRepoState: null }));
  }

  function handleJsonSelection(jsonObj: JsonResultObj) {
    const newModules: UserInput["modules"] = JSON.parse(JSON.stringify(userInput.modules));
    for(const moduleName of Object.keys(userInput.modules)) {
      const isSelected = jsonObj.visible_components.includes(moduleName as keyof UserInput["modules"]);
      newModules[moduleName as keyof UserInput["modules"]].selected = isSelected;
    };
    handleUserInputChange("modules", newModules);
    setJsonObj(jsonObj);
  }

  function loadRepoState(serverState: ServerIs, forcedRefresh = false): Promise<string> {
    return new Promise((resolve, reject) => {
      const canRefresh = serverState === "online" &&
        ( forcedRefresh || shoudRepoStateBeRefreshed(jsonFilesState.lastRepoUpdate) );
      if(canRefresh) {
        refreshRepoState()
          .then(updateMessage => resolve(updateMessage))
          .catch((err: Error) => reject(err));
      } else {
        const localRepoState = getLocalStorageRepoState()?.state;
        if(localRepoState) {
          setJsonFilesState(prevState => ({ ...prevState, localRepoState }));
        }
        resolve("Repo state not updated.");
      }
    });
  }

  function refreshRepoState(): Promise<string> {
    return new Promise((resolve, reject) => {
      fetchRepoStatus(SERVER_ADDRESS)
        .then(state => {
          if(state) {
            const timeStamp = Date.now();
            localStorage.setItem("repoState", JSON.stringify({ timeStamp, state }));
            setJsonFilesState(prevState => ({ ...prevState, localRepoState: state, lastRepoUpdate: timeStamp }));
            resolve(`Repo updated at ${new Date(timeStamp)}`);
          
          } else {
            reject(new Error("Failed to fetch remote repo status."));
          }
        });
    });
  }

  function loadJsonsFromLocalRepo() {
    fetchJsonFiles(SERVER_ADDRESS, loadedJsons =>
      setJsonFilesState(prevState => ({ ...prevState, loadedJsons })));
    intervals.remoteRepoCheck.start(true);
  }

  const fillInChannelValues = (value: string, twitter?: JsonResultObj["twitter"]) => {
    twitter = twitter ||  [ { ...jsonObj["twitter"][0], "channel_name": value, "url": value } ];
    
    return {
      "facebook":  { ...jsonObj.facebook, "channel": value},
      "instagram": { ...jsonObj.instagram, "main_channel": value},
      "reddit":    { ...jsonObj.reddit, "sub_reddit": value},
      "videos":    [ ...jsonObj.videos.map(videoObj => ({ ...videoObj, "queries": [value]}))],
      "audio":     [ ...jsonObj.audio.map(audioObj => ({ ...audioObj, "queries": [value]}))],
      "books":     [ ...jsonObj.books.map(bookObj => ({ ...bookObj, "queries": [value]}))],
      "twitter":   twitter
    };
  };

  const SelectedModuleComponents: Menu[] =
    sortObjEntriesAlphabetically(Object.entries(userInput.modules))
    .filter(([_, module]) => module.selected)
    .map(([key, _]) => {
      return {
        label: capitalizeFirstLetter(key),
        component: <SelectedModule 
          appTopic={jsonObj.app_topic}
          handleJsonChange={(changedModule: JsonObjModule) => handleJsonChange({ [key]: changedModule })}
          jsonModuleObj={jsonObj[key as JsonObjKey] as unknown as JsonObjModule}
          moduleSettings={userInput.modules[key as keyof UserInput["modules"]]}
          moduleName={key}
          serverState={serverState}
          setIsNextStepAllowed={setIsNextStepAllowed} />
      };
  });

  const menus: Menu[] = [
    {
      label: "Main menu",
      component: <MainMenu
        fetchJsonsFromLocalRepo={loadJsonsFromLocalRepo}
        handleChannelsSwitch={() => handleUserInputChange("setAlsoAsChannelValues", !userInput.setAlsoAsChannelValues)}
        handleJsonChange={(value: string[]) => handleJsonChange({ "visible_components": value })}
        handleJsonSelection={handleJsonSelection}
        handleManualJsonLoading={handleManualJsonLoading}
        handleModuleChange={handleUserInputChange}
        handleResetSwitch={() => handleUserInputChange("resetJsonOnAppTopicChange", !userInput.resetJsonOnAppTopicChange)}
        handleTopicChange={handleTopicChange}
        remoteRepoCheckInterval={intervals.remoteRepoCheck}
        jsonFilesState={jsonFilesState}
        jsonObj={jsonObj}
        serverState={serverState}
        setAsChannelValues={userInput.setAlsoAsChannelValues}
        setIsNextStepAllowed={setIsNextStepAllowed}
        resetOtherValues={userInput.resetJsonOnAppTopicChange}
        userInput={userInput} />
    },
    {
      label: "Color scheme",
      component: <MenuStyles
        handleJsonChange={(value: JsonScheme) => handleJsonChange({ "ui_colors": value })}
        handleSchemeChange={handleUserInputChange}
        schemeObj={userInput.schemeObj}
        selectedScheme={userInput.selectedScheme}
        setIsNextStepAllowed={setIsNextStepAllowed} />
    },
    ...SelectedModuleComponents,
    {
      label: "config.json",
      component: <MenuJson
        jsonFilesState={jsonFilesState}
        handleJsonChange={(key: JsonObjKey,changedModule: JsonResultObj[JsonObjKey]) => handleJsonChange({ [key]: changedModule })}
        jsonObj={jsonObj}
        remoteRepoCheckInterval={intervals.remoteRepoCheck}
        serverState={serverState}
        userInput={userInput} />
    }
  ];

  return(
    <CssBaseline>
      <ThemeProvider theme={ theme }>
        <main className={classes.wizardWrapper}>
          <ServerState serverState={serverState} />
          {menus[activeStep - 1].component}
          <SetupStepper
            activeStep={activeStep}
            menuLabels={menus.map(({ label }) => label)}
            isNextStepAllowed={isNextStepAllowed}
            setActiveStep= {setActiveStep} />
        </main>
      </ThemeProvider>
    </CssBaseline>
  );
};

function shoudRepoStateBeRefreshed(lastUpdateTime: number) {
  const isTimeIntervalExceeded = Date.now() - lastUpdateTime > REMOTE_REPO_CHECK_INTERVAL;
  return isTimeIntervalExceeded;
}