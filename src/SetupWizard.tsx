import React, { useEffect, useState } from 'react';
import { CssBaseline } from "@material-ui/core";
import { makeStyles, ThemeProvider } from "@material-ui/core/styles";
import MenuStyles from "./components/MenuStyles/MenuStyles";
import MenuJson from "./components/MenuJson/MenuJson";
import SelectedModule from "./components/SelectedModule/SelectedModule";
import SetupStepper from "./components/SetupStepper/SetupStepper";
import theme from "./theme/theme";
import { createSchemeObjFromPresetScheme } from "./miscellaneous/colorSchemeFunctions";
import sortObjEntriesAlphabetically from "./miscellaneous/sortObjEntriesAlphabetically";
import getServerState from "./miscellaneous/getServerState";
import jsonObjFrame from './jsonObjFrame/jsonObjFrame';
import { fetchRepoStatus } from "./gitFunctions/gitFunctions";
import { fetchJsonFiles } from "./fileFunctions/fileFunctions";
import { IntervalsObj, JsonObjModule, JsonObjKey, JsonResultObj, JsonScheme, Menu, ServerIs, UserInput } from "./interfaces/interfaces";
import { FilesState, LocalStorageRepoState } from "./interfaces/fileInterfaces";

import NewServerState from "./components/sharedComponents/NewServerState";
import MainMenu from "./components/MainMenu/MainMenu";
import Interval from "./classes/Interval";

const CHECK_SERVER_STATUS_INTERVAL = 30000; // 30 seconds
const REMOTE_REPO_CHECK_INTERVAL = 3600000; // 1 hour
export const SERVER_ADDRESS = "http://localhost:5005";
// const SERVER_ADDRESS = "https://damp-bayou-55824.herokuapp.com/"; // heroku verification server

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

const initialFilesState: FilesState = {
  lastRepoUpdate: getLocalStorageRepoState()?.timeStamp || 0,
  loadedJsons: [],
  localRepoState: null,
  isActiveFileModified: false,
  isActiveFileSaved: null,
  loadManually: false
};

const initialUserInput: UserInput = {
  resetJsonOnAppTopicChange: true,
  setAlsoAsChannelValues: true,
  schemeObj: createSchemeObjFromPresetScheme(jsonObjFrame.ui_colors, theme.palette.getContrastText),
  modules: {
    audio: {
      selected: false,
      VERIFY_BY_PROXY: ["queries"],
      WEB_PREFIX: ["https://www.soundcloud.com/"]
    },
    books: {
      selected: false
    },
    events: {
      selected: false
    },
    instagram: {
      selected: false,
      VERIFY_BY_PROXY: ["main_channel", "other_channels"],
      WEB_PREFIX: ["https://www.instagram.com/"]
    },
    facebook: {
      selected: false,
      VERIFY_BY_PROXY: ["channel"],
      WEB_PREFIX: ["https://www.facebook.com/"]
    },
    reddit: {
      selected: false
    },
    twitter: {
      selected: false,
      VERIFY_BY_PROXY: ["url"],
      WEB_PREFIX: ["https://www.twitter.com/"]
    },
    videos: {
      selected: false,
      VERIFY_BY_PROXY: ["queries"],
      WEB_PREFIX: ["https://www.youtube.com/", "https://vimeo.com/"]
    },
    websites: {
      selected: false,
      VERIFY_BY_PROXY: ["SELF"]
    }
  }
};

