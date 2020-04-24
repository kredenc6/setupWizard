import React, { useState } from "react";
import { TextFieldProps } from "@material-ui/core";
import { createStyles, makeStyles } from "@material-ui/core/styles";
import SwTextField from "./SwTextField";
import { Verification } from "../SelectedModule/StringArrayInput/StringArrayInput";

const VERIFICATION_DELAY = 2000;
const MIN_LENGTH_FOR_VERIF = 4;

interface Props {
  handleTextFieldChange: (value: string) => void;
};

type SendToVerify = (
  url: string,
  setSentToBeVerified: React.Dispatch<React.SetStateAction<boolean>>,
  setVerification: React.Dispatch<React.SetStateAction<Verification>>
) => void;

const useStyles = makeStyles(({ palette }) => 
  createStyles({
    valid: {
      "& label": {
        "&::after": {
          content: `"  valid"`,
          color: `${palette.success.dark}`,
          fontWeight: 700,
          textShadow: `0 0 20px ${palette.success.light}`
        }
      },
      "& span": {
        "&::after": {
          content: `"  valid"`,
          fontWeight: 700
        }
      }
    },
    invalid: {
      "& label": {
        "&::after": {
          content: `"  invalid"`,
          color:  `${palette.error.dark}`,
          fontWeight: 700,
          textShadow: `0 0 20px ${palette.error.light}`,
        }
      },
      "& span": {
        "&::after": {
          content: `"  invalid"`,
          fontWeight: 700
        }
      }
    },
    toBeVerified: ({ verifying }: { verifying: boolean }) => ({
      "& .MuiInputLabel-outlined.MuiInputLabel-shrink": {
        "&::after": {
          content: verifying ? `"  ...verifying"` : `"  verifiable"`,
          color:  `${palette.grey[500]}`
        }
      },
      "& span": {
        "&::after": {
          content: verifying ? `"  ...verifying"` : `"  verifiable"`,
          fontWeight: 700
        }
      }
    })
  })
);

const sendToVerify: SendToVerify = (url, setSentToBeVerified, setVerification) => {
  const prefixedAndEncoded = `https://${encodeURI(url)}`;
  console.log(`${prefixedAndEncoded} send to be verified.`);
  setSentToBeVerified(true);

  fetch("https://damp-bayou-55824.herokuapp.com/", { method: "POST", headers: { "Content-Type": "text/plain" }, body: prefixedAndEncoded})
  .then(res => res.text())
  .then(text => {
    setSentToBeVerified(false);
    if(text === "OK") setVerification("OK");
    else setVerification("KO");
  })
  .catch(err => {
    console.log(err.message);
    setSentToBeVerified(false);
    setVerification(null);
  });
};

const VerifyUrlTextField = (props: Props & TextFieldProps) => {
  const {
    handleTextFieldChange,
    ...textFieldProps
  } = props;
  const [timeoutID, setTimeoutID] = useState(-1);
  const [sentToBeVerified, setSentToBeVerified] = useState(false);
  const [verification, setVerification] = useState<Verification>(null);
  const isVerifying = (sentToBeVerified || timeoutID !== -1 ) ? true : false;
  const classes = useStyles({ verifying: isVerifying });

  const handleChange = (value: string) => {
    handleTextFieldChange(value);
    setVerification(null);
    if(timeoutID !== -1) window.clearTimeout(timeoutID);
    if(value.length < MIN_LENGTH_FOR_VERIF) {
      setTimeoutID(-1);
      return;
    }
    
    setTimeoutID(window.setTimeout(() => {
      sendToVerify(value, setSentToBeVerified, setVerification);
      setTimeoutID(-1);
    }, VERIFICATION_DELAY));
  };

  return(
    <SwTextField
      {... textFieldProps}
      className={verification ?
        verification === "OK" ? classes.valid : classes.invalid
        :
        classes.toBeVerified}
      onChange={e => handleChange(e.target.value)} />
  );
};

export default VerifyUrlTextField;