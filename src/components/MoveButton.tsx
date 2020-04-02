import React from "react";
import { Button } from "@material-ui/core";

interface Props {
  setMenuPosition: React.Dispatch<React.SetStateAction<number>>;
  changePositionBy: 1 | -1;
  value: string;
  isDisabled: boolean;
  color: "inherit" | "primary" | "secondary" | "default" | undefined;
}

const MoveButton = ({ setMenuPosition, changePositionBy, value, isDisabled, color }: Props) => {
  return(
    <Button
      children={ value }
      onClick={ () => setMenuPosition(prevPosition => prevPosition + changePositionBy) }
      disabled={ isDisabled }
      color={ color }
    />
  );
};

export default MoveButton;