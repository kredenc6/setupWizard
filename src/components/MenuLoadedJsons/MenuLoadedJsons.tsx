import React, { useEffect } from "react";
import { makeStyles } from "@material-ui/core";
import { JsonResultObj } from "../../interfaces/interfaces";

import LoadedJsonPreview from "./LoadedJsonPreview/LoadedJsonPreview";
import LoadedJson from "./LoadedJson/LoadedJson";

interface Props {
  handleClick: (jsonObj: JsonResultObj) => void;
  jsonObj: JsonResultObj;
  loadedJsons: JsonResultObj[];
  setIsNextStepAllowed: React.Dispatch<React.SetStateAction<boolean>>;
};

const style = {
  menuLoadedJsons: {
    display: "flex"
  },
  loadedJsons: {
    width: "100%",
    display: "flex",
    flexFlow: "row wrap",
    justifyContent: "center",
    alignItems: "flex-start",
    "overflow-y": "auto"
  }
};
const useStyles = makeStyles(style);

const MenuLoadedJsons = ({ handleClick, jsonObj, loadedJsons, setIsNextStepAllowed }: Props) => {
  const classes = useStyles();
  const LoadedJsonComponents = loadedJsons.map(loadedJson => {
    return <LoadedJsonPreview
      handleClick={() => handleClick(loadedJson)}
      loadedJson={loadedJson}
      key={loadedJson.app_topic}
      selectedJsonObjAppTopic={jsonObj.app_topic} />
  });

  // always allow next step
  useEffect(() => {
    setIsNextStepAllowed(true);
  },[setIsNextStepAllowed]);

  return(
    <section className={classes.menuLoadedJsons}>
      <div  className={classes.loadedJsons}>
        {LoadedJsonComponents}
      </div>
      <LoadedJson jsonObj={jsonObj} />
    </section>
  );
};

export default MenuLoadedJsons;