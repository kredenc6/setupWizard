import React from "react";

interface Props {
  text: string;
  contrastText: string;
};

const ColorText = ({ text, contrastText }: Props) => {
  return(
    <p style={{ color: contrastText, fontWeight: 700 }}>
      {text}
    </p>
  );
};

export default ColorText;