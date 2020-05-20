import React from "react";
import { Button, InputLabel } from "@material-ui/core";

interface Props {
  childClass: string;
  handleManualJsonLoading: (value: FileList) => void;
  text: string;
};

const UploadButton = ({ childClass, handleManualJsonLoading, text }: Props) => {
  return (
    <Button>
      <InputLabel className={childClass}>
        {text}
        <input
          accept=".json"
          multiple
          onChange={e => {
            if(e.target.files) handleManualJsonLoading(e.target.files);
            else console.warn("No files accepted.")
          }}
          style={{ display: "none" }}
          type="file" />
      </InputLabel>
    </Button>
  );
};

export default UploadButton;