import React, { useEffect, useState } from "react";
import { AlertProps } from "@material-ui/lab/Alert";
import MessageSnackBar from "../sharedComponents/MessageSnackBar";
import { SwState } from "../../interfaces/interfaces";

interface MessageProps {
  message: string;
  type: AlertProps["severity"];
};

export default function MessageHandler({ jsonFilesState, serverState }: SwState) {
  const [pendingMessages, setPendingMessage] = useState<MessageProps[]>([]);

  const handleClose = () => {
    setPendingMessage(prev => prev.filter((_, i) => i > 0));
  };

  useEffect(() => {
    return;
  },[jsonFilesState.fileStatus, serverState]);

  return(
    <>
      {pendingMessages[0] ?
          <MessageSnackBar
            closeCallback={handleClose}
            message={pendingMessages[0].message}
            type={pendingMessages[0].type} />
        :
          null
      }
    </>
  );
}

function createMessage(forState: string, state: any): MessageProps | null {
  switch(forState) {
    case "server": {
      const type = state === "offline" ? "warning" : "info";
      return { message: `Server is ${state}.`, type };
    }

    case "fileStatus": {
      return { message: `File is ${state}.`, type: "info" };
    }

    default: {
      console.warn("Creating message object failed.");
      return null;
    }
  }
}