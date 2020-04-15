import React from "react";
import createJSONObj from "../../miscellaneous/createJsonObj";
import { makeStyles } from "@material-ui/core/styles";
import { UserInput } from "../../interfaces/interfaces";

interface Props {
  userInput: UserInput;
};

const styles = {
  menuJson: {
    "overflow-y": "auto"
  },
  jsonWrapper: {
    padding: "1rem"
  },
  json: {
    "&:hover": {
      cursor: "text"
    }
  }
};
const useStyles = makeStyles(styles);


const MenuJson = ({ userInput }: Props) => {
  const classes = useStyles();
  return(
    <section className={classes.menuJson}>
      <pre className={classes.jsonWrapper}>
        <code className={classes.json}>
          {JSON.stringify(createJSONObj(userInput), null, 2)}
        </code>
      </pre>
    </section>
  );
};

export default MenuJson;