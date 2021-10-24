import * as React from 'react';
import { Slide, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Button, CircularProgress } from '@material-ui/core';
import { LayoutContext } from '../../../utils/context/LayoutContext';
import { deleteCategory } from '../../../utils/services/request';

const Transition = React.forwardRef( function Transition(props, ref){
    return <Slide direction="up" ref={ref} {...props} />
});

const DeleteDialog = props => {

    const [processing, setProcessing] = React.useState(false);

    const layoutCtx = React.useContext(LayoutContext);
    
    React.useEffect(() => {

        return () => {
            setProcessing(false);
        }
    }, [])

    const handleClose = (status = undefined) => {
        if(status === undefined){
            setProcessing(false);
        }

        props.handleClose(status);
    }

    const handleSubmit = async () => {
        
        try{
            
            let id = props.data.id;
            let res = await deleteCategory(id);
            
            if(res.status){
                handleClose(true);
                layoutCtx.showSnack(res.message, 'success');
                return;
            }

            layoutCtx.showSnack(res.message || 'error deleting category', 'error');
            handleClose(false);

        }catch(err){
            setProcessing(false);
            layoutCtx.showSnack(err.message || 'error while deleting category', 'error');
        }
    }

    return (
        <Dialog 
            open={props.open} 
            className="add-category-dialog" 
            TransitionComponent={Transition}
            >
            <DialogTitle className="dialog-title">
                <span>Delete Category</span>

            </DialogTitle>

            <DialogContent className="dialog-content">
                <p>Are you sure you want to delete Category: {props?.data?.name}</p>
            </DialogContent>
            <DialogActions className="dialog-actions">
                <Button variant="contained" onClick={() => handleClose()}>Cancel</Button>
                <Button variant="contained" color="primary" disabled={processing} onClick={handleSubmit}>
                    {
                        processing ? <span className="mr-2"><CircularProgress className="color-white w-20p h-20p" /></span> : ''
                    }
                        Delete
                    </Button>
            </DialogActions>
        </Dialog>
    );
}

export default DeleteDialog;