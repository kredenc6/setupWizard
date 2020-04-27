import React, { useState } from "react";
import SwTextField from "../../sharedComponents/SwTextField";
import VerifyUrlTextField from "../../sharedComponents/VerifyUrlTextField";
import isProxyVerifiable from "../helpFunctions/isProxyVerifiable";
import { Module } from "../../../interfaces/interfaces";

interface Props {
  arr: string[];
  handleChange: (key: string, value: any) => void;
  isVerificationEnabled: boolean;
  label: string;
  moduleSettings: Module | undefined;
};
export type Verification = null | "OK" | "KO";

const StringArrayInput = ({ arr, handleChange, isVerificationEnabled, label, moduleSettings }: Props) => {
  const isVerifiableArr = isProxyVerifiable(moduleSettings, label);
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
          webPrefix={moduleSettings?.WEB_PREFIX}
          isVerificationEnabled={isVerificationEnabled}
          onBlur={e => handleTextFieldBlur(i, e.target.value)}
          value={value} />
      :
        <SwTextField
          autoFocus={i === arrColumnPosition}
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
      isVerificationEnabled={isVerificationEnabled}
      webPrefix={moduleSettings?.WEB_PREFIX}
      key="nextInput"
      label={label}
      value="" />
  :
    <SwTextField
      color="secondary"
      key="nextInput"
      label={label}
      onChange={e => addToJsonArr(arr.length, e.target.value)}
      value="" />
    );

  return(
    <div>
      {StringArrayInputComponents}
    </div>
  );
};

export default StringArrayInput;

/** returns: [...keyArr + new keys if valueArr.length > keyArr.length] */
function createComponentKeys(keyArr: string[], valueArr: any[]) {
  return valueArr.map((_, i) => {
    return i >= keyArr.length ? String(Math.random()) : keyArr[i];
  });
}