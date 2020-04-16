import React from "react";
import { Checkbox, FormControlLabel, TextField, withStyles } from "@material-ui/core";
import { JSONResultObj } from "../../../interfaces/interfaces";

interface Props {
  appTopic: string;
  jsonObj: JSONResultObj;
  medium: "audio" | "books"| "videos";
  setJsonObj: React.Dispatch<React.SetStateAction<JSONResultObj>>;
};

const StyledTextField = withStyles(({ spacing }) => ({
  root: {
    // width: "80%",
    marginTop: spacing(2)
  }
}))(TextField);

const createMediaJsonObj = (appTopic: string) => {
  return [
    {
      "source": "source_placeholder",
      "show_in_app": true,
      "queries": [
        appTopic
      ],
      "blocked_tracks": []
    }
  ];
};

const Medium = ({ appTopic, jsonObj, medium, setJsonObj }: Props) => {
  const TextFieldComponents = Object.entries(jsonObj[medium][0])
    .map(([key, value]) => {
      if(typeof value === "string" || Array.isArray(value)) {
        return <StyledTextField variant="outlined" label={key} key={key} />
      }
      if(typeof value === "boolean") {
        return <FormControlLabel
        control={
          <Checkbox
            defaultChecked={true}
            name={key} />}
        key={key}
        label={key} />
      }
      return null;
    });
  return(
    <div>
      {TextFieldComponents}
    </div>
  );
};

export default Medium;