import React from "react";
import StringArrayInput from "../StringArrayInput/StringArrayInput";
import { JsonObjModule } from "../../../interfaces/interfaces";

interface Props {
  array: string[];
  handleJsonChange: (changedModule: JsonObjModule) => void;
  label: string;
};

const ArrayComponent = ({ array, handleJsonChange, label}: Props) => {
  const handleChange = (_: string, newArray: string[] | number[]) => {
    handleJsonChange(newArray);
  };

  return(
    <div>
      <StringArrayInput
        arr={array}
        handleChange={handleChange}
        label={label} />
    </div>
  );
};

export default ArrayComponent;