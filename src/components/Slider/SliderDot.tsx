import React from "react";

interface Props {
  description: string;
}

const SliderDot = ({ description }: Props) => {
  return(
    <div className="sliderDot" style={ { backgroundColor: "grey" }}>
      <p className="sliderDotDesc">{ description }</p>
    </div>
  );
};

export default SliderDot;