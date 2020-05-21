import React from "react";
import { Box, Checkbox, FormControlLabel } from "@material-ui/core";
import { createStyles, makeStyles } from "@material-ui/core/styles";
import { GitOpt } from "../../../interfaces/gitInterfaces";
import { StatusResult } from "../../../interfaces/simpleGit";

interface Props {
  gitOptions: GitOpt;
  repoState: StatusResult | null;
  setGitOptions: React.Dispatch<React.SetStateAction<GitOpt>>;
};

const useStyles = makeStyles(theme =>
  createStyles({
    gitOptionsWrapper: {
      minWidth: `${theme.typography.fontSize * 15}px`,
      display: "flex",
      justifyContent: "center",
      border: `1px solid ${theme.palette.primary.main}`,
      borderTop: "none",
      borderBottomLeftRadius: theme.shape.borderRadius,
      borderBottomRightRadius: theme.shape.borderRadius
    }
  })
);

export default function GitOptions({ gitOptions, repoState, setGitOptions }: Props) {
  const classes = useStyles();

  const handleCheck = (name: string, checked: boolean) => {
    if(name === "push" && checked) {
      setGitOptions({ commit: true, push: true });
      return;
    }
    if(name === "commit" && !checked) {
      setGitOptions({ commit: false, push: false });
      return;
    }
    setGitOptions(prev => ({ ...prev, [name]: checked }));
  }

  return(
    <Box className={classes.gitOptionsWrapper}>
      <FormControlLabel
        control={
          <Checkbox
            checked={gitOptions.commit}
            disabled={!repoState || !!repoState.conflicted.length}
            onChange={({ target }) => handleCheck(target.name, target.checked)}
            name="commit"
            color="secondary"
          />
        }
        label="commit"
      />
      <FormControlLabel
        control={
          <Checkbox
            checked={gitOptions.push}
            disabled={!repoState || !!repoState.conflicted.length || !!repoState.behind}
            onChange={({ target }) => handleCheck(target.name, target.checked)}
            name="push"
            color="secondary"
          />
        }
        label="push"
      />
    </Box>
  );
}