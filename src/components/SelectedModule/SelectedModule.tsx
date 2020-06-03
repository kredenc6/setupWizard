import React, { useEffect } from "react";
import ObjectDataComponent from "./ObjectDataComponent/ObjectDataComponent";
import ArrayDataComponent from "./ArrayDataComponent/ArrayDataComponent";
import ArrayComponent from "./ArrayComponent/ArrayComponent";
import Submenu from "../sharedComponents/Submenu";
import capitalizeFirstLetter from "../../miscellaneous/capitalizeFirstLetter";
import { JsonObjModule, Module, ServerIs, UserInputModuleKeys } from "../../interfaces/interfaces";
import { SWActions } from "../../sWReducer/sWReducer";

interface Props {
  dispatch: React.Dispatch<SWActions>;
  jsonModuleObj: JsonObjModule;
  moduleName: UserInputModuleKeys;
  moduleSettings: Module;
  serverState: ServerIs;
};

/** Empty array is returned as false. */
const isArrObjectArr = (arr: any[]) => {
  if (typeof arr[0] === "object") return true;
  return false;
};

export default function SelectedInput({ dispatch, jsonModuleObj, moduleName, moduleSettings, serverState }: Props) {
  const handleJsonChange = (changedModule: JsonObjModule) => {
    dispatch({ type: "changeJson", payload: { [moduleName]: changedModule } });
  };
  
  const handleJsonObjChange = (dataObj: object, key: string, value: any) => handleJsonChange({ ...dataObj, [key]: value });

  // always allow next step
  useEffect(() => {
    dispatch({ type: "setIsNextStepAllowed", payload: true });
  },[dispatch]);
    
  return (
    <Submenu
      component={
        Array.isArray(jsonModuleObj) ?
          isArrObjectArr(jsonModuleObj) ?
            <ArrayDataComponent
              dataArr={jsonModuleObj}
              handleJsonChange={handleJsonChange}
              isVerificationEnabled={serverState === "online"}
              moduleSettings={moduleSettings} />
            :
            <ArrayComponent
              array={jsonModuleObj as string[]}
              handleJsonChange={handleJsonChange}
              isVerificationEnabled={serverState === "online"}
              label={moduleName}
              moduleSettings={moduleSettings} />
          :
          <ObjectDataComponent
            dataObj={jsonModuleObj}
            handleJsonObjChange={handleJsonObjChange}
            isVerificationEnabled={serverState === "online"}
            moduleSettings={moduleSettings} />
      }
      heading={capitalizeFirstLetter(moduleName)} />
  );
};