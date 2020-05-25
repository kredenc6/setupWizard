import React, { useContext } from "react";
import { Paper } from "@material-ui/core";
import { createStyles, makeStyles } from "@material-ui/core/styles";
import ObjectDataComponent from "../../SelectedModule/ObjectDataComponent/ObjectDataComponent";
import PropertyHeading from "./PropertyHeading";
import { DispatchContext } from "../../../SetupWizard";
import { JsonObjKey, JsonResultObj } from "../../../interfaces/interfaces";

interface Props {
  handleJsonChange: (key: JsonObjKey, changedModule: JsonResultObj[JsonObjKey]) => void;
  isVerificationEnabled: boolean;
  restJson: [string, any][];
};

const useStyles = makeStyles(theme => 
  createStyles({
    paperItem: {
      marginRight: theme.spacing(1),
      marginBottom: theme.spacing(1),
      padding: theme.spacing(2)
    }
  })
);

export default function RestJsonPropsComponent ({ handleJsonChange, isVerificationEnabled, restJson }: Props) {
  const dispatch = useContext(DispatchContext);
  const classes = useStyles();
  //TODO clean up if it works
  // const handleGroupedPropsChange = (_: object, key: string, value: any) => {
  //   dispatch({ type: "jsonChange", payload: { [key as JsonObjKey]: value } });
  // };
  const handleGroupedPropsChange = (_: object, key: string, value: any) => {
    handleJsonChange(key as JsonObjKey, value);
  };

  const stringAndBooleanObj: {[propName: string]: string | boolean} = {};
  const objectArray:  [string, any][] = [];
  restJson.forEach(([key, value]) => {
    if(typeof value === "string" || typeof value === "boolean") {
      stringAndBooleanObj[key] = value;
    }
    else objectArray.push([key, value]);
  });

  const ObjectDataComponents = objectArray.map(([key, value], i) => {
    return(
      <Paper className={classes.paperItem} key={`${key}${i}`} variant="outlined">
        <PropertyHeading text={key} />
        <ObjectDataComponent
          dataObj={value}
          handleJsonObjChange={(dataObj: object, keyToValue: string, value: any) => handleJsonChange(
            key as JsonObjKey,
            { ...dataObj, [keyToValue]: value }
          )}
          isVerificationEnabled={isVerificationEnabled} />
      </Paper>
    );
  });

  return(
    <div>
      <Paper className={classes.paperItem} variant="outlined">
        <PropertyHeading text="various" />
        <ObjectDataComponent
          dataObj={stringAndBooleanObj}
          handleJsonObjChange={handleGroupedPropsChange}
          isVerificationEnabled={isVerificationEnabled} />
      </Paper>
      <div>
        {ObjectDataComponents}
      </div>
    </div>
  );
};