import React, { useState } from "react";
import SwTextField from "../../../../sharedComponents/SwTextField";
import VerifyUrlTextField from "../../../../sharedComponents/VerifyUrlTextField";
import isProxyVerifiable from "../helpFunctions/isProxyVerifiable";
import determineWebPrefix from "../helpFunctions/determineWebPrefix";
import { Platform } from "../../../../../interfaces/variousInterfaces";

interface Props {
  arr: string[];
  handleChange: (key: string, value: any) => void;
  isVerificationEnabled: boolean;
  label: string;
  platformSettings: Platform | undefined;
  prefixIndex?: number;
};

export default function StringArrayInput({ arr, handleChange, isVerificationEnabled, label, platformSettings, prefixIndex }: Props) {
  const isVerifiableArr = isProxyVerifiable(platformSettings, label);
  const [componentKeys, setComponentsKeys] = useState<string[]>(createComponentKeys([], arr)); // this component needs a way...
  // to hold unique component keys during rerenders(prevents mixing validation results when using index number as a key)
  const [arrColumnPosition, setArrColumnPosition] = useState(-1); // arrColumnPosition state allows to keep track of which...
  // ...TextField is updated, and with use of autoFocus prop re-focuded.
  
  const handleTextFieldChange = (i: number, newValue: string) => {
    const newArr = arr.map((oldValue, arrIndex) => {
      if(i === arrIndex) return newValue;
      return oldValue;
    });
    setArrColumnPosition(i);
    handleChange(label, newArr);
  };

  const handleTextFieldBlur = (i: number, newValue: string) => {
    if(String(newValue).length === 0) {
      const newArr = arr.filter((_, newArrIndex) => i !== newArrIndex);
      handleChange(label, newArr);
      setComponentsKeys(oldArr => {
        oldArr.splice(i, 1);
        return oldArr;
      });
    }
  };

  const addToJsonArr = (i: number, newValue: string) => {
    if(String(newValue).length > 0) {
      const newArr = arr.map(value => value);
      newArr.push(newValue);
      setComponentsKeys(oldArr => createComponentKeys(oldArr, newArr));
      handleChange(label, newArr);
      setArrColumnPosition(i);
    }
  };

  const StringArrayInputComponents = arr.map((value, i) => {
    return(
      isVerifiableArr ?
        <VerifyUrlTextField
          autoFocus={i === arrColumnPosition}
          color="secondary"
          key={componentKeys[i]}
          label={label}
          handleTextFieldChange={value => handleTextFieldChange(i, value)}
          webPrefix={determineWebPrefix(platformSettings, prefixIndex)}
          isVerificationEnabled={isVerificationEnabled}
          onBlur={e => handleTextFieldBlur(i, e.target.value)}
          value={value} />
      :
        <SwTextField
          autoFocus={i === arrColumnPosition}
          inputAdornment={determineWebPrefix(platformSettings, prefixIndex)}
          color="secondary"
          key={`${i}${label}`}
          label={label}
          onChange={e => handleTextFieldChange(i, e.target.value)}
          onBlur={e => handleTextFieldBlur(i, e.target.value)}
          value={value} />
    );
  })
  .concat( isVerifiableArr ?
    <VerifyUrlTextField
      color="secondary"
      handleTextFieldChange={value => addToJsonArr(arr.length, value)}
      isNextInput={true}
      isVerificationEnabled={isVerificationEnabled}
      webPrefix={determineWebPrefix(platformSettings, prefixIndex)}
      key="nextInput"
      label={label}
      value="" />
  :
    <SwTextField
      color="secondary"
      inputAdornment={determineWebPrefix(platformSettings, prefixIndex)}
      key="nextInput"
      label={label}
      onChange={e => addToJsonArr(arr.length, e.target.value)}
      value="" />
    );

  return(
    <>
      {StringArrayInputComponents}
    </>
  );
};

/** returns: [...keyArr + new keys if valueArr.length > keyArr.length] */
function createComponentKeys(keyArr: string[], valueArr: any[]) {
  return valueArr.map((_, i) => {
    return i >= keyArr.length ? String(Math.random()) : keyArr[i];
  });
}