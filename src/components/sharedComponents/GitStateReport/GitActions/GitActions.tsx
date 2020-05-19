import React, { useRef, useState } from 'react';
import { Button, ButtonGroup, ClickAwayListener, Grid, Grow, IconButton, MenuItem, MenuList, Paper, Popper, Tooltip }
 from "@material-ui/core";
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import SyncIcon from '@material-ui/icons/Sync';
import PromptCommitMessage from "./PromptCommitMessage/PromptCommitmessage";
import { commitRepo, mergeRemoteRepo, pushToRemoteRepo } from "../../../../gitFunctions/gitFunctions";
import { SERVER_ADDRESS } from "../../../../SetupWizard";
import { ServerIs } from "../../../../interfaces/interfaces";
import { StatusResult } from "../../../../interfaces/simpleGit";
import Interval from '../../../../classes/Interval';

interface Props {
  gitState: StatusResult;
  remoteRepoCheckInterval: Interval;
  serverState: ServerIs;
};

const OPTIONS = ["commit", "push", "merge", "merge and push"];

// TODO refresh repoState after changes!
export default function SplitButton({ gitState, remoteRepoCheckInterval, serverState }: Props) {
  const [openButtonGroup, setOpenButtonGroup] = useState(false);
  const [openCommitPrompt, setOpenCommitPrompt] = useState(false);
  const [commitMessage, setCommitMessage] = useState("");
  const anchorRef = useRef<HTMLDivElement>(null);
  const [selectedIndex, setSelectedIndex] = useState(selectIndex(gitState));
  const conflicted = Boolean(gitState.conflicted.length);

  const handleClick = () => {
    if(OPTIONS[selectedIndex] === "commit") {
      if(commitMessage.trim()) {
        commitRepo(SERVER_ADDRESS, commitMessage, gitState.not_added)
          .then(commitSummary => console.dir(commitSummary))
          .catch(err => console.log(err.message));
      } else {
        console.log("Did not commit.");
      }
    }
    if(OPTIONS[selectedIndex] === "push") {
      pushToRemoteRepo(SERVER_ADDRESS)
      .then(pushSummary => console.log(pushSummary));
    }
    if(OPTIONS[selectedIndex] === "merge") {
      mergeRemoteRepo(SERVER_ADDRESS);
    }
    if(OPTIONS[selectedIndex] === 'merge and push') {
      mergeRemoteRepo(SERVER_ADDRESS)
        .then(mergeSummary => {
          if(mergeSummary) {
            pushToRemoteRepo(SERVER_ADDRESS)
              .then(pushSummary => console.log(pushSummary));
          } else {
            console.log("Merge failure.");
          }
        })
        .catch(err => console.log(err.message));
    }
  };

  const handleMenuItemClick = (index: number) => {
    setSelectedIndex(index);
    setOpenButtonGroup(false);
  };

  const handleToggle = () => {
    setOpenButtonGroup(prevOpen => !prevOpen);
  };

  const handleClose = (event: React.MouseEvent<Document, MouseEvent>) => {
    if (anchorRef.current && anchorRef.current.contains(event.target as HTMLElement)) {
      return;
    }

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
            onClick={() => {
              remoteRepoCheckInterval.setCallbackProps([serverState, true]); // true for forced refresh
              remoteRepoCheckInterval.executeNow();
              remoteRepoCheckInterval.setCallbackProps([serverState]); // forced refresh closure value back to default
            }}
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
  if(option === "push" && !gitState.ahead) return true;
  if(option === "merge" && !gitState.behind) return true;
  if(option === "merge and push" && !(gitState.ahead && gitState.behind)) return true;
  return false;
}

function isButtonGroupDisabled(gitState: StatusResult) {
  return !Boolean(gitState.ahead + gitState.behind + gitState.not_added.length) || Boolean(gitState.conflicted.length);
}