import React, { useEffect } from "react";
import { InputAdornment } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import MenuHeading from "../sharedComponents/MenuHeading";
import SwTextField from "../sharedComponents/SwTextField";
import { JsonObjModule, JsonResultObj, Module } from "../../interfaces/interfaces";

import Medium from "./Medium/Medium";
import ObjectDataComponent from "./ObjectDataComponent/ObjectDataComponent";
import ArrayDataComponent from "./ArrayDataComponent/ArrayDataComponent";

interface Props {
  appTopic: string;
  handleSelectedModuleChange: (changedModule: Module) => void;
  handleJsonChange: (changedModule: JsonObjModule) => void;
  jsonModuleObj: JsonObjModule;
  module: Module;
  moduleName: string;
  setIsNextStepAllowed: React.Dispatch<React.SetStateAction<boolean>>;
};

const styles = {
  menuTopic: {
    "text-align": "center"
  }
};
const useStyles = makeStyles(styles);

const SelectedInput = 
  ({ appTopic, handleSelectedModuleChange, handleJsonChange, jsonModuleObj, module, moduleName, setIsNextStepAllowed }: Props) => {
  const {
    webPrefix,
    webPage
  } = module;

  const classes = useStyles();
  const handleJsonObjChange = (dataObj: object, key: string, value: any) => handleJsonChange({ ...dataObj, [key]: value });
    
  // set webPage value(to appTopic) if it's undefined
  useEffect(() => {
    if(webPage !== undefined) return;
    handleSelectedModuleChange({ ...module, webPage: appTopic });
  },[appTopic, handleSelectedModuleChange, module, webPage]);

  useEffect(() => {
    const isValueValid = webPage ? webPage.trim().length >= 2 : false;
    setIsNextStepAllowed(isValueValid);
  },[setIsNextStepAllowed, webPage]);

  return (
    <section className={classes.menuTopic}>
      <MenuHeading text={moduleName} />
      {Array.isArray(jsonModuleObj) ? 
        <ArrayDataComponent dataArr={jsonModuleObj} handleJsonChange={handleJsonChange} />
        :
        <ObjectDataComponent dataObj={jsonModuleObj} handleJsonObjChange={handleJsonObjChange} />
      }
    </section>
  );
};

export default SelectedInput;


// {webPrefix ? 
//   <SwTextField
//     autoFocus
//     InputProps={{
//       startAdornment: <InputAdornment position="start">{webPrefix}</InputAdornment>
//     }}
//     onChange={(e) => handleSelectedModuleChange({...module, webPage: e.target.value })}
//     placeholder="Add the facebook page here (min. 2 characters)"
//     required
//     value={webPage}
//   />
// :
// null}
// {(moduleName === "audio" || moduleName === "books" || moduleName === "videos") &&
//   <Medium appTopic={appTopic} jsonObj={jsonObj} medium={moduleName} setJsonObj={setJsonObj}/>
// }