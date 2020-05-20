import React, { useEffect, useState } from "react";
import { createStyles, makeStyles } from "@material-ui/core/styles";
import AvailableJsons from "../AvailableJsons/AvailableJsons";
import MenuHeading from "../sharedComponents/MenuHeading";
import MenuSelectModules from "../MenuSelectModules/MenuSelectModules";
import MenuTopic from "../MenuTopic/MenuTopic";
import MenuFileState from "../MenuFileState/MenuFileState";
import Submenu from "./Submenu";
import { JsonResultObj, ServerIs, UserInput } from "../../interfaces/interfaces";
import { FilesState } from "../../interfaces/fileInterfaces";
import Interval from "../../classes/Interval";

interface Props {
  fetchJsonsFromLocalRepo: () => void;
  handleChannelsSwitch: () => void;
  handleJsonChange: (value: string[]) => void;
  handleJsonSelection: (jsonObj: JsonResultObj) => void
  handleManualJsonLoading: (value: FileList) => void;
  handleModuleChange: <K extends keyof UserInput>(propName: K, value: UserInput[K]) => void;
  handleResetSwitch: () => void;
  handleTopicChange: (value: string) => void;
  jsonFilesState: FilesState;
  jsonObj: JsonResultObj;
  serverState: ServerIs;
  setAsChannelValues: boolean;
  setIsNextStepAllowed: React.Dispatch<React.SetStateAction<boolean>>;
  remoteRepoCheckInterval: Interval;
  resetOtherValues: boolean;
  userInput: UserInput;
};

const useStyles = makeStyles(theme => 
  createStyles({
    mainMenu: {
      height: "100%",
      width: "100%",
      display: "grid",
      gridTemplateRows: "auto auto-fill",
      padding: theme.spacing(1)
    },
    fileButtonsWrapper: {
      height: "100%",
      display: "flex",
      flexDirection: "column",
      alignItems: "center"
    },
    leftRight: {
      display: "flex",
      justifyContent: "space-around"
    },
    topBottom: {
      display: "grid",
      gridTemplateRows: "auto-fill auto-fill",
      gridGap: theme.spacing(1)
    }
  })
);

const isAtLeastOneModuleSelected = (modules: UserInput["modules"]) => {
  return Object.entries(modules).some(([_, module]) => {
    return module.selected;
  });
};

const isAppTopicValid = (appTopic: string) => appTopic.trim().length >= 2;

export default function MainMenu(props: Props) {
  const [isJsonSelectionOpen, setIsJsonSelectionOpen] = useState(false);
  const {
    fetchJsonsFromLocalRepo,
    handleChannelsSwitch,
    handleJsonChange,
    handleJsonSelection,
    handleManualJsonLoading,
    handleModuleChange,
    handleResetSwitch,
    handleTopicChange,
    jsonFilesState,
    jsonObj,
    serverState,
    setAsChannelValues,
    setIsNextStepAllowed,
    remoteRepoCheckInterval,
    resetOtherValues,
    userInput
  } = props;
  const classes = useStyles();

  //BUG? it's possible to have module prop "shwow_in_app" value true and the "visible_components" json prop
  // without the module
  useEffect(() => {
    setIsNextStepAllowed(isAtLeastOneModuleSelected(userInput.modules) && isAppTopicValid(jsonObj.app_topic));
  });

  return (
    <section className={classes.mainMenu}>
      <AvailableJsons
        activeJsonObj={jsonObj}
        handleJsonSelection={(jsonObj: JsonResultObj) => {
          handleJsonSelection(jsonObj);
          setIsJsonSelectionOpen(false);
        }}
        jsonFilesState={jsonFilesState}
        open={isJsonSelectionOpen}
        setIsJsonSelectionOpen={setIsJsonSelectionOpen} />
        <MenuHeading text="Main menu" />
        <div className={classes.leftRight}>
          <div className={classes.topBottom}>
            <Submenu
              component={
                <MenuTopic
                  handleChange={handleTopicChange}
                  handleChannelsSwitch={handleChannelsSwitch}
                  handleResetSwitch={handleResetSwitch}
                  resetOtherValues={resetOtherValues}
                  setAsChannelValues={setAsChannelValues}
                  value={jsonObj.app_topic} />
              }
              heading="What is the app topic?" />
            <Submenu
              component={
                <MenuFileState
                  fetchJsonsFromLocalRepo={fetchJsonsFromLocalRepo}
                  handleManualJsonLoading={handleManualJsonLoading}
                  jsonFilesState={jsonFilesState}
                  remoteRepoCheckInterval={remoteRepoCheckInterval}
                  serverState={serverState}
                  setIsJsonSelectionOpen={setIsJsonSelectionOpen} />
              }
              heading="Handle json files" />
            
          </div>
          <Submenu
            component={
              <MenuSelectModules
                handleJsonChange={handleJsonChange}
                handleModuleChange={handleModuleChange}
                modules={userInput.modules} />
            }
            heading="Select visible components" />
        </div>
    </section>
  );
};