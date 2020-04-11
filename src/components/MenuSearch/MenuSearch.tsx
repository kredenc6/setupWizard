// Checkbox vs Toggle Switch: https://uxplanet.org/checkbox-vs-toggle-switch-7fc6e83f10b8?

import React from "react";
import { Checkbox, FormControlLabel, FormGroup } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import MenuHeading from "../sharedComponents/MenuHeading";
import { UserInput } from "../../interfaces/interfaces";
import { UserInputKeys } from "../../SetupWizard";

interface Props {
  handleModuleChange: <T>(propName: UserInputKeys, value: T) => void;
  selectedModules: UserInput["selectedModules"];
  setIsNextStepAllowed: React.Dispatch<React.SetStateAction<boolean>>;
};

const styles = {
  // menuSearch: {
  //   "text-align": "center"
  // },
  formWrapper: {
    display: "flex"
  },
  leftPlaceholder: {
    width: "42%"
  }
};

const useStyles = makeStyles(styles);

const sortObjEntriesAlphabetically = (entries: [string, boolean][]) => {
  return entries.sort(([keyA, _A], [keyB, _B]) => {
    if (keyA.toLocaleLowerCase() < keyB.toLocaleLowerCase()) return -1;
    if (keyA.toLocaleLowerCase() > keyB.toLocaleLowerCase()) return 1;
    return 0;
  });
}

const MenuSearch = ({ handleModuleChange, selectedModules, setIsNextStepAllowed }: Props) => {
  const classes = useStyles();
  setIsNextStepAllowed(false);
  
  const FormLabelComponents = sortObjEntriesAlphabetically(Object.entries(selectedModules))
    .map(([key, value]) => (
      <FormControlLabel
        control={
          <Checkbox
          checked={value}
          onChange={(e) => handleModuleChange("selectedModules", { ...selectedModules, [e.target.name]: e.target.checked })}
          name={key} />}
        key={`${key} label`}
        label={key} />
    )
  );

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
}

export default MenuSearch;