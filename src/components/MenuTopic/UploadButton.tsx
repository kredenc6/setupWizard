import React from "react";
import { Button, InputLabel, makeStyles } from "@material-ui/core";

interface Props {
  handleLoadingJsons: (value: FileList) => void;
  text: string;
};

const styles = {
  uploadLabel: {
    padding: ".5rem",
    "&:hover": {
      cursor: "pointer"
    }
  }
};
const useStyles = makeStyles(styles);

const UploadButton = ({ handleLoadingJsons, text }: Props) => {
  const classes = useStyles();
  return (
    <Button color="primary" variant="outlined">
      <InputLabel className={classes.uploadLabel}>
        {text}
        <input
          accept=".json"
          multiple
          onChange={e => {
            if(e.target.files) handleLoadingJsons(e.target.files);
            else console.warn("No files accepted.")
          }}
          style={{ display: "none" }}
          type="file" />
      </InputLabel>
    </Button>
  );
};

export default UploadButton;