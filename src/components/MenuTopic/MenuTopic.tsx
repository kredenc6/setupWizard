import React, { useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import MenuHeading from "../sharedComponents/MenuHeading";
import SwTextField from "../sharedComponents/SwTextField";
import { UserInput } from "../../interfaces/interfaces";


interface Props {
  handleTopicChange: <K extends keyof UserInput>(propName: K, value: UserInput[K]) => void
  setIsNextStepAllowed: React.Dispatch<React.SetStateAction<boolean>>;
  value: string;
};

const styles = {
  menuTopic: {
    "text-align": "center"
  }
};
const useStyles = makeStyles(styles);

const MenuTopic = ({ handleTopicChange, setIsNextStepAllowed, value }: Props) => {
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
        onChange={(e) => handleTopicChange("appTopic", e.target.value)}
        placeholder="Type your app topic here (min. 2 characters)"
        required
        value={value}
      />
    </section>
  );
};

export default MenuTopic;