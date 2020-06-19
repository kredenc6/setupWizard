import React from "react";
import StringArrayInput from "../StringArrayInput/StringArrayInput";
import { makeStyles } from "@material-ui/core/styles";
import { Platform } from "../../../../../interfaces/variousInterfaces";
import { JsonObjPlatform, JsonResultObj } from "../../../../../interfaces/jsonInterfaces";

interface Props {
  array: string[];
  handleJsonChange: (changedPlatform: JsonObjPlatform) => void;
  isVerificationEnabled: boolean;
  label: keyof JsonResultObj;
  platformSettings: Platform | undefined;
};

const useStyles = makeStyles({
  arrayWrapper: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center"
  }
});

export default function ArrayComponent ({ array, handleJsonChange, isVerificationEnabled, label, platformSettings }: Props) {
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
        platformSettings={platformSettings} />
    </div>
  );
};
