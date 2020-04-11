import React from "react";
import { makeStyles, createStyles } from "@material-ui/core/styles";
import { Fab, Slider } from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";
import { SchemeObj } from "../../../interfaces/interfaces";

interface Props {
  schemeObj: SchemeObj;
  className: string;
};

const styles = createStyles(
  {
    ui1Wrapper: {
      alignSelf: "center",
      width: "40vh",
      height: "80%"
    },
    ui1Header: {
      display: "flex",
      flexFlow: "row wrap",
      height: "13%",
      color: (schemeObj: SchemeObj) => determineColor(schemeObj, "primary", "main"),
      backgroundColor: (schemeObj: SchemeObj) => schemeObj.primary.main
    },
    ui1HeaderLine: {
      width: "100%",
      height: "22%",
      backgroundColor: (schemeObj: SchemeObj) => schemeObj.primary.dark
    },
    ui1Text: {
      paddingLeft: "2vh",
      fontSize: "2.5vh"
    },
    ui1TopSection: {
      position: "relative",
      height: "40%",
      backgroundColor: "#E1E2E1"
    },
    ui1BottomSection: {
      position: "relative",
      height: "47%",
      backgroundColor: "#F5F5F6"
    },
    ui1AddButton: {
      position: "absolute",
      bottom: "2.5vh",
      right: "2.5vh",
      width: "5.5vh",
      height: "5.5vh",
      fontSize: "4vh",
      color: (schemeObj: SchemeObj) => determineColor(schemeObj, "secondary", "main"),
      backgroundColor: (schemeObj: SchemeObj) => schemeObj.secondary.main,
      "&:hover": {
        color: (schemeObj: SchemeObj) => determineColor(schemeObj, "secondary", "dark"),
        backgroundColor: (schemeObj: SchemeObj) => schemeObj.secondary.dark,
      }
    },
    ui1Slider: {
      position: "absolute",
      top: "2.5vh",
      right: "2.5vh",
      width: "30%",
      color: (schemeObj: SchemeObj) => schemeObj.secondary.main
    }
  }
);
const useStyles = makeStyles(styles);

const determineColor = (schemeObj: SchemeObj, scheme: "primary" | "secondary", shade: "light" | "main" | "dark") => {
  const overrideColor = schemeObj.textColorOverride[scheme];
  const color = schemeObj[scheme].contrastText[shade];
  return overrideColor ? overrideColor : color;
};

const UI1 = ({ schemeObj, className }: Props) => {
  const classes = useStyles(schemeObj);
  return(
    <div className={`${className} ${classes.ui1Wrapper}`}>
      <header className={classes.ui1Header}>
        <div className={classes.ui1HeaderLine}></div>
        <p className={classes.ui1Text}>Text</p>
      </header>
      <section className={classes.ui1TopSection}>
        <Fab className={classes.ui1AddButton}><AddIcon fontSize="inherit" /></Fab>
      </section>
      <section className={classes.ui1BottomSection}>
        <Slider className={classes.ui1Slider} defaultValue={40}/>
      </section>
    </div>
  );
};

export default UI1;