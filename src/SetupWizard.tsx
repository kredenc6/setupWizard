import React, { useEffect, useState } from 'react';
import { CssBaseline } from "@material-ui/core";
import { makeStyles, ThemeProvider } from "@material-ui/core/styles";
import MenuTopic from "./components/MenuTopic/MenuTopic";
import MenuStyles from "./components/MenuStyles/MenuStyles";
import MenuSelectModules from "./components/MenuSelectModules/MenuSelectModules";
import MenuJson from "./components/MenuJson/MenuJson";
import SelectedModule from "./components/SelectedModule/SelectedModule";
import SetupStepper from "./components/SetupStepper/SetupStepper";
import theme from "./theme/theme";
import { createSchemeObjFromPresetScheme } from "./miscellaneous/colorSchemeFunctions";
import sortObjEntriesAlphabetically from "./miscellaneous/sortObjEntriesAlphabetically";
import jsonObjFrame from './jsonObjFrame/jsonObjFrame';
import { JsonObjModule, JsonObjKey, JsonResultObj, JsonScheme, Menu, UserInput } from "./interfaces/interfaces";

const CHECK_SERVER_STATUS_INTERVAL = 30000;

const styles = {
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
};
const useStyles = makeStyles(styles);

const initialUserInput: UserInput = {
  appTopic: "placeholder",
  schemeObj: createSchemeObjFromPresetScheme(jsonObjFrame.ui_colors, theme.palette.getContrastText),
  modules: {
    audio: {
      selected: false
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
      WEB_PREFIX: "https://"
    },
    facebook: {
      selected: false,
      VERIFY_BY_PROXY: ["channel"],
      WEB_PREFIX: "https://"
    },
    reddit: {
      selected: false
    },
    twitter: {
      selected: false
    },
    videos: {
      selected: false
    },
    websites: {
      selected: false,
      VERIFY_BY_PROXY: ["SELF"],
      WEB_PREFIX: "https://"
    }
  }
};

const SetupWizard = () => {
  const classes = useStyles();
  const [activeStep, setActiveStep] = useState(1);
  const [isNextStepAllowed, setIsNextStepAllowed] = useState(false);
  const [userInput, setUserInput] = useState(initialUserInput);
  const [jsonObj, setJsonObj] = useState(jsonObjFrame);
  const [selectedScheme, setSelectedScheme] = useState("default");
  const [serverStatus, setServerStatus] = useState("offline");

  useEffect(() => {
    getServerStatus().then(status => setServerStatus(status));

    const intervalID = window.setInterval( () => {
      getServerStatus().then(status => setServerStatus(status));
    }, CHECK_SERVER_STATUS_INTERVAL);

    return () => window.clearInterval(intervalID);
  },[]);
  
  function handleUserInputChange<K extends keyof UserInput>(propName: K, value: UserInput[K]): void {
    setUserInput(prev => ({ ...prev, [propName]: value }));
  }

  function handleJsonChange(value: JsonObjModule): void {
    setJsonObj(prev => ({ ...prev, ...value }));
  }

  const SelectedModuleComponents: Menu[] =
    sortObjEntriesAlphabetically(Object.entries(userInput.modules))
    .filter(([_, module]) => module.selected)
    .map(([key, _]) => {
      return {
        label: `Module(${key})`,
        component: <SelectedModule 
          appTopic={userInput.appTopic}
          handleJsonChange={(changedModule: JsonObjModule) => handleJsonChange({ [key]: changedModule })}
          jsonModuleObj={jsonObj[key as JsonObjKey] as unknown as JsonObjModule}
          moduleSettings={userInput.modules[key as keyof UserInput["modules"]]}
          moduleName={key}
          serverStatus={serverStatus}
          setIsNextStepAllowed={setIsNextStepAllowed} />
      };
  });

  const menus: Menu[] = [
    { 
      label: "Create app topic",
      component: <MenuTopic
        handleJsonChange={(value: string) => handleJsonChange({ "app_topic": value })}
        handleTopicChange={handleUserInputChange}
        setIsNextStepAllowed={setIsNextStepAllowed}
        value={userInput.appTopic} />
    },
    {
      label: "Select color scheme",
      component: <MenuStyles
        handleJsonChange={(value: JsonScheme) => handleJsonChange({ "ui_colors": value })}
        handleSchemeChange={handleUserInputChange}
        schemeObj={userInput.schemeObj}
        selectedScheme={selectedScheme}
        setIsNextStepAllowed={setIsNextStepAllowed}
        setSelectedScheme={setSelectedScheme} />
    },
    {
      label: "Select modules",
      component: <MenuSelectModules
        handleJsonChange={(value: string[]) => handleJsonChange({ "visible_components": value })}
        handleModuleChange={handleUserInputChange}
        modules={userInput.modules}
        serverStatus={serverStatus}
        setIsNextStepAllowed={setIsNextStepAllowed} />
    },
    ...SelectedModuleComponents,
    {
      label: "config.json",
      component: <MenuJson
        handleJsonChange={(key: JsonObjKey,changedModule: JsonResultObj[JsonObjKey]) => handleJsonChange({ [key]: changedModule })}
        jsonObj={jsonObj}
        userInput={userInput} />
    }
  ];

  return(
    <CssBaseline>
      <ThemeProvider theme={ theme }>
         <main className={classes.wizardWrapper}>
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

export default SetupWizard;

async function getServerStatus() {
  if (!navigator.onLine) return "no connection";

  return await fetch("https://damp-bayou-55824.herokuapp.com/")
  .then(response => response.status === 200 ? "online" : "offline")
  .catch(err => {
    console.log(err.message);
    return "offline";
  });
}