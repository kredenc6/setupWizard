import React from "react";
import { makeStyles, Theme } from "@material-ui/core/styles";

interface Props {
  topic: string;
};

const style = (theme: Theme) => ({
  topicParagraph: {
    margin: `${theme.spacing(1)}px 0 ${theme.spacing(2)}px`
  }
});
const useStyle = makeStyles(theme => style(theme));

const AppTopicParagraph = ({ topic }: Props) => {
  const classes = useStyle();
  return(
    <p className={classes.topicParagraph}>App topic: {topic}</p>
  );
};

export default AppTopicParagraph;