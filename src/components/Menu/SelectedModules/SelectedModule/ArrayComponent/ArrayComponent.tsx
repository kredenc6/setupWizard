import React from "react";
import StringArrayInput from "../StringArrayInput/StringArrayInput";
import { makeStyles } from "@material-ui/core/styles";
import { Module } from "../../../../../interfaces/variousInterfaces";
import { JsonObjModule, JsonResultObj } from "../../../../../interfaces/jsonInterfaces";

interface Props {
  array: string[];
  handleJsonChange: (changedModule: JsonObjModule) => void;
  isVerificationEnabled: boolean;
  label: keyof JsonResultObj;
  moduleSettings: Module | undefined;
};

const useStyles = makeStyles({
  arrayWrapper: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center"
  }
});

export default function ArrayComponent ({ array, handleJsonChange, isVerificationEnabled, label, moduleSettings }: Props) {
  const classes = useStyles();
  const handleChange = (_: string, newArray: string[] | number[]) => {
    handleJsonChange(newArray);
  };

  return(
    <div className={classes.arrayWrapper}>
      <StringArrayInput
        arr={array}
        handleChange={handleChange}
        isVerificationEnabled={isVerificationEnabled}
        label={label}
        moduleSettings={moduleSettings} />
    </div>
  );
};
