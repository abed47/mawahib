import React from 'react';
import { Snackbar, Button, Alert } from "@mui/material";

const MuiAlert = React.forwardRef(function MuiAlert(props, ref) {
    return <Alert elevation={6} ref={ref} variant="filled" {...props} />;
});
  
const SnackBar: React.FC = () => {
    return(
        
    );
}