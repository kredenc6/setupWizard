import React from "react";
import { createStyles, makeStyles } from "@material-ui/core/styles";
import SimpleBar from "simplebar-react";
import ObjectDataComponent from "../../SelectedModule/ObjectDataComponent/ObjectDataComponent";
import Submenu from "../../sharedComponents/Submenu";
import { JsonObjKey, JsonResultObj } from "../../../interfaces/interfaces";
import { SWActions } from "../../../sWReducer/sWReducer";
import "simplebar/dist/simplebar.min.css";

interface Props {
  dispatch: React.Dispatch<SWActions>;
  isVerificationEnabled: boolean;
  restJson: [string, any][];
};

const useStyles = makeStyles(({ spacing }) => 
  createStyles({
    restJsonPropsWrapper: {
      flexGrow: 2,
      maxHeight: "100%"
    },
    paperItem: {
      marginRight: spacing(1),
      marginBottom: spacing(1),
      padding: spacing(2)
    }
  })
);

export default function RestJsonPropsComponent ({ dispatch, isVerificationEnabled, restJson }: Props) {
  const classes = useStyles();

  const handleJsonChange = (key: JsonObjKey, changedModule: JsonResultObj[JsonObjKey]) => {
    dispatch({ type: "changeJson", payload: { [key]: changedModule } });
  };

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
      <Submenu
        component={
          <ObjectDataComponent
            dataObj={value}
            handleJsonObjChange={(dataObj: object, keyToValue: string, value: any) => handleJsonChange(
              key as JsonObjKey,
              { ...dataObj, [keyToValue]: value }
            )}
            isVerificationEnabled={isVerificationEnabled} />
        }
        className={classes.paperItem}
        heading={key}
        key={`${key}${i}`} />
    );
  });

  return(
    <SimpleBar className={classes.restJsonPropsWrapper}>
      <Submenu
        component={
          <ObjectDataComponent
            dataObj={stringAndBooleanObj}
            handleJsonObjChange={handleGroupedPropsChange}
            isVerificationEnabled={isVerificationEnabled} />
        }
        className={classes.paperItem}
        heading="various" />

      {ObjectDataComponents}
    </SimpleBar>
  );
};