import React from "react";
import { Card, CardContent, Typography } from "@material-ui/core";
import { createStyles, makeStyles } from "@material-ui/core/styles";
import FileGitState from "../../sharedComponents/FileGitSate";

interface Props {
  active: boolean;
  handleCardClick: (fileName: string) => void;
  handleCardDblClick: (fileName: string) => void;
  fileGitState: string[];
  jsonAppTopic: string;
  selected: boolean;
};

const useStyles = makeStyles(({ palette, spacing, shadows }) =>
  createStyles({
    card: {
      position: "relative",
      width: "75%",
      margin: spacing(1),
      border: ({ active, selected }: { active: boolean, selected: boolean}) => {
        let line = "1px solid ";
        let color = palette.grey[200];

        if(active) {
          color = palette.primary.main;
        } else
        if(selected) {
          color = palette.secondary.main;
        }
        return `${line}${color}`;
      },
      "&:hover": {
        cursor: "pointer",
        boxShadow: shadows[4]
      }
    }
  })
);

export default function JsonCard({ active, handleCardClick, handleCardDblClick, fileGitState, jsonAppTopic, selected }: Props) {
  const classes = useStyles({ active, selected });
  return(
    <Card
      className={classes.card}
      key={jsonAppTopic}
      onClick={() => handleCardClick(jsonAppTopic)}
      onDoubleClick={() => handleCardDblClick(jsonAppTopic)}
    >
      <CardContent>
        <Typography align="center" variant="h6">{jsonAppTopic}</Typography>
        <FileGitState fileGitState={fileGitState} />
      </CardContent>  
    </Card>
  );
};
