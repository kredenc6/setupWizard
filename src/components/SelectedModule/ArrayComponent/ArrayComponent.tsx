import React from "react";
import StringArrayInput from "../StringArrayInput/StringArrayInput";
import { JsonObjModule, Module } from "../../../interfaces/interfaces";

interface Props {
  array: string[];
  handleJsonChange: (changedModule: JsonObjModule) => void;
  label: string;
  moduleSettings: Module | undefined;
};

const ArrayComponent = ({ array, handleJsonChange, label, moduleSettings }: Props) => {
  const handleChange = (_: string, newArray: string[] | number[]) => {
    handleJsonChange(newArray);
  };

  return(
    <div>
      <StringArrayInput
        arr={array}
        handleChange={handleChange}
        label={label}
        moduleSettings={moduleSettings} />
    </div>
  );
};

export default ArrayComponent;