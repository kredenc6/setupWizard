import React from "react";
import { Typography } from "@material-ui/core";

const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "November", "December"];

interface Props {
  timeStamp: number;
};

export default function LastUpdate({ timeStamp }: Props) {
  const lastUpdate = new Date(timeStamp);
  const month = lastUpdate.getMonth();
  const date = lastUpdate.getDate();
  const hours = `0${lastUpdate.getHours()}`.slice(-2);
  const minutes = `0${lastUpdate.getMinutes()}`.slice(-2);

  return (
    <Typography align="center">
      {`Last repo update: ${date}. ${MONTHS[month]} ${hours}:${minutes}`}
    </Typography>
  );
}