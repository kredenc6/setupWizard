import React from "react";
import { makeStyles } from "@material-ui/core/styles";

interface Props {
  status: string;
};

const useStyles = makeStyles({
  verificationStatus: {
    textAlign: "center"
  }
});

const VerificationStatus = ({ status }: Props) => {
  const classes = useStyles();
  return(
    <p className={classes.verificationStatus}>
      Verification is {status}.
    </p>
  );
};

export default VerificationStatus;