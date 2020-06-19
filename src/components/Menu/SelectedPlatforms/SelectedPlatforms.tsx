import React from "react";
import { createStyles, makeStyles } from "@material-ui/core/styles";
import SimpleBar from "simplebar-react";
import SelectedPlatform from "./SelectedPlatform/SelectedPlatform";
import sortObjEntriesAlphabetically from "../../../miscellaneous/sortObjEntriesAlphabetically";
import { ServerIs, UserInput, UserInputPlatformKeys } from "../../../interfaces/variousInterfaces";
import { JsonObjPlatform, JsonResultObj } from "../../../interfaces/jsonInterfaces";
import { SWActions } from "../../../sWReducer/sWReducer";
import "../../../../node_modules/simplebar/dist/simplebar.min.css";

interface Props {
  dispatch: React.Dispatch<SWActions>;
  jsonObj: JsonResultObj;
  platforms: UserInput["platforms"];
  serverState: ServerIs;
};

const useStyles = makeStyles(({ spacing }) =>
  createStyles({
    simplebar: {
      // a little simplebar hack :)
      minHeight: "100%",
      maxHeight: "100%"
    },
    platformsWrapper: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gridGap: spacing(1),
      padding: spacing(1)
    }
  })
);

export default function SelectedPlatforms({ dispatch, jsonObj, platforms, serverState }: Props) {
  const classes = useStyles();
  const SelectedPlatforms = sortObjEntriesAlphabetically(Object.entries(platforms))
  .filter(([_, platform]) => platform.selected)
  .map(([key, _]) => <SelectedPlatform
    dispatch={dispatch}
    jsonPlatformObj={jsonObj[key as UserInputPlatformKeys] as unknown as JsonObjPlatform}
    key={key}
    platformSettings={platforms[key as UserInputPlatformKeys]}
    platformName={key as UserInputPlatformKeys}
    serverState={serverState} />
  );

  return(
    <SimpleBar className={classes.simplebar}>
      <section className={classes.platformsWrapper}>
        {SelectedPlatforms}
      </section>
    </SimpleBar>
  );
};
