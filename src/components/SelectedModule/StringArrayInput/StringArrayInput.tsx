import React from "react";
import { TextField } from "@material-ui/core";

interface Props {
  arr: string[];
  label: string;
};

const StringArrayInput = ({ arr, label }: Props) => {
  const StringArrayInputComponents = (arr: string[]) => {
    const TextFields = arr.map(value => {
      return <TextField color="secondary" key={value} label={label} value={value} variant="outlined" />
    });
    TextFields.push( <TextField color="secondary" key="nextInput" label={label} variant="outlined" /> );
    return TextFields;
  };
  
  return(
    <div>
      {StringArrayInputComponents(arr)}
    </div>
  );
};

export default StringArrayInput;