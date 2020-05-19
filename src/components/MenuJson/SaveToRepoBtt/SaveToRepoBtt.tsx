import React from "react";
import { Button } from "@material-ui/core";
import { saveJson } from "../../../fileFunctions/fileFunctions";
import { SERVER_ADDRESS } from "../../../SetupWizard";
import { JsonResultObj } from "../../../interfaces/interfaces";

interface Props {
  jsonObj: JsonResultObj;
};

export default function SaveButton({ jsonObj }: Props) {
  return(
    <Button
      children={`Save to repo as ${jsonObj.app_topic}.json`}
      color="primary"
      onClick={() => saveJson(SERVER_ADDRESS, jsonObj, success => console.dir(success))}
      variant="contained" />
  );
};