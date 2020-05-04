import React from "react";
import { Typography } from "@material-ui/core";
import { createStyles, makeStyles, Theme } from "@material-ui/core";
import { JsonResultObj } from "../../../interfaces/interfaces";

interface Props {
  handleClick: () => void;
  loadedJson: JsonResultObj;
  selectedJsonObjAppTopic: string;
};

const styles = (theme: Theme) => 
  createStyles({
    jsonWrapper: {
      position: "relative",
      width: "20rem",
      height: "20rem",
      margin: theme.spacing(1),
      padding:theme.spacing(1),
      overflow: "hidden",
      border: `1px solid ${theme.palette.divider}`,
      "&:hover": {
        cursor: "pointer",
        boxShadow: "0 0 30px 0 #bbb"
      }
    },
    json: {
      fontSize: ".8rem"
    },
    dimmer: {
      position: "absolute",
      bottom: "0",
      width: "100%",
      height: "20%",
      background: `linear-gradient(transparent, ${theme.palette.background.default} 70%, ${theme.palette.background.default})`
    },
    selected: {
      boxShadow: `0 0 30px 0 ${theme.palette.primary.main}`,
      "&:hover": {
        cursor: "default",
        boxShadow: `0 0 30px 0 ${theme.palette.primary.main}`
      }
    }
});
const useStyles = makeStyles(theme => styles(theme));

const LoadedJsonPreview = ({ handleClick, loadedJson, selectedJsonObjAppTopic }: Props) => {
  const classes = useStyles();
  const isSelected = loadedJson.app_topic === selectedJsonObjAppTopic;

  return(
    <div className={`${classes.jsonWrapper} ${isSelected ? classes.selected : ""}`} onClick={handleClick}>
      <Typography align="center" children={`App topic: ${loadedJson.app_topic}`} variant="h6" />
      <pre>
        <code className={classes.json}>
          {JSON.stringify(loadedJson, null, 2)}
        </code>
      </pre>
      <div className={classes.dimmer}></div>
    </div>
  );
};

export default LoadedJsonPreview;