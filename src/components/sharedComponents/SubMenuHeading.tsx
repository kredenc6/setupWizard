import React from "react";
import { Typography, TypographyProps } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";

interface Props extends TypographyProps {
  text: string;
};

const StyledHeading = withStyles(({ spacing, typography }) => ({
  root: {
    margin: `${spacing(1)}px ${spacing(2)}px 0`,
    fontWeight: typography.fontWeightLight
  }
}))(Typography);

const SubMenuHeading = (props: Props) => {
  const { text, ...typographyProps } = props;

  return <StyledHeading align="center" children={text} variant="h4" {...typographyProps} />;
};

export default SubMenuHeading;