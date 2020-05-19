import React from "react";
import { FormControlLabel, Switch } from "@material-ui/core";
import { createStyles, makeStyles } from "@material-ui/core/styles";
import SubMenuHeading from "../sharedComponents/SubMenuHeading";
import SwTextField from "../sharedComponents/SwTextField";

const PLACEHOLDER = "Type your app topic here (min. 2 characters)";

interface Props {
  handleChange: (value: string) => void;
  handleChannelsSwitch: () => void;
  handleResetSwitch: () => void;
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
    handleChange,
    handleChannelsSwitch,
    handleResetSwitch,
    resetOtherValues,
    setAsChannelValues,
    value 
  } = props;
  const classes = useStyles();

  return(
    <section className={classes.menuTopic}>
      <SubMenuHeading text="What is the app topic?"  />
      <SwTextField
        autoFocus
        className={classes.textField}
        onChange={e => handleChange(e.target.value)}
        placeholder={PLACEHOLDER}
        required
        value={value}
      />
      <div className={classes.switchWrapper}>
        <FormControlLabel
          control={<Switch checked={resetOtherValues} onClick={handleResetSwitch} />}
          label="reset other values with change" />
        <FormControlLabel
          control={<Switch checked={setAsChannelValues} onClick={handleChannelsSwitch} />}
          label="set also as channel values" />
      </div>
    </section>
  );
};

export default MenuTopic;