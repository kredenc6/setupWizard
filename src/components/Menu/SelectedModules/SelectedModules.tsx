import React from "react";
import { createStyles, makeStyles } from "@material-ui/core/styles";
import SimpleBar from "simplebar-react";
import SelectedModule from "./SelectedModule/SelectedModule";
import sortObjEntriesAlphabetically from "../../../miscellaneous/sortObjEntriesAlphabetically";
import { JsonObjModule, JsonResultObj, ServerIs, UserInput, UserInputModuleKeys } from "../../../interfaces/interfaces";
import { SWActions } from "../../../sWReducer/sWReducer";
import "../../../../node_modules/simplebar/dist/simplebar.min.css";

interface Props {
  dispatch: React.Dispatch<SWActions>;
  jsonObj: JsonResultObj;
  modules: UserInput['modules'];
  serverState: ServerIs;
};

const useStyles = makeStyles(({ spacing }) =>
  createStyles({
    simplebar: {
      // a little simplebar hack :)
      minHeight: "100%",
      maxHeight: "100%"
    },
    modulesWrapper: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gridGap: spacing(1),
      padding: spacing(1)
    }
  })
);

export default function SelectedModules({ dispatch, jsonObj, modules, serverState }: Props) {
  const classes = useStyles();
  const SelectedModules = sortObjEntriesAlphabetically(Object.entries(modules))
  .filter(([_, module]) => module.selected)
  .map(([key, _]) => <SelectedModule
    dispatch={dispatch}
    jsonModuleObj={jsonObj[key as UserInputModuleKeys] as unknown as JsonObjModule}
    key={key}
    moduleSettings={modules[key as UserInputModuleKeys]}
    moduleName={key as UserInputModuleKeys}
    serverState={serverState} />
  );

  return(
    <SimpleBar className={classes.simplebar}>
      <section className={classes.modulesWrapper}>
        {SelectedModules}
      </section>
    </SimpleBar>
  );
};
