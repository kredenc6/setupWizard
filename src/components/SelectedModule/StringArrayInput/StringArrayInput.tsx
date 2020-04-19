import React, { useState } from "react";
import { TextField } from "@material-ui/core";

// *
// TextFileds loose focus on change(don't know why). arrColumnPosition state allows to keep track of which TextField is
// updated, and with use of autoFocus prop re-focuded.

interface Props {
  arr: string[];
  handleChange: (key: string, value: any) => void;
  label: string;
};

const StringArrayInput = ({ arr, handleChange, label }: Props) => {
  const [arrColumnPosition, setArrColumnPosition] = useState(-1); // *
  
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
    }
  };

  const addToJsonArr = (i: number, newValue: string) => {
    if(String(newValue).length > 0) {
      const newArr = arr.map(value => value);
      newArr.push(newValue);
      handleChange(label, newArr);
      setArrColumnPosition(i);
    }
  };

  const StringArrayInputComponents = (arr: string[]) => {
    const TextFields = arr.map((value, i) => {
      return(
        <TextField
          autoFocus={i === arrColumnPosition}
          color="secondary"
          key={`${i}${value}${i}`}
          label={label}
          onChange={e => handleTextFieldChange(i, e.target.value)}
          onBlur={e => handleTextFieldBlur(i, e.target.value)}
          value={value}
          variant="outlined" />
      );
    });
    TextFields.push(
      <TextField
        value=""
        color="secondary"
        key="nextInput"
        label={`new ${label}`}
        onChange={e => addToJsonArr(arr.length, e.target.value)}
        variant="outlined" />
    );
    return TextFields;
  };

  return(
    <div>
      {StringArrayInputComponents(arr)}
    </div>
  );
};

export default StringArrayInput;