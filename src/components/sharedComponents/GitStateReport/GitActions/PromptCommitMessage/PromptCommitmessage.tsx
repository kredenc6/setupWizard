import React from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField } from '@material-ui/core';

interface Props {
  handleChange: (value: string) => void;
  open: boolean;
  sendCommit: () => void;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  value: string;
};

export default function PromptCommitMessage({ handleChange, open, sendCommit, setOpen, value }: Props) {

  const handleClose = () => {
    handleChange("");
    setOpen(false);
  };

  const handleCommit = () => {
    sendCommit();
    handleClose();
  }

  return (
    <div>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Commit</DialogTitle>
        <DialogContent>
          <DialogContentText>
            To commit to the local repo, please enter a commit message here. Empty string won't allow the commit.
          </DialogContentText>
          <TextField
            autoFocus
            fullWidth
            id="name"
            label="commit message"
            margin="dense"
            onKeyUp={e => {
              if(e.key === "Enter") {
                handleCommit();
              }
              if(e.key === "Escape") {
                handleClose();
              }
            }}
            onChange={e => handleChange(e.target.value)}
            value={value} />
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleClose}
            color="primary">
            Cancel
          </Button>
          <Button
            onClick={handleCommit}
            color="primary">
            Commit
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}