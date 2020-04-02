import React from "react";
import SliderNode from "./SliderNode/SliderNode";
import classes from "./slider.module.css";

interface Props {
  menus: Array<
    { 
      description: string,
      component: JSX.Element
    }
  >;
  mediaModules: {};
}

const Slider = ({ menus, mediaModules }: Props) => {
  const dotsAndConnectors = menus.map((menu, i) => {
    if(i !== menus.length - 1) {
      return(
        <React.Fragment key={ menu.description }>
          <SliderNode description={ menu.description } />
          <div className={ classes.sliderDotConnector }></div>
        </React.Fragment>
      );
    }
    return(
      <SliderNode key={ menu.description } description={ menu.description } />
    );
  });
  return(
    <section className={ classes.slider }>
      { dotsAndConnectors }
    </section>
  );
};

export default Slider;