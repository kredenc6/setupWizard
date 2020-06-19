import React, { useState, useEffect } from "react";
import { Snackbar } from "@material-ui/core";
import MuiAlert, { AlertProps } from "@material-ui/lab/Alert";
import { SHOW_PENDING_MESSAGE_INTERVAL } from "../../initialStates/constants";
import { MessageProps } from "../../interfaces/variousInterfaces";
import { SWActions } from "../../sWReducer/sWReducer";

interface Props {
  dispatch: React.Dispatch<SWActions>;
  message: MessageProps | undefined;
};

const Alert = (props: AlertProps) => <MuiAlert variant="filled" {...props} />;

export default function MessageSnackBar({ dispatch, message }: Props) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if(message) setOpen(true);

    return () => setOpen(false);
  },[message]);

  const handleClose = (event?: React.SyntheticEvent, reason?: string) => {
    if(reason === "clickaway") return;
    setOpen(false);
    setTimeout(() => dispatch({ type: "messageDelivered" })); // timeout to give it time to properly animate
  };

  return(
    <Snackbar autoHideDuration={SHOW_PENDING_MESSAGE_INTERVAL} message={message?.text} onClose={handleClose} open={open}>
      <Alert onClose={handleClose} severity={message?.type}>{message?.text}</Alert>
    </Snackbar>
  );
}
