import React from "react";
import { Checkbox, FormControlLabel, FormGroup } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import sortObjEntriesAlphabetically from "../../miscellaneous/sortObjEntriesAlphabetically";
import { fillInTopicValue } from "../../sWReducer/sWReducer";
import { Module, JsonResultObj, UserInput, UserInputModuleKeys } from "../../interfaces/interfaces";
import { SWActions } from "../../sWReducer/sWReducer";

interface Props {
  dispatch: React.Dispatch<SWActions>;
  jsonObj: JsonResultObj;
  modules: UserInput["modules"];
  setAsChannelValues: boolean
};

const useStyles = makeStyles({
  formWrapper: {
    display: "flex"
  },
  leftPlaceholder: {
    width: "42%"
  }
});

const MenuSelectModules = ({ dispatch, jsonObj, modules, setAsChannelValues }: Props) => {
  const classes = useStyles();
  const handleChange = (checked: boolean, moduleName: string, module: Module) => {
    const updatedModules = { ...modules, [moduleName]: { ...module, selected: checked } };
    dispatch({ type: "changeUserInput", payload: { modules: updatedModules } });
    
    const visible_components = Object.entries(updatedModules)
    .filter(([_, module]) => module.selected)
    .map(([key, _]) => key) as UserInputModuleKeys[];
    
    let payload = { visible_components };
    if(setAsChannelValues){
      const adjustedJsonObj = { ...jsonObj, visible_components }
      const filledInModules = fillInTopicValue(adjustedJsonObj, modules, jsonObj.app_topic, true);
      payload = { ...payload, ...filledInModules };
    }
    dispatch({ type: "changeJson", payload });
  };

  const FormLabelComponents = sortObjEntriesAlphabetically(Object.entries(modules))
    .map(([key, module]) => (
      <FormControlLabel
        control={
          <Checkbox
            checked={module.selected}
            onChange={e => handleChange(e.target.checked, e.target.name, module)}
            name={key} />}
        key={key}
        label={key} />
    )
  );

  return(
    <article className={classes.formWrapper}>
      <div className={classes.leftPlaceholder}></div>
      <FormGroup>
        {FormLabelComponents}
      </FormGroup>
    </article>
  );
};

export default MenuSelectModules;