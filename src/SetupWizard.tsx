import React, { useState } from 'react';
import { makeStyles, ThemeProvider } from "@material-ui/core/styles";
import MenuTopic from "./components/MenuTopic/MenuTopic";
import MenuStyles from "./components/MenuStyles/MenuStyles";
import MenuSearch from "./components/MenuSearch/MenuSearch";
import MenuJson from "./components/MenuJson/MenuJson";
import SelectedModule from "./components/SelectedModule/SelectedModule";
import SetupStepper from "./components/SetupStepper/SetupStepper";
import theme from "./theme/theme";
import { createSchemeObjFromTheme } from "./miscellaneous/colorSchemeFunctions";
import sortObjEntriesAlphabetically from "./miscellaneous/sortObjEntriesAlphabetically";
import { JsonObjModule, JsonObjKey, JsonResultObj, Menu, Module, UserInput } from "./interfaces/interfaces";
import jsonObjFrame from './jsonObjFrame/jsonObjFrame';

const styles = {
  wizardWrapper: {
    width: "100wv",
    height: "100vh",
    display: "grid",
    gridTemplateColumns: "100%",
    gridTemplateRows: `calc(100% - 150px - ${theme.spacing(1) * 2}px) 150px`, // row structure: ...
    // ... `calc(100vh - stepper height - wizardWrapper padding) stepper height`
    justifyContent: "stretch",
    justifyItems: "center",
    padding: `${theme.spacing(1)}px`
  }
};
const useStyles = makeStyles(styles);

const initialUserInput: UserInput = {
  appTopic: "placeholder",
  schemeObj: createSchemeObjFromTheme(theme),
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
      webPrefix: "www.instagram.com/",
      selected: false
    },
    facebook: {
      webPrefix: "www.facebook.com/",
      selected: false
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
      selected: false
    }
  }
};

const SetupWizard = () => {
  const classes = useStyles();
  const [activeStep, setActiveStep] = useState(1);
  const [isNextStepAllowed, setIsNextStepAllowed] = useState(false);
  const [userInput, setUserInput] = useState(initialUserInput);
  const [jsonObj, setJsonObj] = useState(jsonObjFrame);
  const [selectedScheme, setSelectedScheme] = useState("custom");
  
  function handleUserInputChange<K extends keyof UserInput>(propName: K, value: UserInput[K]): void {
    setUserInput(prev => ({ ...prev, [propName]: value }));
  }

  function handleJsonChange(value: JsonObjModule): void {
    setJsonObj(prev => ({ ...prev, ...value }));
  }

  const SelectedModuleComponents: Menu[] =
    sortObjEntriesAlphabetically(Object.entries(userInput.modules))
    .filter(([_, module]) => module.selected)
    .map(([key, module]) => {
      return {
        label: `Module(${key})`,
        component: <SelectedModule 
          appTopic={userInput.appTopic}
          handleSelectedModuleChange={(changedModule: Module) => handleUserInputChange(
            "modules",
            { ...userInput.modules, [key]: changedModule })}
          handleJsonChange={(changedModule: JsonObjModule) => handleJsonChange({[key]: changedModule})}
          jsonModuleObj={jsonObj[key as JsonObjKey] as unknown as JsonObjModule}
          module={module}
          moduleName={key}
          setIsNextStepAllowed={setIsNextStepAllowed} />
      };
  });

  const menus: Menu[] = [
    { 
      label: "Create app topic",
      component: <MenuTopic
        handleTopicChange={handleUserInputChange}
        setIsNextStepAllowed={setIsNextStepAllowed}
        value={userInput.appTopic} />
    },
    {
      label: "Select color scheme",
      component: <MenuStyles
        handleSchemeChange={handleUserInputChange}
        schemeObj={userInput.schemeObj}
        selectedScheme={selectedScheme}
        setIsNextStepAllowed={setIsNextStepAllowed}
        setSelectedScheme={setSelectedScheme} />
    },
    {
      label: "Select modules",
      component: <MenuSearch
        handleModuleChange={handleUserInputChange}
        modules={userInput.modules}
        setIsNextStepAllowed={setIsNextStepAllowed} />
    },
    ...SelectedModuleComponents,
    {
      label: "config.json",
      component: <MenuJson userInput={userInput} />
    }
  ];

  return(
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
  );
};

export default SetupWizard;
