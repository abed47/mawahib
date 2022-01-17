import React from 'react';
import { Snackbar, Stack } from "@mui/material";
import MuiAlert from '@mui/material/Alert';
import { useCtx } from '../../../utils/context';

const Alert: any = React.forwardRef(function Alert(props, ref: any) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});
  
const SnackBar: React.FC = () => {

    const ctx = useCtx();

    const handleClose = () => {
        ctx.hideSnackbar();}

    return(
        <Stack spacing={2} sx={{ width: '100%' }}>
            <Snackbar open={ctx.snackbarOpen} autoHideDuration={3000} onClose={handleClose}>
                <Alert onClose={handleClose} severity={ctx.snackbarType} sx={{ width: '100%' }}>
                    {ctx.snackbarMessage}
                </Alert>
            </Snackbar>
        </Stack>
    );
}

export default SnackBar;