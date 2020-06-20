import React from "react";
import { Checkbox, FormControlLabel, FormGroup, Tooltip } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import sortObjEntriesAlphabetically from "../../../../miscellaneous/sortObjEntriesAlphabetically";
import { UserInput, UserInputPlatformKeys } from "../../../../interfaces/variousInterfaces";
import { SWActions } from "../../../../sWReducer/sWReducer";

interface Props {
  dispatch: React.Dispatch<SWActions>;
  platforms: UserInput["platforms"];
};

const useStyles = makeStyles({
  formWrapper: {
    display: "flex",
    minWidth: "30rem"
  },
  leftPlaceholder: {
    width: "42%"
  }
});

const SelectPlatforms = React.memo(({ dispatch, platforms }: Props) => {
  const classes = useStyles();

  const FormLabelComponents = sortObjEntriesAlphabetically(Object.entries(platforms))
    .map(([key, platform]) => {
      if(key === "events") {
        return (
          <Tooltip arrow key={key} placement="right" title="not yet supported">
            <FormControlLabel
              control={
                <Checkbox
                  checked={false}
                  disabled={true}
                  name={key} />}
              label={key} />
          </Tooltip>
        );
      }
      return (
        <FormControlLabel
          control={
            <Checkbox
              checked={platform.selected}
              onChange={e => {
                dispatch({
                  type: "changeSelectedPlatforms",
                  payload: {
                    isSelected: e.target.checked,
                    platformName: e.target.name as UserInputPlatformKeys
                  }
                })
              }}
              name={key} />}
          key={key}
          label={key} />
      );
    }
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

export default SelectPlatforms;


function compareProps(prevProps: Props, nextProps: Props) {
  const prevPlatformEntries = Object.entries(prevProps.platforms);
  for(const [key, value] of prevPlatformEntries) {
    if(value.selected !== nextProps.platforms[key as UserInputPlatformKeys].selected) return false;
  }
  return true;
}