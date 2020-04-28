import React from "react";
import { Button } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import RestJsonPropsComponent from "./RestJsonPropsComponent/RestJsonPropsComponent";
import ServerStatus from "../sharedComponents/ServerStatus";
import VerificationStatus from "../sharedComponents/VerificationStatus";
import { JsonObjKey, JsonResultObj, UserInput } from "../../interfaces/interfaces";

interface Props {
  handleJsonChange: (key: JsonObjKey, changedModule: JsonResultObj[JsonObjKey]) => void;
  jsonObj: JsonResultObj;
  serverStatus: string;
  userInput: UserInput;
};

const styles = {
  menuJson: {
    width: "100%",
    display: "flex",
    justifyContent: "space-between"
  },
  jsonWrapper: {
    minWidth: "25rem",
    maxHeight: "100%",
    padding: "1rem",
    "overflow-y": "auto"
  },
  json: {
    "&:hover": {
      cursor: "text"
    }
  }
};
const useStyles = makeStyles(styles);

const MenuJson = ({ handleJsonChange, jsonObj, serverStatus, userInput }: Props) => {
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
        <ServerStatus serverStatus={serverStatus} />
        <VerificationStatus status={serverStatus === "online" ? "enabled" : "disabled"} />
        <RestJsonPropsComponent
          handleJsonChange={handleJsonChange}
          isVerificationEnabled={serverStatus === "online" ? true : false}
          restJson={restJsonProps} />
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

export default MenuJson;

function normalizeJsonfileName(name: string) {
  return name.trim().replace(/\s/g, "_").toLowerCase();
}

function downloadJson(jsonObj: JsonResultObj) {
  const fileName = normalizeJsonfileName(jsonObj.app_topic);
  const json = JSON.stringify(jsonObj, null, 2);
  const blob = new Blob([json],{type:'application/json'});
  const href = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = href;
  link.download = fileName + ".json";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}