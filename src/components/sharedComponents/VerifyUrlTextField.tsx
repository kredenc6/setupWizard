import React, { useEffect, useRef, useState } from "react";
import { TextFieldProps } from "@material-ui/core";
import { createStyles, makeStyles } from "@material-ui/core/styles";
import SwTextField from "./SwTextField";
import { SERVER_ADDRESS } from "../../initialStates/constants";

const VERIFICATION_DELAY = 2000;
const MIN_LENGTH_FOR_VERIF = 3;

interface Props {
  handleTextFieldChange: (value: string) => void;
  isNextInput?: boolean;
  isVerificationEnabled: boolean;
  webPrefix?: string;
};
type Verification = null | "OK" | "KO";

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

const VerifyUrlTextField = (props: Props & TextFieldProps) => {
  const {
    handleTextFieldChange,
    isNextInput,
    isVerificationEnabled,
    value,
    webPrefix,
    ...textFieldProps
  } = props;
  const [unprefixedValue, setUnprefixedValue] = useState( unprefixValue(webPrefix, value as string) );
  const [timeoutID, setTimeoutID] = useState(-1);
  const [sentToBeVerified, setSentToBeVerified] = useState(false);
  const [verification, setVerification] = useState<Verification>(null);
  const isVerifying = (sentToBeVerified || timeoutID !== -1) ? true : false;
  const classes = useStyles({ verifying: isVerifying });

  const handleChange = (value: string) => {
    setUnprefixedValue(value);
    const prefixedValue = prefixValue(webPrefix, value);
    handleTextFieldChange(prefixedValue);
    setVerification(null);
    if(timeoutID !== -1) window.clearTimeout(timeoutID);
    if(!isVerificationEnabled) return;
    if(value.length < MIN_LENGTH_FOR_VERIF) {
      setTimeoutID(-1);
      return;
    }
    
    setTimeoutID(window.setTimeout(() => {
      sendToVerify(value, setSentToBeVerified, setVerification, webPrefix);
      setTimeoutID(-1);
    }, VERIFICATION_DELAY));
  };

  const SwTextFieldRef = useRef<HTMLInputElement>(null);
  useEffect(() => { // re-verify on mount
    const value = SwTextFieldRef.current?.value || "";
    if(value.length >= MIN_LENGTH_FOR_VERIF && isVerificationEnabled) {
      sendToVerify(value, setSentToBeVerified, setVerification, webPrefix);
    }
  },[isVerificationEnabled, webPrefix]);

  useEffect(() => {
    return () => {
      if(timeoutID !== -1) clearTimeout(timeoutID);
    }
  },[timeoutID]);

  return(
    <SwTextField
      {...textFieldProps}
      className={verification ?
        verification === "OK" ? classes.valid : classes.invalid
        :
        classes.toBeVerified}
      inputAdornment={webPrefix}
      onChange={e => handleChange(e.target.value)}
      ref={SwTextFieldRef}
      value={isNextInput ? "" : unprefixedValue} />
  );
};

export default VerifyUrlTextField;

function unprefixValue(prefix: string | undefined, value: string) {
  if(prefix && value.startsWith(prefix)) return value.substring(prefix.length);
  return value;
}

export function prefixValue(prefix: string | undefined, value: string) {
  return value.length > 0 ?
    (prefix || "") + value
    :
    value; // don't prefix an empty value - textField removal logic is based on an empty string
}

function sendToVerify(
  url: string,
  setSentToBeVerified: React.Dispatch<React.SetStateAction<boolean>>,
  setVerification: React.Dispatch<React.SetStateAction<Verification>>,
  webPrefix?: string
  ) {
    const prefixedAndEncoded = `${webPrefix || ""}${encodeURI(url)}`;
    console.log(`${prefixedAndEncoded} was sent to be verified.`);
    setSentToBeVerified(true);

    fetch(`${SERVER_ADDRESS}/verify`, { method: "POST", headers: { "Content-Type": "text/plain" }, body: prefixedAndEncoded})
      .then(response => {
        response.statusText === "OK" ? setVerification("OK") : setVerification("KO");
        setSentToBeVerified(false);
      })
      .catch(err => {
        console.log(err.message);
        setSentToBeVerified(false);
        setVerification(null);
      });
}