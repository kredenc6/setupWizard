import React, { useContext } from "react";
import { Checkbox, FormControlLabel } from "@material-ui/core";
import StringArrayInput from "../StringArrayInput/StringArrayInput";
import SwTextField from "../../sharedComponents/SwTextField";
import VerifyUrlTextField from "../../sharedComponents/VerifyUrlTextField";
import isProxyVerifiable from "../helpFunctions/isProxyVerifiable";
import determineWebPrefix from "../helpFunctions/determineWebPrefix";
import { Module } from "../../../interfaces/interfaces";

interface Props {
  dataObj: object;
  handleJsonObjChange: (dataObj: object, key: string, value: any) => void
  prefixIndex?: number;
  isVerificationEnabled: boolean;
  moduleSettings?: Module;
  skipProperties?: string[];
};

const ObjectDataComponent = (
  { dataObj, handleJsonObjChange, prefixIndex, isVerificationEnabled, moduleSettings, skipProperties }: Props) => {
  // const handleChange = (key: string, value: any) => {
  //   dispatch({ type: "jsonChange", payload: { [key as JsonObjKey]: value } });
  // };
  //TODO clean up if it works
  const handleChange = (key: string, value: any) => {
    handleJsonObjChange(dataObj, key, value);
  };
  const Components = turnObjToFormComponents(dataObj, handleChange, moduleSettings, skipProperties, isVerificationEnabled, prefixIndex);

  return(
    <div>
      <div>{Components.TextFieldComponents}</div>
      <div>{Components.CheckboxComponents}</div>
      <div>{Components.StringArrayInputComponents}</div>
    </div>
  );
};

export default ObjectDataComponent;

function turnObjToFormComponents
  (obj: object, handleChange: (key: string, value: any) => void, moduleSettings: Module | undefined,
  skipProperties: string[] | undefined, isVerificationEnabled: boolean, prefixIndex: number | undefined) {
  const TextFieldComponents: JSX.Element[] = [];
  const CheckboxComponents: JSX.Element[] = [];
  const StringArrayInputComponents: JSX.Element[] = [];
  for(let [key, value] of Object.entries(obj)) {
    if(skipProperties && skipProperties.includes(key)) continue;
    if(typeof value === "string") {
      TextFieldComponents.push(
        isProxyVerifiable(moduleSettings, key) ?
          <VerifyUrlTextField
            key={`textField${key}`}
            handleTextFieldChange={value => handleChange(key, value)}
            webPrefix={determineWebPrefix(moduleSettings, prefixIndex)}
            isVerificationEnabled={isVerificationEnabled}
            label={key}
            name={key}
            value={value} />
        :
          <SwTextField
            key={`textField${key}`}
            onChange={e => handleChange(key, e.target.value)}
            label={key}
            name={key}
            value={value} />);
    }
    if(typeof value === "boolean") {
      CheckboxComponents.push(
        <FormControlLabel
          control={
            <Checkbox
              checked={value}
              key={`checkbox${key}`}
              name={key}
              onChange={(e) => handleChange(key, e.target.checked)}
            />
          }
          key={key}
          label={key}
        />
      );
    };
    if(Array.isArray(value)) {
      StringArrayInputComponents.push(
        <StringArrayInput
          arr={value}
          handleChange={handleChange}
          isVerificationEnabled={isVerificationEnabled}
          key={`strArr${key}`}
          label={key}
          moduleSettings={moduleSettings}
          prefixIndex={prefixIndex} />
      );
    }
  }
    return { TextFieldComponents, CheckboxComponents, StringArrayInputComponents };
}