export default function SetupWizard() {
  const classes = useStyles();
  const [activeStep, setActiveStep] = useState(1);
  const [isNextStepAllowed, setIsNextStepAllowed] = useState(false);
  const [userInput, setUserInput] = useState(initialUserInput);
  const [jsonObj, setJsonObj] = useState(jsonObjFrame);
  const [selectedScheme, setSelectedScheme] = useState("default"); // TODO can be gotten rid of or moved elsewhere?
  const [serverState, setServerState] = useState<ServerIs>("offline");
  const [isJsonSelectionOpen, setIsJsonSelectionOpen] = useState(false);
  const [jsonFilesState, setJsonFilesState] = useState(initialFilesState);
  const [intervals, setIntervals] = useState<IntervalsObj>({
    serverCheck: new Interval(CHECK_SERVER_STATUS_INTERVAL, () => getServerState(SERVER_ADDRESS).then(status => setServerState(status))),
    remoteRepoCheck: new Interval(REMOTE_REPO_CHECK_INTERVAL, (serverState: ServerIs, forcedRefresh?: boolean) => {
      loadLocalRepoState(serverState, forcedRefresh)
        .then(timeStamp => {
          if(timeStamp !== 0) {
            setJsonFilesState(prevState => ({ ...prevState, lastRepoUpdate: timeStamp }));
            console.log(`Repo updated at ${new Date(timeStamp)}`);
          } else {
            console.log("Repo state not updated.");
          }
        })
        .catch(err => console.log(err.message));
    })
  });

  useEffect(() => {
    intervals.serverCheck.start(true);
    fetchJsonsFromLocalRepo();

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

  function handleManualJsonLoading(fileList: FileList) {
    const fetchedJsons: Promise<JsonResultObj | undefined>[] = [];

    for(let i=0; i < fileList.length; i++) {
      fetchedJsons.push(
        fetch( URL.createObjectURL(fileList[i]) )
          .then(response => response.json())
          .then(json => json)
          .catch(err => console.log(err.message))
      )
    }
    Promise.all(fetchedJsons)
      .then(resolvedJsons => {
        const jsonResultObjs = resolvedJsons.filter(resolvedJson => resolvedJson) as JsonResultObj[]; // am I missing somethig? It should work without the type assertion
        setJsonFilesState(prev => ({ ...prev, loadedJsons: jsonResultObjs }))
      })
      .catch(err => console.log(err.message));
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

  function loadLocalRepoState(serverState: ServerIs, forcedRefresh = false): Promise<number> {
    return new Promise((resolve, reject) => {
      const canRefresh = serverState === "online" &&
        ( forcedRefresh || shoudRepoStateBeRefreshed(jsonFilesState.lastRepoUpdate) );
      
      if(canRefresh) {
        refreshLocalRepoState()
          .then(timeStamp => resolve(timeStamp))
          .catch((err: Error) => reject(err));
      } else {
        const localRepoState = getLocalStorageRepoState()?.state;
        if(localRepoState) {
          setJsonFilesState(prevState => ({ ...prevState, localRepoState }));
        }
        resolve(0);
      }
    });
  }

  function refreshLocalRepoState(): Promise<number> {
    return new Promise((resolve, reject) => {
      fetchRepoStatus(SERVER_ADDRESS)
        .then(state => {
          if(state) {
            const timeStamp = Date.now();
            localStorage.setItem("repoState", JSON.stringify({ timeStamp, state }));
            setJsonFilesState(prevState => ({ ...prevState, localRepoState: state }));
            resolve(timeStamp)
          
          } else {
            reject(new Error("Failed to fetch remote repo status."));
          }
        });
    });
  }

  function fetchJsonsFromLocalRepo() {
    fetchJsonFiles(SERVER_ADDRESS, (jsonFiles: JsonResultObj[]) => setJsonFilesState(prevState => {
      return { ...prevState, loadedJsons: jsonFiles }
    }));
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
        label: `Module(${key})`,
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
        fetchJsonsFromLocalRepo={fetchJsonsFromLocalRepo}
        handleChannelsSwitch={() => handleUserInputChange("setAlsoAsChannelValues", !userInput.setAlsoAsChannelValues)}
        handleJsonChange={(value: string[]) => handleJsonChange({ "visible_components": value })}
        handleJsonSelection={handleJsonSelection}
        handleManualJsonLoading={handleManualJsonLoading}
        handleModuleChange={handleUserInputChange}
        handleResetSwitch={() => handleUserInputChange("resetJsonOnAppTopicChange", !userInput.resetJsonOnAppTopicChange)}
        handleTopicChange={handleTopicChange}
        isJsonSelectionOpen={isJsonSelectionOpen}
        remoteRepoCheckInterval={intervals.remoteRepoCheck}
        jsonFilesState={jsonFilesState}
        jsonObj={jsonObj}
        serverState={serverState}
        setAsChannelValues={userInput.setAlsoAsChannelValues}
        setIsJsonSelectionOpen={setIsJsonSelectionOpen}
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
        selectedScheme={selectedScheme}
        setIsNextStepAllowed={setIsNextStepAllowed}
        setSelectedScheme={setSelectedScheme} />
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
          <NewServerState serverState={serverState} />
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

function getLocalStorageRepoState() {
  const repoStateString = localStorage.getItem("repoState") || undefined;
  return repoStateString ? JSON.parse(repoStateString) as LocalStorageRepoState : undefined;
}