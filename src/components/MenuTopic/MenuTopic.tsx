import React, { useEffect } from "react";
import { OutlinedInput } from "@material-ui/core";
import { makeStyles, styled } from "@material-ui/core/styles";
import MenuHeading from "../sharedComponents/MenuHeading";
import { UserInputKeys } from "../../SetupWizard";

interface Props {
  handleTopicChange: <T>(propName: UserInputKeys, value: T) => void;
  setIsNextStepAllowed: React.Dispatch<React.SetStateAction<boolean>>;
  value: string;
};

const styles = {
  menuTopic: {
    "text-align": "center"
  }
};

const TopicInput = styled(OutlinedInput)({
  width: "80%",
  marginTop: "2rem"
});

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
      <TopicInput
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