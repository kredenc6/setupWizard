import React, { useEffect, useState } from 'react';
import { CssBaseline } from "@material-ui/core";
import { makeStyles, ThemeProvider } from "@material-ui/core/styles";
import MenuTopic from "./components/MenuTopic/MenuTopic";
import MenuLoadedJsons from "./components/MenuLoadedJsons/MenuLoadedJsons";
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
  loadedJSONs: [],
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
      VERIFY_BY_PROXY: ["SELF"],
      WEB_PREFIX: ["https://"]
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
  
  function handleUserInputChange<K extends keyof UserInput>(propName: K, value: UserInput[K]) {
    setUserInput(prev => ({ ...prev, [propName]: value }));
  }

  function handleJsonChange(value: JsonObjModule) {
    setJsonObj(prev => ({ ...prev, ...value }));
  }

  function handleLoadingJsons(fileList: FileList) {
    new Promise(resolve => {
      const errorCount = { count: 0 };
      const JSONs: JsonResultObj[] = [];

      for(let i=0; i < fileList.length; i++) {
        fetch( URL.createObjectURL(fileList[i]) )
          .then(response => response.json())
          .then(json => {
            JSONs.push(json);
            if(JSONs.length + errorCount.count >= fileList.length) resolve(JSONs);
          })
          .catch(err => {
            console.log(err.message);
            errorCount.count++;
            if(JSONs.length + errorCount.count >= fileList.length) resolve(JSONs);
          });
      }
    })
    .then(JSONarr => {
      const JSONs = JSONarr as JsonResultObj[];
      handleUserInputChange("loadedJSONs", JSONs);

      if(JSONs[0]) setJsonObj(JSONs[0] as JsonResultObj);
    });
  }

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
          serverStatus={serverStatus}
          setIsNextStepAllowed={setIsNextStepAllowed} />
      };
  });

  const LoadedJsonsMenuComponent: Menu =
    {
      label: "LoadedJsons",
      component: <MenuLoadedJsons
        handleClick={(jsonObj: JsonResultObj) => {
          const newModules: UserInput["modules"] = JSON.parse(JSON.stringify(userInput.modules));
          for(const moduleName of Object.keys(userInput.modules)) {
            const isSelected = jsonObj.visible_components.includes(moduleName as keyof UserInput["modules"]);
            newModules[moduleName as keyof UserInput["modules"]].selected = isSelected;
          };
          handleUserInputChange("modules", newModules);
          setJsonObj(jsonObj);
        }}
        jsonObj={jsonObj}
        loadedJsons={userInput.loadedJSONs}
        setIsNextStepAllowed={setIsNextStepAllowed} />
    };

  const menus: Menu[] = [
    { 
      label: "Create app topic",
      component: <MenuTopic
        handleJsonChange={(value: string) => handleJsonChange({ "app_topic": value,
          "twitter": [{ ...jsonObj["twitter"][0], "channel_name": value }]})} // save also as a twitter channel_name
        handleLoadingJsons={handleLoadingJsons}
        setIsNextStepAllowed={setIsNextStepAllowed}
        value={jsonObj.app_topic} />
    },
    {...LoadedJsonsMenuComponent},
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
        serverStatus={serverStatus}
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