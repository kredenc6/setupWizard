import React from "react";
import classes from "./sliderNode.module.css";

interface Props {
  description: string;
}

const SliderNode = ({ description }: Props) => {
  return(
    <div className= { classes.sliderNode }>
      <div className={ classes.sliderDot }></div>
      <p className={ classes.sliderDotDescription }>{ description }</p>
    </div>
  );
};

export default SliderNode;