import React from "react";
import { Paper } from "@material-ui/core";
import { makeStyles, Theme } from "@material-ui/core/styles";
import ObjectDataComponent from "../../SelectedModule/ObjectDataComponent/ObjectDataComponent";
import PropertyHeading from "./PropertyHeading";
import { JsonObjKey, JsonResultObj } from "../../../interfaces/interfaces";

interface Props {
  handleJsonChange: (key: JsonObjKey, changedModule: JsonResultObj[JsonObjKey]) => void;
  restJson: [string, any][];
};

const styles = (theme: Theme) => ({
  paperItem: {
    marginRight: theme.spacing(1),
    marginBottom: theme.spacing(1),
    padding: theme.spacing(2)
  }
});
const useStyles = makeStyles(theme => styles(theme));

const RestJsonPropsComponent = ({ handleJsonChange, restJson }: Props) => {
  const classes = useStyles();
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
          )} />
      </Paper>
    );
  });

  return(
    <div>
      <Paper className={classes.paperItem} variant="outlined">
        <PropertyHeading text="various" />
        <ObjectDataComponent dataObj={stringAndBooleanObj} handleJsonObjChange={handleGroupedPropsChange} />
      </Paper>
      <div>
        {ObjectDataComponents}
      </div>
    </div>
  );
};

export default RestJsonPropsComponent;