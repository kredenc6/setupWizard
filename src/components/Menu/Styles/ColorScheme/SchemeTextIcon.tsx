import React from "react";
import { makeStyles } from "@material-ui/core/styles";

interface Props {
  text: string;
  contrastText: string;
  background: string;
  active: boolean;
};

const useStyles = makeStyles({
  schemeTextLine: {
    textAlign: "center"
  },
  schemeTextIcon: ({ active, contrastText, background }: Partial<Props>) => {
    return {
      width: "1.7rem",
      height: "1.7rem",
      display: "inline-flex",
      justifyContent: "center",
      alignItems: "center",
      fontWeight: "bold",
      color: active ? background : contrastText,
      backgroundColor: active ? contrastText : "transparent",
      borderRadius: "50%"
    };
  }
});

export default function SchemeTextIcon({ text, contrastText, background, active }: Props) {
  const classes = useStyles({ contrastText, background, active });

  return(
    <p className={classes.schemeTextLine}>
      <span className={classes.schemeTextIcon}>
        {text}
      </span>
    </p>
  );
};
