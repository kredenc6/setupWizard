import React, { useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import MenuHeading from "../sharedComponents/MenuHeading";
import SwTextField from "../sharedComponents/SwTextField";

const PLACEHOLDER = "Type your app topic here (min. 2 characters)";

interface Props {
  handleJsonChange: (value: string) => void;
  setIsNextStepAllowed: React.Dispatch<React.SetStateAction<boolean>>;
  value: string;
};

const styles = {
  menuTopic: {
    "text-align": "center"
  },
  textField: {
    minWidth: `${PLACEHOLDER.length / 2}rem`
  }
};
const useStyles = makeStyles(styles);

const MenuTopic = ({ handleJsonChange, setIsNextStepAllowed, value }: Props) => {
  const classes = useStyles();
  const isValueValid = value.trim().length >= 2;

  useEffect(() => {
    setIsNextStepAllowed(isValueValid);
  });

  return(
    <section className={classes.menuTopic}>
      <MenuHeading text="What is the app topic?" />
      <SwTextField
        autoFocus
        className={classes.textField}
        onChange={(e) => handleJsonChange(e.target.value)}
        placeholder={PLACEHOLDER}
        required
        value={value}
      />
    </section>
  );
};

export default MenuTopic;