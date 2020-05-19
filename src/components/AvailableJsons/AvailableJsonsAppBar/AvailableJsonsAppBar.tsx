import React from 'react';
import { createStyles, fade, makeStyles } from '@material-ui/core/styles';
import { AppBar, Badge, InputBase, Toolbar, Typography } from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';
import CloseIcon from '@material-ui/icons/Close';
import IconButton from '@material-ui/core/IconButton';

interface Props {
  fileCount: number;
  setIsJsonSelectionOpen: React.Dispatch<React.SetStateAction<boolean>>;
};


const useStyles = makeStyles(theme => 
  createStyles({
    grow: {
      flexGrow: 1
    },
    search: {
      position: 'relative',
      width: '100%',
      marginRight: theme.spacing(2),
      marginLeft: 0,
      borderRadius: theme.shape.borderRadius,
      backgroundColor: fade(theme.palette.common.white, 0.15),
      '&:hover': {
        backgroundColor: fade(theme.palette.common.white, 0.25),
      },
      [theme.breakpoints.up('sm')]: {
        marginLeft: theme.spacing(3),
        width: 'auto',
      },
    },
    searchIcon: {
      position: 'absolute',
      height: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: theme.spacing(0, 2),
      pointerEvents: 'none'
    },
    inputRoot: {
      color: "inherit"
    },
    inputInput: {
      width: '100%',
      padding: theme.spacing(1, 1, 1, 0),
      // vertical padding + font size from searchIcon
      paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
      transition: theme.transitions.create('width'),
      [theme.breakpoints.up('md')]: {
        width: '20ch',
      },
    }
  })
);

const AvailableJsonsAppBar = ({ fileCount, setIsJsonSelectionOpen }: Props) => {
  const classes = useStyles();

  return(
    <AppBar color="secondary" position="static">
      <Toolbar>
        <Typography variant="h5">
          <Badge badgeContent={fileCount} color="error">
            Available jsons
          </Badge>
        </Typography>
        <div className={classes.search}>
          <div className={classes.searchIcon}>
            <SearchIcon />
          </div>
          <InputBase
            classes={{
              root: classes.inputRoot,
              input: classes.inputInput,
            }}
            placeholder="Search…" />
        </div>
        <div className={classes.grow}></div>
        <IconButton onClick={() => setIsJsonSelectionOpen(false)} >
          <CloseIcon />
        </IconButton>
      </Toolbar>
    </AppBar>
  );
};

export default AvailableJsonsAppBar;