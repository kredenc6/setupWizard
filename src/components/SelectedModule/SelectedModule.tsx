import React, { useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import MenuHeading from "../sharedComponents/MenuHeading";
import { JsonObjModule } from "../../interfaces/interfaces";

import ObjectDataComponent from "./ObjectDataComponent/ObjectDataComponent";
import ArrayDataComponent from "./ArrayDataComponent/ArrayDataComponent";
import ArrayComponent from "./ArrayComponent/ArrayComponent";

interface Props {
  appTopic: string;
  handleJsonChange: (changedModule: JsonObjModule) => void;
  jsonModuleObj: JsonObjModule;
  moduleName: string;
  setIsNextStepAllowed: React.Dispatch<React.SetStateAction<boolean>>;
};

const styles = {
  menuTopic: {
    "text-align": "center"
  }
};
const useStyles = makeStyles(styles);

/** Empty array is returned as false. */
const isArrObjectArr = (arr: any[]) => {
  if (typeof arr[0] === "object") return true;
  return false;
};

const SelectedInput = 
  ({ appTopic, handleJsonChange, jsonModuleObj, moduleName, setIsNextStepAllowed }: Props) => {

  const classes = useStyles();
  const handleJsonObjChange = (dataObj: object, key: string, value: any) => handleJsonChange({ ...dataObj, [key]: value });

  useEffect(() => {
    setIsNextStepAllowed(true);
  },[setIsNextStepAllowed]);
    
  return (
    <section className={classes.menuTopic}>
      <MenuHeading text={moduleName} />
      <p>App topic: {appTopic}</p>
      {Array.isArray(jsonModuleObj) ?
        isArrObjectArr(jsonModuleObj) ?
          <ArrayDataComponent dataArr={jsonModuleObj} handleJsonChange={handleJsonChange} />
          :
          <ArrayComponent array={jsonModuleObj as string[]} handleJsonChange={handleJsonChange} label={moduleName} />
        :
        <ObjectDataComponent dataObj={jsonModuleObj} handleJsonObjChange={handleJsonObjChange} />
      }
    </section>
  );
};

export default SelectedInput;