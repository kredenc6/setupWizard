import React from "react";
import { Checkbox, FormControlLabel, FormGroup } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import sortObjEntriesAlphabetically from "../../miscellaneous/sortObjEntriesAlphabetically";
import { Module, UserInput, UserInputModuleKeys } from "../../interfaces/interfaces";
import { SWActions } from "../../sWReducer/sWReducer";

interface Props {
  dispatch: React.Dispatch<SWActions>;
  modules: UserInput["modules"];
};

const useStyles = makeStyles({
  formWrapper: {
    display: "flex"
  },
  leftPlaceholder: {
    width: "42%"
  }
});

const MenuSelectModules = ({ dispatch, modules }: Props) => {
  const classes = useStyles();
  const handleChange = (checked: boolean, moduleName: string, module: Module) => {
    const updatedModules = { ...modules, [moduleName]: { ...module, selected: checked } };
    dispatch({ type: "changeUserInput", payload: { modules: updatedModules } });

    const selectedModules = Object.entries(updatedModules)
      .filter(([_, module]) => module.selected)
      .map(([key, _]) => key) as UserInputModuleKeys[];
    dispatch({ type: "changeJson", payload: { visible_components: selectedModules } });
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