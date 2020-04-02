import React, { useState } from 'react';
import { ThemeProvider } from "@material-ui/core/styles";
import MenuTopic from "./components/MenuTopic/MenuTopic";
import MenuStyles from "./components/MenuStyles/MenuStyles";
import MenuSearch from "./components/MenuSearch/MenuSearch";
import SetupStepper from "./components/SetupStepper/SetupStepper";
import theme from "./theme/theme";


// // TODO: colorScheme type
// interface UserInput {
//   appTopic: string;
//   colorScheme: any;
//   selectedModules: {
//     audio: boolean;
//     books: boolean;
//     facebook: boolean;
//     instagram: boolean;
//     twitter: boolean;
//     video: boolean;
//     websites: boolean;
//   }
// };

const initialUserInput = {
  appTopic: "",
  colorScheme: {},
  selectedModules: {
    audio: false,
    books: false,
    facebook: false,
    instagram: false,
    twitter: false,
    video: false,
    websites: false
  }
};

const SetupWizard = () => {
  const [activeStep, setActiveStep] = useState(1);
  const [userInput, setUserInput] = useState(initialUserInput);
  const [mediaModules, setMediaModules] = useState({});
  const menus = [
    { 
      label: "Create app topic",
      instruction: "Search for: person, company, institution, etc.",
      isOptional: false,
      component:
        <MenuTopic
          value={ userInput.appTopic }
          onChange={ (value: string) => setUserInput(prev => ({ ...prev, appTopic: value })) }
        />
    },
    {
      label: "Select color scheme",
      instruction: "You can always style your app later.",
      isOptional: true,
      component: <MenuStyles theme={theme} />
    },
    {
      label: "Select modules",
      instruction: "What parts of the internet do you want to search?",
      isOptional: false,
      component: <MenuSearch
        mediaModules={ mediaModules }
        setMediaModules={ setMediaModules }
      />
    }
  ];
  return (
    <ThemeProvider theme={ theme }>
      <main>
        { menus[activeStep].component }
        <br></br>
        <SetupStepper
          menusInfo={ menus.map( ({ label, instruction, isOptional }) => { return { label, instruction, isOptional }; }) }
          mediaModules={ mediaModules }
          activeStep={ activeStep }
          setActiveStep= { setActiveStep } />
      </main>
    </ThemeProvider>
  );
};

export default SetupWizard;
