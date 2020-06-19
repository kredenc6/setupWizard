import React, { useEffect, useRef, useState } from "react";
import { Button, ButtonGroup, ClickAwayListener, Grid, Grow, IconButton, MenuItem, MenuList, Paper, Popper, Tooltip }
  from "@material-ui/core";
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import SyncIcon from '@material-ui/icons/Sync';
import PromptCommitMessage from "./PromptCommitMsg/PromptCommitMsg";
import { handleCommit, handleMerge, handlePush, refreshRepoState } from "../../../../gitFunctions/gitFunctions";
import { ServerIs } from "../../../../interfaces/variousInterfaces";
import { StatusResult } from "../../../../interfaces/simpleGit";
import { SWActions } from "../../../../sWReducer/sWReducer";
import { FilesState, FileStatus } from "../../../../interfaces/fileInterfaces";

interface Props {
  dispatch: React.Dispatch<SWActions>;
  jsonFilesState: FilesState;
  serverState: ServerIs;
};

const OPTIONS = ["commit", "push", "merge", "merge and push"];

export default function SplitButton({ dispatch, jsonFilesState, serverState }: Props) {
  const localRepoState = jsonFilesState.localRepoState!;
  const fileStatus = jsonFilesState.fileStatus;
  const [openButtonGroup, setOpenButtonGroup] = useState(false);
  const [openCommitPrompt, setOpenCommitPrompt] = useState(false);
  const [commitMessage, setCommitMessage] = useState("");
  const anchorRef = useRef<HTMLDivElement>(null);
  const [selectedIndex, setSelectedIndex] = useState(selectIndex(localRepoState));
  const conflicted = Boolean(localRepoState?.conflicted.length);

  const handleClick = async () => {
    if(OPTIONS[selectedIndex] === "commit") {
      dispatch({ type: "changeJsonFilesState", payload: { fileStatus: "being commited" } });
      const fileStatus = await handleCommit({ commitMessage, dispatch, localRepoState });
      dispatch({ type: "changeJsonFilesState", payload: { fileStatus } });
    }

    if(OPTIONS[selectedIndex] === "push") {
      dispatch({ type: "changeJsonFilesState", payload: { fileStatus: "being pushed" } });
      const fileStatus = await handlePush(dispatch);
      dispatch({ type: "changeJsonFilesState", payload: { fileStatus } });
    }

    if(OPTIONS[selectedIndex] === "merge") {
      // TODO add and implement merge fileStatus for better interactivity 
      await handleMerge(dispatch);
    }

    if(OPTIONS[selectedIndex] === "merge and push") {
      if( await handleMerge(dispatch) ) {
        dispatch({ type: "changeJsonFilesState", payload: { fileStatus: "being pushed" } });
        const fileStatus = await handlePush(dispatch);
        dispatch({ type: "changeJsonFilesState", payload: { fileStatus } });
      }
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
    // don't close on the anchor element click
    if (anchorRef.current && anchorRef.current.contains(event.target as HTMLElement)) return;
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
        <ButtonGroup
          color="primary"
          disabled={isButtonGroupDisabled(localRepoState, fileStatus)}
          ref={anchorRef} 
          variant="contained"
        >
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
            onClick={() => refreshRepoState(dispatch)}
          >
            <SyncIcon />
          </IconButton>
        </Tooltip>
        <Popper anchorEl={anchorRef.current} disablePortal open={openButtonGroup} role={undefined} style={{ zIndex: 1 }} transition>
          {({ TransitionProps, placement }) => (
            <Grow
              {...TransitionProps}
              style={{
                transformOrigin: placement === 'bottom' ? 'center top' : 'center bottom'
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

function isButtonGroupDisabled(localRepoState: StatusResult, fileStatus: FileStatus) {
  return !Boolean(
    localRepoState.ahead +
    localRepoState.behind +
    localRepoState.not_added.length +
    localRepoState.created.length +
    localRepoState.deleted.length +
    localRepoState.modified.length +
    localRepoState.renamed.length +
    localRepoState.staged.length
  ) || Boolean(localRepoState.conflicted.length)
    || fileStatus !== "ready";
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