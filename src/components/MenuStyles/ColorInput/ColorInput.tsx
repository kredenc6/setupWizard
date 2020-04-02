import React from "react";

interface Props {
  className: string;
  id: string;
  bgColor: string;
  text: string;
}

const ColorInput = ({ className, id, bgColor, text }: Props) => {
  return(
    <label htmlFor={id}>
      <div className={className} style={{ backgroundColor: bgColor }}></div>
      {text}
      <input id={id} type="color" style={{ display: "none" }} />
    </label>
  );
};

export default ColorInput;