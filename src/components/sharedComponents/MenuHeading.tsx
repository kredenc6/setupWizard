import React from "react";
import { Typography, TypographyProps } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import capitalizeFirstLetter from "../../miscellaneous/capitalizeFirstLetter";

interface Props extends TypographyProps {
  text: string;
};

const StyledHeading = withStyles(({ spacing }) => ({
  root: {
    marginBottom: spacing(3)
  }
}))(Typography);

const MenuHeading = (props: Props) => {
  const { text, ...typographyProps } = props;

  return <StyledHeading align="center" children={capitalizeFirstLetter(text)} variant="h2" {...typographyProps} />;
};

export default MenuHeading;