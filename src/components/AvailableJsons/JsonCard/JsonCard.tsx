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

const useStyles = makeStyles(theme =>
  createStyles({
    card: {
      position: "relative",
      minWidth: `${theme.typography.fontSize * 20}px`,
      margin: theme.spacing(1),
      border: ({ active, selected }: { active: boolean, selected: boolean}) => {
        let line = "1px solid ";
        let color = theme.palette.grey[200];

        if(active) {
          color = theme.palette.primary.main;
        } else
        if(selected) {
          color = theme.palette.secondary.main;
        }
        return `${line}${color}`;
      },
      "&:hover": {
        cursor: "pointer",
        boxShadow: theme.shadows[4]
      }
    }
  })
);

const JsonCard = ({ active, handleCardClick, handleCardDblClick, fileGitState, jsonAppTopic, selected }: Props) => {
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

export default JsonCard;