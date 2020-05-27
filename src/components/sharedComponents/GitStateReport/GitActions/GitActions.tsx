import React, { useEffect, useRef, useState } from "react";
import { Button, ButtonGroup, ClickAwayListener, Grid, Grow, IconButton, MenuItem, MenuList, Paper, Popper, Tooltip }
  from "@material-ui/core";
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import SyncIcon from '@material-ui/icons/Sync';
import PromptCommitMessage from "./PromptCommitMsg/PromptCommitMsg";
import { commitRepo, getFileNamesForCommit, mergeRemoteRepo, pushToRemoteRepo } from "../../../../gitFunctions/gitFunctions";
import { SERVER_ADDRESS } from "../../../../initialStates/constants";
import { ServerIs } from "../../../../interfaces/interfaces";
import { StatusResult } from "../../../../interfaces/simpleGit";
import Interval from '../../../../classes/Interval';

interface Props {
  gitState: StatusResult;
  remoteRepoCheckInterval: Interval;
  serverState: ServerIs;
};

const OPTIONS = ["commit", "push", "merge", "merge and push"];

export default function SplitButton({ gitState, remoteRepoCheckInterval, serverState }: Props) {
  const [openButtonGroup, setOpenButtonGroup] = useState(false);
  const [openCommitPrompt, setOpenCommitPrompt] = useState(false);
  const [commitMessage, setCommitMessage] = useState("");
  const anchorRef = useRef<HTMLDivElement>(null);
  const [selectedIndex, setSelectedIndex] = useState(selectIndex(gitState));
  const conflicted = Boolean(gitState.conflicted.length);

  const updateRepo = () => {
    remoteRepoCheckInterval.executeNow(true, [serverState, true]);
  };

  const handleClick = async () => {
    if(OPTIONS[selectedIndex] === "commit") {
      await commitRepo(SERVER_ADDRESS, commitMessage, getFileNamesForCommit(gitState));
      updateRepo();
    }
    if(OPTIONS[selectedIndex] === "push") {
      await pushToRemoteRepo(SERVER_ADDRESS)
      updateRepo();
    }
    if(OPTIONS[selectedIndex] === "merge") {
      await mergeRemoteRepo(SERVER_ADDRESS);
      updateRepo();
    }
    if(OPTIONS[selectedIndex] === 'merge and push') {
      const mergeSummary = await mergeRemoteRepo(SERVER_ADDRESS);
      if(mergeSummary) {
        await pushToRemoteRepo(SERVER_ADDRESS)
        updateRepo();
      }
    }
  };

  useEffect(() => {
    setSelectedIndex(selectIndex(gitState));
  },[gitState]);

  const handleMenuItemClick = (index: number) => {
    setSelectedIndex(index);
    setOpenButtonGroup(false);
  };

  const handleToggle = () => {
    setOpenButtonGroup(prevOpen => !prevOpen);
  };

  const handleClose = (event: React.MouseEvent<Document, MouseEvent>) => {
    if (anchorRef.current && anchorRef.current.contains(event.target as HTMLElement)) return; // don't close...
    // ...on the anchor element click
    setOpenButtonGroup(false);
  };

  return (
    <Grid container direction="column" alignItems="center">
      <PromptCommitMessage
        handleChange={(value: string) => setCommitMessage(value)}
        open={openCommitPrompt}
        setOpen={setOpenCommitPrompt}
        sendCommit={() => handleClick()}
        value={commitMessage} />
      <Grid item xs={12}>
        <ButtonGroup color="primary" disabled={isButtonGroupDisabled(gitState)} ref={anchorRef} variant="contained">
          {conflicted ?
              <Button>Conflicted!</Button>
            :
              <Button
                children={OPTIONS[selectedIndex]}
                onClick={() => {
                  if(OPTIONS[selectedIndex] === "commit") {
                    setOpenCommitPrompt(true);
                  } else {
                    handleClick()
                  }
                }} />
          }
          <Button
            color="primary"
            size="small"
            onClick={handleToggle}
          >
            <ArrowDropDownIcon />
          </Button>
        </ButtonGroup>
        <Tooltip arrow title="refresh">
          <IconButton
            color="secondary"
            disabled={serverState === "offline"}
            onClick={() => {remoteRepoCheckInterval.executeNow(true, [serverState, true])}} // update repo
          >
            <SyncIcon />
          </IconButton>
        </Tooltip>
        <Popper open={openButtonGroup} anchorEl={anchorRef.current} role={undefined} transition disablePortal>
          {({ TransitionProps, placement }) => (
            <Grow
              {...TransitionProps}
              style={{
                transformOrigin: placement === 'bottom' ? 'center top' : 'center bottom',
              }}
            >
              <Paper>
                <ClickAwayListener onClickAway={handleClose}>
                  <MenuList id="split-button-menu">
                    {OPTIONS.map((option, index) => (
                      <MenuItem
                        key={option}
                        disabled={isOptionDisabled(option, gitState)}
                        selected={index === selectedIndex}
                        onClick={() => handleMenuItemClick(index)}
                      >
                        {option}
                      </MenuItem>
                    ))}
                  </MenuList>
                </ClickAwayListener>
              </Paper>
            </Grow>
          )}
        </Popper>
      </Grid>
    </Grid>
  );
}

function selectIndex(gitState: StatusResult) {
  if(gitState.not_added.length) return 0;
  if(gitState.ahead && gitState.behind) return 3;
  if(gitState.behind) return 2;
  return 1;
}

function isOptionDisabled(option: string, gitState: StatusResult) {
  if(option === "commit" && !gitState.not_added.length) return true;
  if(option === "push" && (gitState.behind || !gitState.ahead)) return true;
  if(option === "merge" && !gitState.behind) return true;
  if(option === "merge and push" && !(gitState.ahead && gitState.behind)) return true;
  return false;
}

function isButtonGroupDisabled(gitState: StatusResult) {
  return !Boolean(gitState.ahead + gitState.behind + gitState.not_added.length) || Boolean(gitState.conflicted.length);
}