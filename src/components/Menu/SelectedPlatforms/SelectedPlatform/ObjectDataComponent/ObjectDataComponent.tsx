import React from "react";
import { Checkbox, FormControlLabel, makeStyles } from "@material-ui/core";
import StringArrayInput from "../StringArrayInput/StringArrayInput";
import SwTextField from "../../../../sharedComponents/SwTextField";
import VerifyUrlTextField from "../../../../sharedComponents/VerifyUrlTextField";
import isProxyVerifiable from "../helpFunctions/isProxyVerifiable";
import determineWebPrefix from "../helpFunctions/determineWebPrefix";
import { Platform } from "../../../../../interfaces/variousInterfaces";

interface Props {
  dataObj: object;
  handleJsonObjChange: (dataObj: object, key: string, value: any) => void
  prefixIndex?: number;
  isVerificationEnabled: boolean;
  platformSettings?: Platform;
  skipProperties?: string[];
};

const useStyles = makeStyles({
  objectDataWrapper: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center"
  }
});

export default function ObjectDataComponent(
  { dataObj, handleJsonObjChange, prefixIndex, isVerificationEnabled, platformSettings, skipProperties }: Props) {
  const classes = useStyles();
  const handleChange = (key: string, value: any) => {
    handleJsonObjChange(dataObj, key, value);
  };
  const Components = turnObjToFormComponents(dataObj, handleChange, platformSettings, skipProperties, isVerificationEnabled, prefixIndex);

  return(
    <div className={classes.objectDataWrapper}>
      <div className={classes.objectDataWrapper}>{Components.TextFieldComponents}</div>
      <div>{Components.CheckboxComponents}</div>
      <div className={classes.objectDataWrapper}>{Components.StringArrayInputComponents}</div>
    </div>
  );
};

function turnObjToFormComponents
  (obj: object, handleChange: (key: string, value: any) => void, platformSettings: Platform | undefined,
  skipProperties: string[] | undefined, isVerificationEnabled: boolean, prefixIndex: number | undefined) {
  const TextFieldComponents: JSX.Element[] = [];
  const CheckboxComponents: JSX.Element[] = [];
  const StringArrayInputComponents: JSX.Element[] = [];
  for(let [key, value] of Object.entries(obj)) {
    if(skipProperties && skipProperties.includes(key)) continue;
    if(typeof value === "string") {
      TextFieldComponents.push(
        isProxyVerifiable(platformSettings, key) ?
          <VerifyUrlTextField
            key={`textField${key}`}
            handleTextFieldChange={value => handleChange(key, value)}
            webPrefix={determineWebPrefix(platformSettings, prefixIndex)}
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
          platformSettings={platformSettings}
          prefixIndex={prefixIndex} />
      );
    }
  }
  return { TextFieldComponents, CheckboxComponents, StringArrayInputComponents };
}