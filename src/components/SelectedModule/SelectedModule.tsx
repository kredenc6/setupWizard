import React, { useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import MenuHeading from "../sharedComponents/MenuHeading";
import ObjectDataComponent from "./ObjectDataComponent/ObjectDataComponent";
import ArrayDataComponent from "./ArrayDataComponent/ArrayDataComponent";
import ArrayComponent from "./ArrayComponent/ArrayComponent";
import AppTopicParagraph from "../sharedComponents/AppTopicParagraph";
import ServerStatus from "../sharedComponents/ServerStatus";
import VerificationStatus from "../sharedComponents/VerificationStatus";
import { JsonObjModule, Module } from "../../interfaces/interfaces";

interface Props {
  appTopic: string;
  handleJsonChange: (changedModule: JsonObjModule) => void;
  jsonModuleObj: JsonObjModule;
  moduleName: string;
  moduleSettings: Module;
  serverStatus: string;
  setIsNextStepAllowed: React.Dispatch<React.SetStateAction<boolean>>;
};

const styles = {
  menuTopic: {
    minWidth: "70%",
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
  ({ appTopic, handleJsonChange, jsonModuleObj, moduleName, moduleSettings, serverStatus, setIsNextStepAllowed }: Props) => {

  const classes = useStyles();
  const handleJsonObjChange = (dataObj: object, key: string, value: any) => handleJsonChange({ ...dataObj, [key]: value });

  // always allow next step
  useEffect(() => {
    setIsNextStepAllowed(true);
  });
    
  return (
    <section className={classes.menuTopic}>
      <MenuHeading text={moduleName} />
      <ServerStatus serverStatus={serverStatus} />
      <VerificationStatus status={serverStatus === "online" ? "enabled" : "disabled"} />
      <AppTopicParagraph topic={appTopic} />
      {Array.isArray(jsonModuleObj) ?
        isArrObjectArr(jsonModuleObj) ?
          <ArrayDataComponent
            dataArr={jsonModuleObj}
            handleJsonChange={handleJsonChange}
            isVerificationEnabled={serverStatus === "online"}
            moduleSettings={moduleSettings} />
          :
          <ArrayComponent
            array={jsonModuleObj as string[]}
            handleJsonChange={handleJsonChange}
            isVerificationEnabled={serverStatus === "online"}
            label={moduleName}
            moduleSettings={moduleSettings} />
        :
        <ObjectDataComponent
          dataObj={jsonModuleObj}
          handleJsonObjChange={handleJsonObjChange}
          isVerificationEnabled={serverStatus === "online"}
          moduleSettings={moduleSettings} />
      }
    </section>
  );
};

export default SelectedInput;