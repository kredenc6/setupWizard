import React from "react";
import { makeStyles, Theme } from "@material-ui/core/styles";
import RestJsonPropsComponent from "./RestJsonPropsComponent/RestJsonPropsComponent";
import { JsonObjKey, JsonResultObj, UserInput } from "../../interfaces/interfaces";
import { Button } from "@material-ui/core";

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
    .filter(([key, _]) => {
      return !Object.keys(userInput.modules) // skip modules...
        .concat(["visible_components", "app_topic", "ui_colors"]) // and these properties
        .includes(key); // condition or filter method
    });

  return(
    <section className={classes.menuJson}>
      <div>
        <RestJsonPropsComponent handleJsonChange={handleJsonChange} restJson={restJsonProps} />
      </div>
      <Button color="primary" onClick={() => downloadJson(jsonObj)} variant="contained">
                  Download Json
                </Button>
      <pre className={classes.jsonWrapper}>
        <code className={classes.json}>
          {JSON.stringify(jsonObj, null, 2)}
        </code>
      </pre>
    </section>
  );
};

const downloadJson = async (jsonObj: JsonResultObj) => {
  const fileName = "testfile";
  const json = JSON.stringify(jsonObj, null, 2);
  const blob = new Blob([json],{type:'application/json'});
  const href = await URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = href;
  link.download = fileName + ".json";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export default MenuJson;