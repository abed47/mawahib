import * as React from 'react';
import Stack from '@mui/material/Stack';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});


export default function CustomizedSnackbars({open, type, message, handleClose}) {

  return (
    <Stack spacing={2} sx={{ width: '100%' }}>

      <Snackbar anchorOrigin={{vertical: 'bottom', horizontal: 'center'}} open={open} autoHideDuration={4000} onClose={handleClose}>
        <Alert onClose={handleClose} severity={type} sx={{ width: '100%' }}>
          {message}
        </Alert>
      </Snackbar>

    </Stack>
  );
}