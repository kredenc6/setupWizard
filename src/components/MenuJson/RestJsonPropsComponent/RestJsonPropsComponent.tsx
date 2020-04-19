import React, { Fragment } from "react";
import ObjectDataComponent from "../../SelectedModule/ObjectDataComponent/ObjectDataComponent";
import { JsonObjKey, JsonResultObj } from "../../../interfaces/interfaces";

interface Props {
  handleJsonChange: (key: JsonObjKey, changedModule: JsonResultObj[JsonObjKey]) => void;
  restJson: [string, any][];
};

const RestJsonPropsComponent = ({ handleJsonChange, restJson }: Props) => {
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
      <Fragment key={`${key}${i}`}>
        <p>{key}</p>
        <ObjectDataComponent
          dataObj={value}
          handleJsonObjChange={(dataObj: object, keyToValue: string, value: any) => handleJsonChange(
            key as JsonObjKey,
            { ...dataObj, [keyToValue]: value }
          )} />
      </Fragment>
    );
  });

  return(
    <div>
      <ObjectDataComponent dataObj={stringAndBooleanObj} handleJsonObjChange={handleGroupedPropsChange} />
      <div>
        {ObjectDataComponents}
      </div>
    </div>
  );
};

export default RestJsonPropsComponent;