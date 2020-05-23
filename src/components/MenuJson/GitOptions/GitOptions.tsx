import React from "react";
import { Box, Checkbox, FormControlLabel } from "@material-ui/core";
import { createStyles, makeStyles } from "@material-ui/core/styles";
import { GitOpt } from "../../../interfaces/gitInterfaces";
import { StatusResult } from "../../../interfaces/simpleGit";

interface Props {
  disabled: boolean;
  gitOptions: GitOpt;
  repoState: StatusResult | null;
  setGitOptions: React.Dispatch<React.SetStateAction<GitOpt>>;
};

const useStyles = makeStyles(({ typography, palette, shape }) =>
  createStyles({
    gitOptionsWrapper: {
      minWidth: `${typography.fontSize * 15}px`,
      display: "flex",
      justifyContent: "center",
      borderWidth: "1px",
      borderStyle: "solid",
      borderColor: ({ disabled }: { disabled: boolean }) => {
        return disabled ? palette.action.disabledBackground : palette.primary.main
      },
      borderTopStyle: "none",
      borderBottomLeftRadius: shape.borderRadius,
      borderBottomRightRadius: shape.borderRadius
    }
  })
);

export default function GitOptions({ disabled, gitOptions, repoState, setGitOptions }: Props) {
  const classes = useStyles({ disabled });

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
            disabled={disabled || !repoState || !!repoState.conflicted.length}
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
            disabled={disabled || !repoState || !!repoState.conflicted.length || !!repoState.behind}
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