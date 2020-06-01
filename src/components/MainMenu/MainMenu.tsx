import React, { useEffect, useState } from "react";
import { createStyles, makeStyles } from "@material-ui/core/styles";
import AvailableJsons from "../AvailableJsons/AvailableJsons";
import MenuSelectModules from "../MenuSelectModules/MenuSelectModules";
import MenuTopic from "../MenuTopic/MenuTopic";
import MenuFileState from "../MenuFileState/MenuFileState";
import Submenu from "./Submenu";
import { JsonResultObj, ServerIs, UserInput } from "../../interfaces/interfaces";
import { FilesState } from "../../interfaces/fileInterfaces";
import { SWActions } from "../../sWReducer/sWReducer";

interface Props {
  dispatch: React.Dispatch<SWActions>;
  jsonFilesState: FilesState;
  jsonObj: JsonResultObj;
  serverState: ServerIs;
  setAsChannelValues: boolean;
  resetOtherValues: boolean;
  userInput: UserInput;
};

const useStyles = makeStyles(theme => 
  createStyles({
    mainMenu: {
      width: "100%",
      display: "grid",
      gridTemplateRows: "auto-fill",
      padding: `${theme.spacing(2)}px ${theme.spacing(1)}px ${theme.spacing(1)}px`
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
    dispatch,
    jsonFilesState,
    jsonObj,
    serverState,
    setAsChannelValues,
    resetOtherValues,
    userInput
  } = props;
  const classes = useStyles();

  //BUG? it's possible to have module prop "shwow_in_app" value true and the "visible_components" json prop
  // without the module
  useEffect(() => {
    const isAllowed = isAtLeastOneModuleSelected(userInput.modules) && isAppTopicValid(jsonObj.app_topic);
    dispatch({ type: "setIsNextStepAllowed", payload: isAllowed });
  },[dispatch, jsonObj, userInput]);

  return (
    <section className={classes.mainMenu}>
      <AvailableJsons
        activeJsonObj={jsonObj}
        handleJsonSelection={(jsonObj: JsonResultObj) => {
          dispatch({ type: "selectJson", payload: jsonObj });
          setIsJsonSelectionOpen(false);
        }}
        jsonFilesState={jsonFilesState}
        open={isJsonSelectionOpen}
        setIsJsonSelectionOpen={setIsJsonSelectionOpen} />
      <div className={classes.leftRight}>
        <div className={classes.topBottom}>
          <Submenu
            component={
              <MenuTopic
                dispatch={dispatch}
                resetOtherValues={resetOtherValues}
                setAsChannelValues={setAsChannelValues}
                value={jsonObj.app_topic} />
            }
            heading="What is the app topic?" />
          <Submenu
            component={
              <MenuFileState
                dispatch={dispatch}
                jsonFilesState={jsonFilesState}
                serverState={serverState}
                setIsJsonSelectionOpen={setIsJsonSelectionOpen} />
            }
            heading="Handle json files" />
        </div>
        <Submenu
          component={
            <MenuSelectModules
              dispatch={dispatch}
              jsonObj={jsonObj}
              modules={userInput.modules}
              setAsChannelValues={setAsChannelValues} />
          }
          heading="Select visible components" />
      </div>
    </section>
  );
};