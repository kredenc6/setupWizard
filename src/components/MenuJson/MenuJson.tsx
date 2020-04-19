import React from "react";
import { makeStyles, Theme } from "@material-ui/core/styles";
import RestJsonPropsComponent from "./RestJsonPropsComponent/RestJsonPropsComponent";
import { JsonObjKey, JsonResultObj, UserInput } from "../../interfaces/interfaces";

interface Props {
  handleJsonChange: (key: JsonObjKey, changedModule: JsonResultObj[JsonObjKey]) => void;
  jsonObj: JsonResultObj;
  userInput: UserInput;
};

const styles = (theme: Theme) => ({
  menuJson: {
    width: "100%",
    display: "flex",
    justifyContent: "space-between"
  },
  jsonWrapper: {
    minWidth: "25rem",
    maxHeight: "100%",
    padding: "1rem",
    borderLeft: `1px solid ${theme.palette.divider}`,
    "overflow-y": "auto"
  },
  json: {
    "&:hover": {
      cursor: "text"
    }
  }
});
const useStyles = makeStyles(theme => styles(theme));

const MenuJson = ({ handleJsonChange, jsonObj, userInput }: Props) => {
  const classes = useStyles();
  const restJsonProps = Object.entries(jsonObj)
    .filter(([key,_]) => {
      return !Object.keys(userInput.modules)
        .concat(["visible_components", "app_topic"])
        .includes(key);
    });

  return(
    <section className={classes.menuJson}>
      <div>
        <RestJsonPropsComponent handleJsonChange={handleJsonChange} restJson={restJsonProps} />
      </div>
      <pre className={classes.jsonWrapper}>
        <code className={classes.json}>
          {JSON.stringify(jsonObj, null, 2)}
        </code>
      </pre>
    </section>
  );
};

export default MenuJson;