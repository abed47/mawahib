import { Button, Dialog, DialogActions, DialogContent } from '@mui/material';
import React from 'react';
import { Link } from 'react-router-dom';

interface ComponentProps {
    onSuccess?: () => void;
    onClose?: () => void;
    open: boolean;
    message: string;
}

const ConfirmationDialog: React.FC<ComponentProps> = props => {

    return (
        <Dialog open={props.open}
            onClose={props.onClose}
            className="participate-dialog"
            PaperProps={{
                style: {
                    borderRadius: 20,
                    border: '2px solid #4BBEB6',
                    backgroundColor: '#21242D',
                    width: 300,
                    height: 160,
                },
                className: 'paper'
            }}
        >
            <DialogContent className='dialog-content'>
                <p>{props.message}</p>
            </DialogContent>
            <DialogActions className='dialog-actions'>
                <Button className="btn" onClick={props.onSuccess}>Yes</Button>
                <Button className="btn outlined" onClick={props.onClose}>No</Button>
            </DialogActions>
        </Dialog>
    )
}

export default ConfirmationDialog