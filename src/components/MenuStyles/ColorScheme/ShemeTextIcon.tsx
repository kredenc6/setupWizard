import React from "react";
import { makeStyles, createStyles } from "@material-ui/core/styles";

interface Props {
  text: string;
  contrastText: string;
  background: string;
  active: boolean;
};

const styles = createStyles(
  {
    schemeTextLine: {
      textAlign: "center"
    },
    schemeTextIcon: ({ active, contrastText, background }: Props) => {
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
  }
);

const useStyles = makeStyles(styles);

const SchemeTextIcon = ({ text, contrastText, background, active }: Props) => {
  const classes = useStyles({ text, contrastText, background, active });

  return(
    <p className={classes.schemeTextLine}>
      <span className={classes.schemeTextIcon}>
        {text}
      </span>
    </p>
  );
};

export default SchemeTextIcon;