import React from "react";
import { makeStyles } from "@material-ui/core/styles";


const styles = {
  void0: {
    fill: "#F5F5F6"
  },
  opacity26: {
    opacity: 26
  },
  title: {
    fontFamily: "Roboto Mono",
    fontSize: "24px"
  },
  pColor: {
    fill: "#7bb241"
  },
  ptColor: {
    fill: "#000000"
  },
  ptColorStroke: {
    stroke: "#000000"
  },
  pColorLight: {
    fill: "#ade470"
  },
  pColorDark: {
    fill: "#4a820c"
  },
  ptColorLight: {
    fill: "#000000"
  },
  ptColorDark: {
    fill: "#ffffff"
  },
  sColor: {
    fill: "#673ab7"
  },
  stColor: {
    fill: "#ffffff"
  },
  stColorStroke: {
    stroke: "#ffffff"
  },
  sColorLight: {
    fill: "#9a67ea"
  },
  sColorDark: {
  fill: "#320b86"
  },
  fabStroke: {
    fill: "none",
    strokeWidth: 3,
    strokeMiterlimit: 10
  }
};

const useStyles = makeStyles(styles);

const UI2 = () => {
  const classes = useStyles();
  return (
    <div style={{ width: "30vh", height: "80vh" }}>
      <svg version="1.1" xmlns="http://www.w3.org/2000/svg">
        <g>
          <rect x="0.5" y="267.2" className={classes.void0} width="363.6" height="379.8"></rect>
          <rect x="229.7" y="418.7" className={classes.opacity26} width="118.2" height="2"></rect>
          <rect x="229.7" y="418.7" className={classes.sColor} width="70.7" height="2"></rect>
          <path className={classes.sColor} d="M300.5,415c-2.7,0-4.9,2.2-4.9,4.9c0,2.7,2.2,4.9,4.9,4.9c2.7,0,4.9-2.2,4.9-4.9 C305.5,417.2,303.3,415,300.5,415"></path>
          <rect x="0.5" y="89.4" className="void-2" width="363.6" height="242.4"></rect>
          <circle className={classes.sColor} cx="322.6" cy="331.5" r="25.4"></circle>
          <line className={`${classes.fabStroke} ${classes.ptColorStroke} ${classes.stColorStroke}`} x1="322.6" y1="318.5" x2="322.6" y2="343.7"></line>
          <line className={`${classes.fabStroke} ${classes.ptColorStroke} ${classes.stColorStroke}`} x1="335.2" y1="331.1" x2="310" y2="331.1"></line>
          <rect x="0.5" y="0.5" className={classes.pColorDark} width="363.6" height="24.2"></rect>
          <rect x="0.5" y="24.8" className={classes.pColor} width="363.6" height="64.6"></rect>
          <text transform="matrix(1 0 0 1 32.217 65.1794)" className={`${classes.ptColor} ${classes.title}`}>Text</text>
        </g>
      </svg>
      </div>
  );
};

export default UI2;