import React from "react";
import { createStyles, makeStyles } from "@material-ui/core/styles";
import SelectedModule from "../SelectedModule/SelectedModule";
import sortObjEntriesAlphabetically from "../../miscellaneous/sortObjEntriesAlphabetically";
import { JsonObjModule, JsonResultObj, ServerIs, UserInput, UserInputModuleKeys } from "../../interfaces/interfaces";
import { SWActions } from "../../sWReducer/sWReducer";

interface Props {
  dispatch: React.Dispatch<SWActions>;
  jsonObj: JsonResultObj;
  modules: UserInput['modules'];
  serverState: ServerIs;
};

const useStyles = makeStyles(theme =>
  createStyles({
    modulesWrapper: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gridGap: theme.spacing(1),
      padding: `${theme.spacing(2)}px ${theme.spacing(1)}px ${theme.spacing(1)}px`,
      overflow: "auto"
    }
  })
);

export default function MenuSelectedModules({ dispatch, jsonObj, modules, serverState }: Props) {
  const classes = useStyles();
  const SelectedModules = sortObjEntriesAlphabetically(Object.entries(modules))
  .filter(([_, module]) => module.selected)
  .map(([key, _]) => <SelectedModule 
    appTopic={jsonObj.app_topic}
    dispatch={dispatch}
    jsonModuleObj={jsonObj[key as UserInputModuleKeys] as unknown as JsonObjModule}
    key={key}
    moduleSettings={modules[key as UserInputModuleKeys]}
    moduleName={key as UserInputModuleKeys}
    serverState={serverState} />
  );

  return(
    <section className={classes.modulesWrapper}>
      {SelectedModules}
    </section>
  );
}