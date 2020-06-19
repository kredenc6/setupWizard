import React from "react";
import { Checkbox, FormControlLabel, FormGroup } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import sortObjEntriesAlphabetically from "../../../../miscellaneous/sortObjEntriesAlphabetically";
import { UserInput, UserInputModuleKeys } from "../../../../interfaces/interfaces";
import { SWActions } from "../../../../sWReducer/sWReducer";

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

const SelectModules = React.memo(({ dispatch, modules }: Props) => {
  const classes = useStyles();

  const FormLabelComponents = sortObjEntriesAlphabetically(Object.entries(modules))
    .map(([key, module]) => (
      <FormControlLabel
        control={
          <Checkbox
            checked={module.selected}
            onChange={e => {
              dispatch({
                type: "changeSelectedModules",
                payload: {
                  isSelected: e.target.checked,
                  moduleName: e.target.name as UserInputModuleKeys
                }
              })
            }}
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
}, compareProps);

export default SelectModules;


function compareProps(prevProps: Props, nextProps: Props) {
  const prevModuleEntries = Object.entries(prevProps.modules);
  for(const [key, value] of prevModuleEntries) {
    if(value.selected !== nextProps.modules[key as UserInputModuleKeys].selected) return false;
  }
  return true;
}