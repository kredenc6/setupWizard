import React from "react";
import { makeStyles, createStyles } from "@material-ui/core/styles";
import { Fab, Slider } from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";
import { ColorObj } from "../../../interfaces/interfaces";

interface Props {
  colorObj: ColorObj;
  className: string;
};

const styles = createStyles(
  {
    ui1Wrapper: {
      alignSelf: "center",
      width: "40vh",
      height: "70vh"
    },
    ui1Header: {
      display: "flex",
      flexFlow: "row wrap",
      height: "13%",
      color: (colorObj: ColorObj) => determineColor(colorObj, "primary", "main"),
      backgroundColor: (colorObj: ColorObj) => colorObj.primary.main
    },
    ui1HeaderLine: {
      width: "100%",
      height: "22%",
      backgroundColor: (colorObj: ColorObj) => colorObj.primary.dark
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
      color: (colorObj: ColorObj) => determineColor(colorObj, "secondary", "main"),
      backgroundColor: (colorObj: ColorObj) => colorObj.secondary.main,
      "&:hover": {
        color: (colorObj: ColorObj) => determineColor(colorObj, "secondary", "dark"),
        backgroundColor: (colorObj: ColorObj) => colorObj.secondary.dark,
      }
    },
    ui1Slider: {
      position: "absolute",
      top: "2.5vh",
      right: "2.5vh",
      width: "30%",
      color: (colorObj: ColorObj) => colorObj.secondary.main
    }
  }
);
const useStyles = makeStyles(styles);

const determineColor = (colorObj: ColorObj, scheme: "primary" | "secondary", shade: "light" | "main" | "dark") => {
  const overrideColor = colorObj.textColorOverride[scheme];
  const color = colorObj[scheme].contrastText[shade];
  return overrideColor ? overrideColor : color;
};

const UI1 = ({ colorObj, className }: Props) => {
  const classes = useStyles(colorObj);
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