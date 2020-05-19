import React, { useEffect } from "react";
import { Badge, Button } from "@material-ui/core";
import { createStyles, makeStyles } from "@material-ui/core/styles";
import AvailableJsons from "../AvailableJsons/AvailableJsons";
import AvailableJsonsButton from "./AvailableJsonsButton";
import GitStateReport from "../sharedComponents/GitStateReport/GitStateReport";
import MenuHeading from "../sharedComponents/MenuHeading";
import MenuSelectModules from "../MenuSelectModules/MenuSelectModules";
import MenuTopic from "../MenuTopic/MenuTopic";
import UploadButton from "./UploadButton";
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
  isJsonSelectionOpen: boolean;
  jsonFilesState: FilesState;
  jsonObj: JsonResultObj;
  serverState: ServerIs;
  setAsChannelValues: boolean;
  setIsJsonSelectionOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setIsNextStepAllowed: React.Dispatch<React.SetStateAction<boolean>>;
  remoteRepoCheckInterval: Interval;
  resetOtherValues: boolean;
  userInput: UserInput;
};

const useStyles = makeStyles(theme =>
  createStyles({
    mainMenu: {
      width: "100%"
    },
    fileButtonsWrapper: {
      position: "fixed",
      display: "flex",
      flexDirection: "column",
      alignItems: "center"
    },
    subMenus: {
      display: "flex",
      justifyContent: "space-around"
    },
    updateBtt: {
      padding: `${theme.spacing(1) / 2}px`,
      fontSize: theme.typography.fontSize,
      fontWeight: theme.typography.fontWeightRegular,
      color: theme.palette.text.primary,
      "&:hover": {
        cursor: "pointer"
      }
    }
  })
);

const isAtLeastOneModuleSelected = (modules: UserInput["modules"]) => {
  return Object.entries(modules).some(([_, module]) => {
    return module.selected;
  });
};

const isAppTopicValid = (appTopic: string) => appTopic.trim().length >= 2;

export default function MainMenu (props: Props) {
  const {
    fetchJsonsFromLocalRepo,
    handleChannelsSwitch,
    handleJsonChange,
    handleJsonSelection,
    handleManualJsonLoading,
    handleModuleChange,
    handleResetSwitch,
    handleTopicChange,
    isJsonSelectionOpen,
    jsonFilesState,
    jsonObj,
    serverState,
    setAsChannelValues,
    setIsJsonSelectionOpen,
    setIsNextStepAllowed,
    remoteRepoCheckInterval,
    resetOtherValues,
    userInput
  } = props;
  const classes = useStyles();
  const jsonFileCount = jsonFilesState.loadedJsons.length;

  //BUG? it's possible to have module prop "shwow_in_app" value true and the "visible_components" json prop
  // without the module
  useEffect(() => {
    setIsNextStepAllowed(isAtLeastOneModuleSelected(userInput.modules) && isAppTopicValid(jsonObj.app_topic));
  });

  return(
    <section className={classes.mainMenu}>
      <div className={classes.fileButtonsWrapper}>
        <GitStateReport
          gitState={jsonFilesState.localRepoState}
          lastRepoUpdate={jsonFilesState.lastRepoUpdate}
          remoteRepoCheckInterval={remoteRepoCheckInterval}
          serverState={serverState} />
        <Badge badgeContent={jsonFileCount} color="error">
          <AvailableJsonsButton
            disabled={jsonFileCount === 0}
            handleClick={() => setIsJsonSelectionOpen(true)} />
        </Badge>
        <UploadButton
          childClass={classes.updateBtt}
          handleManualJsonLoading={handleManualJsonLoading}
          text="Load JSON(s) manualy" />
        <Button
          children="Load JSON(s) from repo"
          disabled={serverState === "offline"}
          className={classes.updateBtt}
          onClick={fetchJsonsFromLocalRepo} />
      </div>
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
      <div className={classes.subMenus}>
        <MenuTopic
          handleChange={handleTopicChange}
          handleChannelsSwitch={handleChannelsSwitch}
          handleResetSwitch= {handleResetSwitch}
          resetOtherValues={resetOtherValues}
          setAsChannelValues={setAsChannelValues}
          value={jsonObj.app_topic} />
        <MenuSelectModules
          handleJsonChange={handleJsonChange}
          handleModuleChange={handleModuleChange}
          modules={userInput.modules} />
      </div>
    </section>
  );
};