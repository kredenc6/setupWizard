import React, { useEffect } from "react";
import { Checkbox, FormControlLabel, FormGroup } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import MenuHeading from "../sharedComponents/MenuHeading";
import sortObjEntriesAlphabetically from "../../miscellaneous/sortObjEntriesAlphabetically";
import { UserInput } from "../../interfaces/interfaces";

interface Props {
  handleJsonChange: (value: string[]) => void;
  handleModuleChange: <K extends keyof UserInput>(propName: K, value: UserInput[K]) => void;
  modules: UserInput["modules"];
  setIsNextStepAllowed: React.Dispatch<React.SetStateAction<boolean>>;
};

const styles = {
  formWrapper: {
    display: "flex"
  },
  leftPlaceholder: {
    width: "42%"
  }
};
const useStyles = makeStyles(styles);

const isAtLeastOneModuleSelected = (modules: Props["modules"]) => {
  return Object.entries(modules).some(([_, module]) => {
    return module.selected;
  });
};

const MenuSearch = ({ handleJsonChange, handleModuleChange, modules, setIsNextStepAllowed }: Props) => {
  const classes = useStyles();

  const FormLabelComponents = sortObjEntriesAlphabetically(Object.entries(modules))
    .map(([key, module]) => (
      <FormControlLabel
        control={
          <Checkbox
            checked={module.selected}
            onChange={(e) => {
              handleModuleChange(
                "modules",
                { ...modules, [e.target.name]: { ...module, selected: e.target.checked } }
              );
            }}
            name={key} />}
        key={key}
        label={key} />
    )
  );

  //BUG? it's possible to have module prop "shwow_in_app" value true and the "visible_components" json prop
  // without the module
  //BUG handleJsonChange in the useEffect dependency causes an infinite loop
  useEffect(() => {
    setIsNextStepAllowed(isAtLeastOneModuleSelected(modules));
    handleJsonChange(Object.entries(modules)
      .filter(([_, value]) => value.selected)
      .map(([key, _]) => key));
  },[modules, setIsNextStepAllowed]);

  return(
    <section>
      <MenuHeading text="Select visible components." />
      <div className={classes.formWrapper}>
        <div className={classes.leftPlaceholder}></div>
        <FormGroup>
          {FormLabelComponents}
        </FormGroup>
      </div>
    </section>
  );
};

export default MenuSearch;