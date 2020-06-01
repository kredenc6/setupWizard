import React from "react";
import { Typography, TypographyProps } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import capitalizeFirstLetter from "../../miscellaneous/capitalizeFirstLetter";

interface Props extends TypographyProps {
  text: string;
};

// const StyledHeading = withStyles(({ spacing }) => ({
//   root: {
//     marginBottom: spacing(2)
//   }
// }))(Typography);

export default function MenuHeading(props: Props) {
  const { text, ...typographyProps } = props;
  
  return <Typography align="center" children={capitalizeFirstLetter(text)} variant="h2" {...typographyProps} />;
};