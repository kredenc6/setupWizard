import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import SwTextField from "../sharedComponents/SwTextField";
import TopicChangeSettings from "./TopicChangeSettings/TopicChangeSetting";
import { SWActions } from "../../sWReducer/sWReducer";

const PLACEHOLDER = "Type your app topic here (min. 2 characters)";

interface Props {
  dispatch: React.Dispatch<SWActions>;
  resetOtherValues: boolean;
  setAsChannelValues: boolean;
  value: string;
};

const useStyles = makeStyles({
  textField: {
    marginTop: "2rem",
    minWidth: `${PLACEHOLDER.length / 2}rem`
  }
});

export default function MenuTopic({ dispatch, resetOtherValues, setAsChannelValues, value }: Props) {
  const classes = useStyles();

  return(
    <article>
      <SwTextField
        autoFocus
        className={classes.textField}
        onChange={e => dispatch({ type: "changeTopic", payload: e.target.value })}
        placeholder={PLACEHOLDER}
        required
        value={value}
      />
      <TopicChangeSettings
        dispatch={dispatch}
        resetOtherValues={resetOtherValues}
        setAsChannelValues={setAsChannelValues} />
    </article>
  );
};
