import React from "react";
import { makeStyles, createStyles } from "@material-ui/core/styles";
import { Fab, Slider } from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";
import { ColorSchemeInt } from "../../../interfaces/interfaces";

interface Props {
  schemeObj: ColorSchemeInt;
};

const useStyles = makeStyles(({ spacing }) =>
  createStyles(
    {
      ui1Wrapper: {
        alignSelf: "center",
        maxWidth: "300px",
        maxHeight: "500px",
        width: "35vh",
        height: "70%",
        margin: spacing(1)
      },
      ui1Header: {
        display: "flex",
        flexFlow: "row wrap",
        height: "13%",
        color: (schemeObj: ColorSchemeInt) => determineColor(schemeObj, "primary", "main"),
        backgroundColor: (schemeObj: ColorSchemeInt) => schemeObj.primary.main
      },
      ui1HeaderLine: {
        width: "100%",
        height: "22%",
        backgroundColor: (schemeObj: ColorSchemeInt) => schemeObj.primary.dark
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
        color: (schemeObj: ColorSchemeInt) => determineColor(schemeObj, "secondary", "main"),
        backgroundColor: (schemeObj: ColorSchemeInt) => schemeObj.secondary.main,
        "&:hover": {
          color: (schemeObj: ColorSchemeInt) => determineColor(schemeObj, "secondary", "dark"),
          backgroundColor: (schemeObj: ColorSchemeInt) => schemeObj.secondary.dark,
        }
      },
      ui1Slider: {
        position: "absolute",
        top: "2.5vh",
        right: "2.5vh",
        width: "30%",
        color: (schemeObj: ColorSchemeInt) => schemeObj.secondary.main
      }
  })
);

const determineColor = (schemeObj: ColorSchemeInt, scheme: "primary" | "secondary", shade: "light" | "main" | "dark") => {
  const overrideColor = schemeObj.textColorOverride[scheme];
  const color = schemeObj[scheme].contrastText[shade];
  return overrideColor ? overrideColor : color;
};

const UI1 = ({ schemeObj }: Props) => {
  const classes = useStyles(schemeObj);
  return(
    <div className={classes.ui1Wrapper}>
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