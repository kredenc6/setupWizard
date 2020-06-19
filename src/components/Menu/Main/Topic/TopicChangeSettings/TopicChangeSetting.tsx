import React from "react";
import { FormControlLabel, Switch, Typography } from "@material-ui/core";
import { createStyles, makeStyles } from "@material-ui/core/styles";
import { SWActions } from "../../../../../sWReducer/sWReducer";

interface Props {
  dispatch: React.Dispatch<SWActions>;
  resetOtherValues: boolean;
  setAsChannelValues: boolean;
}

const useStyles = makeStyles(({ spacing }) =>
  createStyles({
    switchWrapper: {
      display: "inline-flex",
      flexDirection: "column",
      marginLeft: spacing(2)
    }
  })
);

const TopicChangeSettings = React.memo(({ dispatch, resetOtherValues, setAsChannelValues }: Props) => {
  const classes = useStyles();
  return(
    <div className={classes.switchWrapper}>
      <Typography align="left" children="with change:" />
      <FormControlLabel
        control={
          <Switch
            checked={resetOtherValues}
            onChange={e => dispatch({ type: "changeUserInput", payload: { resetJsonOnAppTopicChange: e.target.checked } })} />
        }
        label="clear other values" />
      <FormControlLabel
        control={
          <Switch
            checked={setAsChannelValues}
            onChange={e => dispatch({ type: "changeUserInput", payload: { setAlsoAsChannelValues: e.target.checked } })} />
        }
        label="set also as channel values" />
    </div>
  );
});

export default TopicChangeSettings;