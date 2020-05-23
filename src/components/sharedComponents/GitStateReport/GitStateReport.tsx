import React, { useState } from "react";
import { Badge, Button, Popover } from "@material-ui/core";
import { createStyles, makeStyles } from "@material-ui/core/styles";
import GitActions from "./GitActions/GitActions";
import LastUpdate from "./LastUpdate/LastUpdate";
import DataDisplay from "../DataDisplay";
import sortObjEntriesAlphabetically from "../../../miscellaneous/sortObjEntriesAlphabetically";
import { ServerIs } from "../../../interfaces/interfaces";
import { StatusResult } from "../../../interfaces/simpleGit";
import Interval from "../../../classes/Interval";

interface Props {
  gitState: StatusResult | null;
  lastRepoUpdate: number;
  remoteRepoCheckInterval: Interval;
  serverState: ServerIs;
};

const useStyles = makeStyles(theme => 
  createStyles({
    popover: {
    },
    paper: {
      padding: theme.spacing(1),
    }
  })
);

export default function GitStateReport ({ gitState, lastRepoUpdate, remoteRepoCheckInterval, serverState }: Props) {
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const open = Boolean(anchorEl);

  const handleClick = (currentTarget: HTMLElement) => {
    if(!anchorEl) setAnchorEl(currentTarget);
    else setAnchorEl(null);
  }

  const handlePopoverClose = () => {
    setAnchorEl(null);
  };

  return(
    <>
      <Badge badgeContent={gitState?.ahead || gitState?.behind ? "!" : 0} color="error">
        <Button
          color="primary"
          children="git state"
          disabled={serverState === "offline" || !gitState}
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
          {gitState ?
              <GitActions gitState={gitState} remoteRepoCheckInterval={remoteRepoCheckInterval} serverState={serverState} />
            :
              null}
          <LastUpdate timeStamp={lastRepoUpdate} />
          <DataDisplay data={normalizeRepoState(gitState)} />
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