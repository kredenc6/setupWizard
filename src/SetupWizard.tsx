import React, { useState } from 'react';
import { makeStyles, ThemeProvider } from "@material-ui/core/styles";
import MenuTopic from "./components/MenuTopic/MenuTopic";
import MenuStyles from "./components/MenuStyles/MenuStyles";
import MenuSearch from "./components/MenuSearch/MenuSearch";
import SetupStepper from "./components/SetupStepper/SetupStepper";
import theme from "./theme/theme";
import createColorObj from "./miscellaneous/createColorObj";
import sortObjEntriesAlphabetically from "./miscellaneous/sortObjEntriesAlphabetically";
import { Menu, Module, UserInput } from "./interfaces/interfaces";

import SelectedModule from "./components/SelectedModule/SelectedModule";
import WizardPageFacebook from "./components/WizardPageFacebook/WizardPageFacebook";
import WizardPageInstagram from "./components/WizardPageInstagram/WizardPageInstagram";

const styles = {
  wizardWrapper: {
    width: "100%",
    height: "100vh",
    display: "grid",
    gridTemplateColumns: "100%",
    gridTemplateRows: `calc(100vh - 150px - ${theme.spacing(1) * 2}px) 150px`, // row structure: ...
    // ... `calc(100vh - stepper height - wizardWrapper padding) stepper height`
    justifyContent: "stretch",
    justifyItems: "center",
    padding: `${theme.spacing(1)}px`
  }
};

const useStyles = makeStyles(styles);

const initialUserInput: UserInput = {
  appTopic: "",
  schemeObj: createColorObj(theme),
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
    video: {
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
  const [selectedScheme, setSelectedScheme] = useState("custom");
  const [mediaModules, setMediaModules] = useState({});
  
  function handleChange<K extends keyof UserInput>(propName: K, value: UserInput[K]): void {
    setUserInput(prev => ({ ...prev, [propName]: value }));
  }

  const SelectedModuleComponents: Menu[] =
    sortObjEntriesAlphabetically(Object.entries(userInput.modules))
    .filter(([_, module]) => module.selected)
    .map(([key, module]) => {
      return {
        label: `Module(${key})`,
        component: <SelectedModule 
          appTopic={userInput.appTopic}
          handleSelectedModuleChange={(changedModule: Module) => handleChange(
            "modules",
            { ...userInput.modules, [key]: changedModule })}
          module={module}
          setIsNextStepAllowed={setIsNextStepAllowed}
          title={`Add the ${key} page endpoint:`} />
      };
  });

  const menus: Menu[] = [
    { 
      label: "Create app topic",
      component: <MenuTopic
        handleTopicChange={handleChange}
        setIsNextStepAllowed={setIsNextStepAllowed}
        value={userInput.appTopic} />
    },
    {
      label: "Select color scheme",
      component: <MenuStyles
        handleSchemeChange={handleChange}
        schemeObj={userInput.schemeObj}
        selectedScheme={selectedScheme}
        setIsNextStepAllowed={setIsNextStepAllowed}
        setSelectedScheme={setSelectedScheme} />
    },
    {
      label: "Select modules",
      component: <MenuSearch
        handleModuleChange={handleChange}
        modules={userInput.modules}
        setIsNextStepAllowed={setIsNextStepAllowed} />
    },
    ...SelectedModuleComponents
  ];

  return(
    <ThemeProvider theme={ theme }>
      <main className={classes.wizardWrapper}>
        {menus[activeStep - 1].component}
        <SetupStepper
          activeStep={activeStep}
          mediaModules={mediaModules}
          menuLabels={menus.map(({ label }) => label)}
          isNextStepAllowed={isNextStepAllowed}
          setActiveStep= {setActiveStep} />
      </main>
    </ThemeProvider>
  );
};

export default SetupWizard;
