import React, { useState } from "react";
import { Badge, Button, Popover } from "@material-ui/core";
import { createStyles, makeStyles } from "@material-ui/core/styles";
import GitActions from "./GitActions/GitActions";
import LastUpdate from "./LastUpdate/LastUpdate";
import DataDisplay from "../DataDisplay";
import sortObjEntriesAlphabetically from "../../../miscellaneous/sortObjEntriesAlphabetically";
import { ServerIs } from "../../../interfaces/interfaces";
import { StatusResult } from "../../../interfaces/simpleGit";
import { SWActions } from "../../../sWReducer/sWReducer";
import { FilesState } from "../../../interfaces/fileInterfaces";

interface Props {
  dispatch: React.Dispatch<SWActions>;
  jsonFilesState: FilesState;
  serverState: ServerIs;
};

const useStyles = makeStyles(({ spacing }) => 
  createStyles({
    popover: {
    },
    paper: {
      padding: spacing(1),
    },
    jsonWrapper: {
      width: "auto",
      padding: spacing(1)
    }
  })
);

export default function GitStateReport({ dispatch, jsonFilesState, serverState }: Props) {
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const open = Boolean(anchorEl);
  const { lastRepoUpdate, localRepoState } = jsonFilesState;

  const handleClick = (currentTarget: HTMLElement) => {
    if(!anchorEl) setAnchorEl(currentTarget);
    else setAnchorEl(null);
  }

  const handlePopoverClose = () => {
    setAnchorEl(null);
  };

  return(
    <>
      <Badge badgeContent={localRepoState?.ahead || localRepoState?.behind ? "!" : 0} color="error">
        <Button
          color="primary"
          children="git state"
          disabled={serverState === "offline" || !localRepoState}
          onClick={e => handleClick(e.currentTarget)}
          style={{ width: "100%" }}
          variant="outlined" />
      </Badge>
      <Popover
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        classes={{
          paper: classes.paper,
        }}
        className={classes.popover}
        disableRestoreFocus
        onClose={handlePopoverClose}
        open={open}
        transformOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
      >
        <div>
          {localRepoState ?
              <GitActions
                dispatch={dispatch}
                jsonFilesState={jsonFilesState}
                serverState={serverState} />
            :
              null}
          <LastUpdate timeStamp={lastRepoUpdate} />
          <DataDisplay classes={{ jsonWrapper: classes.jsonWrapper }} data={normalizeRepoState(localRepoState)} />
        </div>
      </Popover>
    </>
  );
};

function normalizeRepoState(repoState: StatusResult | null) {
  if(!repoState) return null;
  const sortedAndFiltered = sortObjEntriesAlphabetically(
    Object.entries(repoState).filter(([key, _]) => key !== "files")
  );

  let normalizedRepoState = {};
  for(let [key, value] of sortedAndFiltered) {
    normalizedRepoState = { ...normalizedRepoState, [key]: value };
  }

  return normalizedRepoState as Omit<StatusResult, "files">;
}