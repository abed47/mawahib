import React,{useContext} from 'react';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import { makeStyles } from '@material-ui/core/styles';
import {LayoutContext} from '../../utils/context/LayoutContext'

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    '& > * + *': {
      marginTop: theme.spacing(2),
    },
  },
}));



export default function CustomizedSnackbars({msg, type}) {
  const classes = useStyles();

  const ctx = useContext(LayoutContext);





  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    ctx.hideSnack()
  };

  return (
    <div className={classes.root}>
      
      <Snackbar open={ctx.snackOpen} autoHideDuration={6000} onClose={handleClose}>
        <Alert onClose={handleClose} severity={ctx.snackType || "error"}>
          {ctx.msg}
        </Alert>
      </Snackbar>
    </div>
  );
}