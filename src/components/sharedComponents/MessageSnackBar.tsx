import React, { useState, useEffect } from "react";
import { Snackbar } from "@material-ui/core";
import MuiAlert, { AlertProps } from "@material-ui/lab/Alert";

interface Props {
  message: string;
  closeCallback?: () => void;
  type: AlertProps["severity"];
};

const Alert = (props: AlertProps) => <MuiAlert variant="filled" {...props} />;

export default function MessageSnackBar({ message, closeCallback, type }: Props) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(true);
  },[message]);

  const handleClose = (event?: React.SyntheticEvent, reason?: string) => {
    if(reason === "clickaway") return;
    setOpen(false);
    if(closeCallback) closeCallback();
  };

  return(
    // <Snackbar autoHideDuration={6000} message={message} onClose={handleClose} open={open} />
    <Snackbar autoHideDuration={6000} message={message} onClose={handleClose} open={open}>
      <Alert onClose={handleClose} severity={type}>{message}</Alert>
    </Snackbar>
  );
}
