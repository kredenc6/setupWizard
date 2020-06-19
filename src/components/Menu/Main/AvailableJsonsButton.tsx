import React from "react";
import { Badge, Button } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

interface Props {
  handleClick: () => void;
  jsonFileCount: number;
};

const useStyles = makeStyles({
  availableJsonBtt: {
    width: "100%"
  }
});

export default function AvailableJsonsButton ({ handleClick, jsonFileCount }: Props) {
  const classes = useStyles();

  return(
    <Badge badgeContent={jsonFileCount} color="error">
      <Button
        className={classes.availableJsonBtt}
        color="primary"
        disabled={!jsonFileCount}
        onClick={handleClick}
        variant="outlined"
      >
        Show jsons
      </Button>
    </Badge>
  );
};