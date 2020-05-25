import React from "react";
import { FormControlLabel, Switch } from "@material-ui/core";
import { createStyles, makeStyles } from "@material-ui/core/styles";
import SwTextField from "../sharedComponents/SwTextField";
import { SWActions } from "../../sWReducer/sWReducer";

const PLACEHOLDER = "Type your app topic here (min. 2 characters)";

interface Props {
  dispatch: React.Dispatch<SWActions>;
  resetOtherValues: boolean;
  setAsChannelValues: boolean;
  value: string;
};

const useStyles = makeStyles(theme =>
  createStyles({
    menuTopic: {
      "text-align": "center"
    },
    textField: {
      minWidth: `${PLACEHOLDER.length / 2}rem`
    },
    switchWrapper: {
      display: "inline-flex",
      flexDirection: "column",
      marginLeft: theme.spacing(2)
    }
  })
);

const MenuTopic = (props: Props) => {
  const {
    dispatch,
    resetOtherValues,
    setAsChannelValues,
    value 
  } = props;
  const classes = useStyles();

  return(
    <article className={classes.menuTopic}>
      <SwTextField
        autoFocus
        className={classes.textField}
        onChange={e => dispatch({ type: "changeTopic", payload: e.target.value })}
        placeholder={PLACEHOLDER}
        required
        value={value}
      />
      <div className={classes.switchWrapper}>
        <FormControlLabel
          control={
            <Switch
              checked={resetOtherValues}
              onChange={e => dispatch({ type: "changeUserInput", payload: { resetJsonOnAppTopicChange: e.target.checked } })} />
          }
          label="reset other values with change" />
        <FormControlLabel
          control={
            <Switch
              checked={setAsChannelValues}
              onChange={e => dispatch({ type: "changeUserInput", payload: { setAlsoAsChannelValues: e.target.checked } })} />
          }
          label="set also as channel values" />
      </div>
    </article>
  );
};

export default MenuTopic;