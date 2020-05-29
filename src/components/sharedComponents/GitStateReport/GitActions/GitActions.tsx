import React, { useEffect, useRef, useState } from "react";
import { Button, ButtonGroup, ClickAwayListener, Grid, Grow, IconButton, MenuItem, MenuList, Paper, Popper, Tooltip }
  from "@material-ui/core";
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import SyncIcon from '@material-ui/icons/Sync';
import PromptCommitMessage from "./PromptCommitMsg/PromptCommitMsg";
import { handleCommit, handlePush, mergeRemoteRepo, pushToRemoteRepo } from "../../../../gitFunctions/gitFunctions";
import { createMessage } from "../../../../sWReducer/messageHandlingFunctions";
import { SERVER_ADDRESS } from "../../../../initialStates/constants";
import { ServerIs } from "../../../../interfaces/interfaces";
import { StatusResult } from "../../../../interfaces/simpleGit";
import Interval from '../../../../classes/Interval';
import { SWActions } from "../../../../sWReducer/sWReducer";
import { FilesState } from "../../../../interfaces/fileInterfaces";

interface Props {
  dispatch: React.Dispatch<SWActions>;
  jsonFilesState: FilesState;
  remoteRepoCheckInterval: Interval;
  serverState: ServerIs;
};

const OPTIONS = ["commit", "push", "merge", "merge and push"];

export default function SplitButton({ dispatch, jsonFilesState, remoteRepoCheckInterval, serverState }: Props) {
  const localRepoState = jsonFilesState.localRepoState as StatusResult;
  const [openButtonGroup, setOpenButtonGroup] = useState(false);
  const [openCommitPrompt, setOpenCommitPrompt] = useState(false);
  const [commitMessage, setCommitMessage] = useState("");
  const anchorRef = useRef<HTMLDivElement>(null);
  const [selectedIndex, setSelectedIndex] = useState(selectIndex(localRepoState));
  const conflicted = Boolean(localRepoState?.conflicted.length);

  const updateRepo = () => {
    remoteRepoCheckInterval.executeNow(true, [serverState, 0, true]);
  };

  const handleClick = async () => {
    if(OPTIONS[selectedIndex] === "commit") {
      // TODO optimize handleCommit?
      await handleCommit({ dispatch, commitMessage, jsonFilesState, serverState, remoteRepoCheckInterval });
      // await commitRepo(SERVER_ADDRESS, commitMessage, getFileNamesForCommit(localRepoState));
      // updateRepo();
    }
    if(OPTIONS[selectedIndex] === "push") {
      await handlePush(dispatch);
      // await pushToRemoteRepo(SERVER_ADDRESS)
      // updateRepo();
    }
    if(OPTIONS[selectedIndex] === "merge") {
      const mergeSummary = await mergeRemoteRepo(SERVER_ADDRESS);
      const messageTopic = mergeSummary ? "success" : "warning";
      const messageText = mergeSummary? "Merge successful." : "Merge failed.";
      dispatch({ type: "addMessage", payload: createMessage(messageTopic, messageText) });
      updateRepo();
    }
    if(OPTIONS[selectedIndex] === 'merge and push') {
      const mergeSummary = await mergeRemoteRepo(SERVER_ADDRESS);
      let messageTopic = mergeSummary ? "success" : "warning";
      let messageText = mergeSummary? "Merge successful." : "Merge failed.";
      dispatch({ type: "addMessage", payload: createMessage(messageTopic, messageText) });
      
      if(mergeSummary) {
        const pushSuccesful = await pushToRemoteRepo(SERVER_ADDRESS);
        messageTopic = pushSuccesful ? "success" : "warning";
        messageText = pushSuccesful? "Push successful." : "Push failed.";
        dispatch({ type: "addMessage", payload: createMessage(messageTopic, messageText) });
      }
      updateRepo();
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
    if (anchorRef.current && anchorRef.current.contains(event.target as HTMLElement)) return; // don't close...
    // ...on the anchor element click
    setOpenButtonGroup(false);
  };

  useEffect(() => {
    setSelectedIndex(selectIndex(localRepoState));
  },[localRepoState]);
  
  return (
    <Grid container direction="column" alignItems="center">
      <PromptCommitMessage
        handleChange={(value: string) => setCommitMessage(value)}
        open={openCommitPrompt}
        setOpen={setOpenCommitPrompt}
        sendCommit={() => handleClick()}
        value={commitMessage} />
      <Grid item xs={12}>
        <ButtonGroup color="primary" disabled={isButtonGroupDisabled(localRepoState)} ref={anchorRef} variant="contained">
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
            onClick={() => {remoteRepoCheckInterval.executeNow(true, [serverState, 0, true])}} // force repo state update(0 -> last update time doesn't matter)
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
                        disabled={isOptionDisabled(option, localRepoState)}
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

function selectIndex(localRepoState: StatusResult) {
  if(!isCommitBttDisabled(localRepoState)) return 0;
  if(localRepoState.ahead && localRepoState.behind) return 3;
  if(localRepoState.behind) return 2;
  return 1;
}

function isOptionDisabled(option: string, localRepoState: StatusResult) {
  if(option === "commit" && isCommitBttDisabled(localRepoState)) return true;
  if(option === "push" && (localRepoState.behind || !localRepoState.ahead)) return true;
  if(option === "merge" && !localRepoState.behind) return true;
  if(option === "merge and push" && !(localRepoState.ahead && localRepoState.behind)) return true;
  return false;
}

function isButtonGroupDisabled(localRepoState: StatusResult) {
  return !Boolean(
    localRepoState.ahead +
    localRepoState.behind +
    localRepoState.not_added.length +
    localRepoState.created.length +
    localRepoState.deleted.length +
    localRepoState.modified.length +
    localRepoState.renamed.length +
    localRepoState.staged.length
  ) || Boolean(localRepoState.conflicted.length);
}

function isCommitBttDisabled(localRepoState: StatusResult) {
  return !Boolean(
    localRepoState.not_added.length +
    localRepoState.created.length +
    localRepoState.deleted.length +
    localRepoState.modified.length +
    localRepoState.renamed.length +
    localRepoState.staged.length
  )
}