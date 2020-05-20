import React from "react";
import { Checkbox, FormControlLabel, FormGroup } from "@material-ui/core";
import { createStyles, makeStyles } from "@material-ui/core/styles";
import sortObjEntriesAlphabetically from "../../miscellaneous/sortObjEntriesAlphabetically";
import { UserInput, Module } from "../../interfaces/interfaces";

interface Props {
  handleJsonChange: (value: string[]) => void;
  handleModuleChange: <K extends keyof UserInput>(propName: K, value: UserInput[K]) => void;
  modules: UserInput["modules"];
};

const useStyles = makeStyles(theme => 
  createStyles({
    formWrapper: {
      display: "flex"
    },
    leftPlaceholder: {
      width: "42%"
    }
  })
);

const MenuSelectModules = ({ handleJsonChange, handleModuleChange, modules }: Props) => {
  const classes = useStyles();
  const handleChange = (checked: boolean, moduleName: string, module: Module) => {
    const updatedModules = { ...modules, [moduleName]: { ...module, selected: checked } };
    // change userInput
    handleModuleChange("modules", updatedModules);

    // change jsonObject
    const selectedModules = Object.entries(updatedModules)
      .filter(([_, module]) => module.selected)
      .map(([key, _]) => key);

    handleJsonChange(selectedModules);
  };

  const FormLabelComponents = sortObjEntriesAlphabetically(Object.entries(modules))
    .map(([key, module]) => (
      <FormControlLabel
        control={
          <Checkbox
            checked={module.selected}
            onChange={(e) => handleChange(e.target.checked, e.target.name, module)}
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