import React, { useEffect, useState } from 'react';
import { Button } from '@mui/material';
import { useCtx } from '../../utils/context';
import { extractError } from '../../utils/helpers';
import { CategoryRequests, PlaylistRequests } from '../../utils/services/request';
import SelectInputComponent from '../../components/SelectInputComponent';

const VideoUpload: React.FC = props => {

    const [ errors, setErrors ] = useState({
        title: false,
        description: false,
        category: false,
        thumbnail: false,
        video: false
    });
    
    const [ title, setTitle ] = useState('');
    const [ description, setDescription ] = useState('');
    const [ category, setCategory ] = useState('');
    const [ thumbnail, setThumbnail ] = useState('');
    const [ vidoe, setVideo ] = useState('');
    const [ visible, setVisible ] = useState(false);
    const [ kids, setKids ] = useState(false);
    const [ tags, setTags ] = useState('');
    const [ playlist, setPlaylist ] = useState(0);
    const [ hasPromotion, setHasPromotion ] = useState(false);
    const [ categoryList, setCategoryList ] = useState([]);
    const [ playlistList, setPlaylistList ] = useState([]);

    const ctx = useCtx();

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try{
            ctx.showPreloader()
            let pListRes = await PlaylistRequests.list();
            let catRes = await CategoryRequests.getAll();
            ctx.hidePreloader();
            
            if(pListRes?.status && catRes?.status){
                setPlaylistList(pListRes.data);
                setCategoryList(catRes.data);
                return;
            }

        }catch(err){
            ctx.hidePreloader();
            ctx.showSnackbar(extractError(err), 'error');
        }
    }


    return (
        <div className="page-video-upload">
            <header>
                <h1>Upload Video</h1>
                <Button className="btn secondary">Upload</Button>
            </header>

            <main>
                <div className="form-wrapper">
                    <div className={`mawahib-form-control ${errors.title ? 'error-active' : ''}`}>
                        <label>Title</label>
                        <input type="text" value={title} onChange={e => setTitle(e.target.value)} />
                    </div>

                    <div className={`mawahib-form-control ${errors.title ? 'error-active' : ''}`}>
                        <label>Description</label>
                        <textarea value={description} onChange={e => setDescription(e.target.value)}></textarea>
                    </div>

                    <div className={`mawahib-form-control ${errors.title ? 'error-active' : ''}`}>
                        <label>Category</label>
                        
                        <SelectInputComponent hasIndent='image' value={category} children={categoryList} placeholder='hello' onChange={e => setCategory(e)} />
                    </div>
                </div>
            </main>
        </div>
    );
}

export default VideoUpload;