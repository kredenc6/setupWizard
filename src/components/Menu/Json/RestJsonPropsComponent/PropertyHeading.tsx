import React from "react";
import { Typography } from "@material-ui/core";

interface Props {
  text: string;
};

const PropertyHeading = ({ text }: Props) => {
  return(
    <Typography children={text} variant="h6" />
  );
};

export default PropertyHeading;