import React from "react";
import StringArrayInput from "../StringArrayInput/StringArrayInput";
import { JsonObjModule, Module } from "../../../interfaces/interfaces";

interface Props {
  array: string[];
  handleJsonChange: (changedModule: JsonObjModule) => void;
  isVerificationEnabled: boolean;
  label: string;
  moduleSettings: Module | undefined;
};

const ArrayComponent = ({ array, handleJsonChange, isVerificationEnabled, label, moduleSettings }: Props) => {
  const handleChange = (_: string, newArray: string[] | number[]) => {
    handleJsonChange(newArray);
  };

  return(
    <div>
      <StringArrayInput
        arr={array}
        handleChange={handleChange}
        isVerificationEnabled={isVerificationEnabled}
        label={label}
        moduleSettings={moduleSettings} />
    </div>
  );
};

export default ArrayComponent;