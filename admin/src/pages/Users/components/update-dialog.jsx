import * as React from 'react';
import { Slide, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Button, CircularProgress } from '@material-ui/core';
import { LayoutContext } from '../../../utils/context/LayoutContext';
import { fileToBase64 } from '../../../utils/helpers';
import ImagePlaceholder from '../../../assets/images/image-placeholder.jpeg';
import { getCategoryPhoto, updateCategory } from '../../../utils/services/request';

const Transition = React.forwardRef( function Transition(props, ref){
    return <Slide direction="up" ref={ref} {...props} />
});

const UpdateDialog = props => {

    const [name, setName] = React.useState('');
    const [description, setDescription] = React.useState('');
    const [file, setFile] = React.useState(null);
    const [fileDataUrl, setFileDataUrl] = React.useState('');
    const [processing, setProcessing] = React.useState(false);

    const layoutCtx = React.useContext(LayoutContext);
    
    React.useEffect(() => {
        setProcessing(true);
        if(props.data){
            let d = props.data;
            setName(d.name);
            setDescription(d.description || '');
            setFileDataUrl(getCategoryPhoto(d.photo));
            setProcessing(false);
        }

        return () => {
            setName('');
            setDescription('');
            setFile(null);
            setProcessing(false);
            setFileDataUrl('');
        }
    }, [props.data])

    const handleFileChange = (e) => {

        setProcessing(true);
        setFile(e.target.files[0]);
        fileToBase64(e.target.files[0]).then( url => {
            setFileDataUrl(url);
            setProcessing(false);
        }).catch(err => {
            layoutCtx.showSnack(err.message || 'file conversion failed', 'error')
        })

    }

    const isInputsValid = () => {

        // if(!file || !fileDataUrl) {
        //     layoutCtx.showSnack('image not valid', 'error');
        //     return false;
        // }

        if(!name){
            layoutCtx.showSnack('name is require', 'error');
            return false;
        }

        return true;
    }

    const handleClose = (status = undefined) => {
        if(status === undefined){
            setName('');
            setDescription('');
            setFile(null);
            setProcessing(false);
            setFileDataUrl('');
        }

        props.handleClose(status);
    }

    const handleSubmit = async () => {

        if(!isInputsValid()) return;

        setProcessing(true);

        let formData = new FormData();
        
        formData.append('name', name);
        formData.append('description', description || '');

        if(file) formData.append('photo', file);

        try{

            setProcessing(false);
            let res = await updateCategory(formData, props.data.id);

            if(res.status){
                layoutCtx.showSnack('category created successfully', 'success');
                handleClose(true);
                return;
            }

            setProcessing(false);
            layoutCtx.showSnack(res.message, 'error');

        }catch(err){

            layoutCtx.showSnack(err.message || 'error creating category', 'error');
            setProcessing(false);

        }
    }

    return (
        <Dialog 
            open={props.open} 
            className="add-category-dialog" 
            TransitionComponent={Transition}
            onClose={() => handleClose()}
            >
            <DialogTitle className="dialog-title">
                <span>Create Category</span>

            </DialogTitle>

            <DialogContent className="dialog-content">
                
                <TextField 
                    variant="standard"
                    value={name}
                    label="Name"
                    onChange={e => setName(e.target.value)}
                    fullWidth
                />

                <TextField 
                    variant="standard"
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                    label="Description"
                    multiline
                    rows="4"
                    fullWidth
                />

                <div className="upload-image-wrapper v-1">
                    <input type="file" onChange={handleFileChange} accept="image/png, image/gif, image/jpeg, image/jpg"/>
                    {
                        fileDataUrl ? <img src={fileDataUrl} alt="" /> : <img src={ImagePlaceholder} alt="" />
                    }
                </div>
            </DialogContent>
            <DialogActions className="dialog-actions">
                <Button variant="contained" onClick={() => handleClose()}>Cancel</Button>
                <Button variant="contained" color="primary" disabled={processing} onClick={handleSubmit}>
                    {
                        processing ? <span className="mr-2"><CircularProgress className="color-white w-20p h-20p" /></span> : ''
                    }
                        Update
                    </Button>
            </DialogActions>
        </Dialog>
    );
}

export default UpdateDialog;