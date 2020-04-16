import React, { useEffect } from "react";
import { InputAdornment } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import MenuHeading from "../sharedComponents/MenuHeading";
import SwTextField from "../sharedComponents/SwTextField";
import { JSONResultObj, Module } from "../../interfaces/interfaces";

import Medium from "./Medium/Medium";

interface Props {
  appTopic: string;
  handleSelectedModuleChange: (changedModule: Module) => void;
  jsonObj: JSONResultObj;
  module: Module;
  moduleName: string;
  setIsNextStepAllowed: React.Dispatch<React.SetStateAction<boolean>>;
  setJsonObj: React.Dispatch<React.SetStateAction<JSONResultObj>>;
};

const styles = {
  menuTopic: {
    "text-align": "center"
  }
};
const useStyles = makeStyles(styles);

const SelectedInput = 
  ({ appTopic, handleSelectedModuleChange, jsonObj, module, moduleName, setIsNextStepAllowed, setJsonObj }: Props) => {
  const {
    webPrefix,
    webPage
  } = module;

  const classes = useStyles();
  
  // set webPage value(to appTopic) if it's undefined
  useEffect(() => {
    if(webPage !== undefined) return;
    handleSelectedModuleChange({...module, webPage: appTopic });
  },[appTopic, handleSelectedModuleChange, module, webPage]);

  useEffect(() => {
    const isValueValid = webPage ? webPage.trim().length >= 2 : false;
    setIsNextStepAllowed(isValueValid);
  },[setIsNextStepAllowed, webPage]);

  return (
    <section className={classes.menuTopic}>
      <MenuHeading text={moduleName}/>
      <SwTextField
        autoFocus
        InputProps={{
          startAdornment: <InputAdornment position="start">{webPrefix || "placeholder"}</InputAdornment> // TODO remove placeholder
        }}
        onChange={(e) => handleSelectedModuleChange({...module, webPage: e.target.value })}
        placeholder="Add the facebook page here (min. 2 characters)"
        required
        value={webPage}
      />
      {(moduleName === "audio" || moduleName === "books" || moduleName === "videos") &&
        <Medium appTopic={appTopic} jsonObj={jsonObj} medium={moduleName} setJsonObj={setJsonObj}/>
      }
    </section>
  );
};

export default SelectedInput;
