import React, { useEffect } from "react";
import ObjectDataComponent from "./ObjectDataComponent/ObjectDataComponent";
import ArrayDataComponent from "./ArrayDataComponent/ArrayDataComponent";
import ArrayComponent from "./ArrayComponent/ArrayComponent";
import Submenu from "../../../sharedComponents/Submenu";
import capitalizeFirstLetter from "../../../../miscellaneous/capitalizeFirstLetter";
import { Platform, ServerIs, UserInputPlatformKeys } from "../../../../interfaces/variousInterfaces";
import { JsonObjPlatform } from "../../../../interfaces/jsonInterfaces";
import { SWActions } from "../../../../sWReducer/sWReducer";

interface Props {
  dispatch: React.Dispatch<SWActions>;
  jsonPlatformObj: JsonObjPlatform;
  platformName: UserInputPlatformKeys;
  platformSettings: Platform;
  serverState: ServerIs;
};

/** Empty array is returned as false. */
const isArrObjectArr = (arr: any[]) => {
  if (typeof arr[0] === "object") return true;
  return false;
};

const SelectedInput = React.memo(({ dispatch, jsonPlatformObj, platformName, platformSettings, serverState }: Props) => {
  const handleJsonChange = (changedPlatform: JsonObjPlatform) => {
    dispatch({ type: "changeJson", payload: { [platformName]: changedPlatform } });
  };
  
  const handleJsonObjChange = (dataObj: object, key: string, value: any) => handleJsonChange({ ...dataObj, [key]: value });

  // always allow next step
  useEffect(() => {
    dispatch({ type: "setIsNextStepAllowed", payload: true });
  },[dispatch]);

  return (
    <Submenu
      component={
        Array.isArray(jsonPlatformObj) ?
          isArrObjectArr(jsonPlatformObj) ?
            <ArrayDataComponent
              dataArr={jsonPlatformObj}
              handleJsonChange={handleJsonChange}
              isVerificationEnabled={serverState === "online"}
              platformSettings={platformSettings} />
            :
            <ArrayComponent
              array={jsonPlatformObj as string[]}
              handleJsonChange={handleJsonChange}
              isVerificationEnabled={serverState === "online"}
              label={platformName}
              platformSettings={platformSettings} />
          :
          <ObjectDataComponent
            dataObj={jsonPlatformObj}
            handleJsonObjChange={handleJsonObjChange}
            isVerificationEnabled={serverState === "online"}
            platformSettings={platformSettings} />
      }
      heading={capitalizeFirstLetter(platformName)} />
  );
});

export default SelectedInput;