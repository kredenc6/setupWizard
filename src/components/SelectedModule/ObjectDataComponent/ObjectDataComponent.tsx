import React from "react";
import { Checkbox, FormControlLabel, TextField } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import StringArrayInput from "../StringArrayInput/StringArrayInput";

interface Props {
  dataObj: object;
  handleJsonObjChange: (dataObj: object, key: string, value: any) => void
  skipProperties?: string[];
};

const StyledTextField = withStyles(({ spacing }) => ({
  root: {
    marginTop: spacing(2)
  }
}))(TextField);

const ObjectDataComponent = ({ dataObj, handleJsonObjChange, skipProperties }: Props) => {
  const handleChange = (key: string, value: any) => {
    handleJsonObjChange(dataObj, key, value);
  };
  const Components = turnObjToFormComponents(dataObj, handleChange, skipProperties);


  return(
    <div>
      <div>
        {Components.TextFieldComponents}
      </div>
      <div>
        {Components.CheckboxComponents}
      </div>
      <div>
        {Components.StringArrayInputComponents}
      </div>
    </div>
  );
};

export default ObjectDataComponent;

function turnObjToFormComponents(obj: object, handleChange: (key: string, value: any) => void, skipProperties: string[] | undefined) {
  const TextFieldComponents: JSX.Element[] = [];
  const CheckboxComponents: JSX.Element[] = [];
  const StringArrayInputComponents: JSX.Element[] = [];
  for(let [key, value] of Object.entries(obj)) {
    if(skipProperties && skipProperties.includes(key)) continue;
    if(typeof value === "string") {
      TextFieldComponents.push(
        <StyledTextField
          variant="outlined"
          key={`textField${key}`}
          onChange={(e) => handleChange(key, e.target.value)}
          label={key}
          name={key}
          value={value} />);
    }
    if(typeof value === "boolean") {
      CheckboxComponents.push(
        <FormControlLabel
          control={
            <Checkbox
              checked={value}
              key={`checkbox${key}`}
              name={key}
              onChange={(e) => handleChange(key, e.target.checked)}
            />
          }
          key={key}
          label={key}
        />
      );
    };
    if(Array.isArray(value)) {
      StringArrayInputComponents.push(
        <StringArrayInput arr={value} key={`strArr${key}`} label={key} />
      );
    }
  }
    return { TextFieldComponents, CheckboxComponents, StringArrayInputComponents };
}