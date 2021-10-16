import React,{useState, useEffect} from 'react';
import LoadingSpinner from 'react-loader-spinner';
import {CircularProgress} from '@material-ui/core';
import EvaIcon from 'react-eva-icons';
import {uploadsFolder, serverUrl} from '../../utils/providers/local-http-provider';
import axios from 'axios';
import {Dialog, DialogActions, DialogContent,Button } from '@material-ui/core';
const GalleryComponent = ({type, id}) => {

    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [data, setData] = useState([]);
    const [currentImage, setCurrentImage] = useState("");
    const [dialogOpen, setDialogOpen]       = useState(false);

    useEffect(() => {
        setLoading(true);
        loadData();
    },[])

    const loadData = () => {
        axios.get(serverUrl + 'gallery/uploads/' + id).then(res => {
            setLoading(false);
            if(res.data.data && res.data.data.length) setData(res.data.data)
        }).catch(err => {
            console.log(err);
        })
    }

    const handleDelete = (e,i) => {
        setLoading(true)
        axios.delete(serverUrl + 'gallery/uploads/' + e.id,{data: {path:e.url}}).then(res => {
            setLoading(false);
            
            let newData = [...data];
            newData.splice(i,1);
            setData(newData);
        }).catch(err => {
            setLoading(false);
            console.log(err)
        })
        
    }

    const handleView = (e) => {
        setCurrentImage(uploadsFolder + e.url);
        setDialogOpen(true);
    }

    const handleFileSelected = e => {
        let file = e.target.files[0];
        let fileExt = file.type.match(/[^/]*$/g)[0];
        let uploadFile = new File([file], `item-${id}-${new Date().getTime()}.${fileExt}`, {
            type: file.type,
            lastModified: file.lastModified
        });

        // setLoading(true);
        // setUploading(true);

        let formData = new FormData();
        formData.append('file', uploadFile);
        formData.append('type', 1);
        formData.append('id', id);
        
        setUploading(true);

        axios.post(serverUrl + 'gallery/upload',formData).then(res => {
            setUploading(false);
            loadData();
        }).catch(err => {
            setUploading(false);
        })

    }

    return (
        <div className="gallery">
            {
                loading ? 
                <div className="loading">
                    <CircularProgress />
                </div> : data.map((item,index) => {
                    return  <ImageItem 
                                {...item} 
                                index={index} 
                                delete={() => handleDelete(item, index)}
                                view={() =>  handleView(item, index)} 
                            />
                })
            }

            {
                uploading ?
                <div className="uploading-file">
                    <CircularProgress />
                </div> : ""
            }

            {
                !loading ?
                <div className="add">
                    <input 
                        disabled={uploading}
                        type="file" 
                        onChange={handleFileSelected} 
                        />
                    <EvaIcon 
                        name="file-add-outline"
                        size="xlarge"
                        fill="#e3e3e3"
                        animation={{
                            type: "pulse",  // zoom, pulse, shake, flip
                            hover: true,
                            infinite: false 
                          }}
                    />
                </div> :
                ""
            }





        <Dialog
            open={dialogOpen}
            onClose={() => setDialogOpen(false)}
            className="view-image-dialog"
        >
            <DialogContent className="view-image-dialog-content">
                <img src={currentImage} className="view-image-dialog-image"/>
            </DialogContent>
            <DialogActions>
            <Button onClick={() => setDialogOpen(false)} color="primary" autoFocus>
                Close
            </Button>
            </DialogActions>
        </Dialog>
        </div>
    );
}

const ImageItem = (item) => {
    return (
        <div className="item">

            <div className="overlay">
                <div className="delete" title="delete file" onClick={item.delete}>
                    <EvaIcon
                        name={"trash-2-outline"}
                        size="medium"
                        />
                </div>
                <div className="view" title="view file" onClick={item.view}>
                    <EvaIcon
                        name={"eye-outline"}
                        size="medium"
                    />
                </div>
            </div>

            <img src={uploadsFolder + item.url} alt={'item'} loading={"lazy"} />
        </div>
    )
}

export default GalleryComponent;