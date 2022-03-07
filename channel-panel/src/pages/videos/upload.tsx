import React, { useEffect, useState } from 'react';
import { Alert, Button } from '@mui/material';
import { useCtx } from '../../utils/context';
import { extractError } from '../../utils/helpers';
import { CategoryRequests, EventRequests, PlaylistRequests, UtilsRequests, VideoRequests } from '../../utils/services/request';
import SelectInputComponent from '../../components/SelectInputComponent';
import DropZone from '../../components/DropZone';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import RadioInput from '../../components/RadioInput';
import TagInput from '../../components/TagInput';
import LabeledSwitch from '../../components/LabeledSwitch';
import VideoDropZone from '../../components/VideoDropZone';
import { useNavigate, useSearchParams } from 'react-router-dom';

const VideoUpload: React.FC = props => {
    
    const [ title, setTitle ] = useState('');
    const [ description, setDescription ] = useState('');
    const [ category, setCategory ] = useState<any>(null);
    const [ thumbnail, setThumbnail ] = useState('');
    const [ video, setVideo ] = useState<File | any>(null);
    const [ visible, setVisible ] = useState(false);
    const [ selectedVisibility, setSelectedVisibility ] = useState(null);
    const [ kids, setKids ] = useState(false);
    const [ tags, setTags ] = useState('');
    const [ playlist, setPlaylist ] = useState(0);
    const [ hasPromotion, setHasPromotion ] = useState(false);
    const [ categoryList, setCategoryList ] = useState([]);
    const [ playlistList, setPlaylistList ] = useState([]);
    const [ isSubmission, setIsSubmission ] = useState(false);
    const [ event, setEvent ] = useState<any>(null);
    const [ formErrors, setFormErrors ] = useState([false, false, false, false, false]);
    
    const ctx = useCtx();
    const navigate = useNavigate();
    const [urlSearchParams] = useSearchParams();

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try{
            ctx.showPreloader()
            let pListRes = await PlaylistRequests.list();
            let catRes = await CategoryRequests.getAll();
            ctx.hidePreloader();
            checkSearchQuery();
            
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

    const checkSearchQuery = async () => {
        let actionType = urlSearchParams.get('action');
        if(actionType === 'event_submit'){
            let eventId = urlSearchParams.get('event_id');
            try{
                ctx.showPreloader();
                let res = await EventRequests.getEvent(eventId);
                ctx.hidePreloader();
                if(res && res?.status){
                    let e = res.data;
                    setEvent(e);
                    setIsSubmission(true);
                    return;
                }

                if(res && res?.status === false){
                    ctx.showSnackbar(res?.message || 'server error', 'error');
                }
            }catch(err: any){
                ctx.hidePreloader();
                ctx.showSnackbar(err?.message || 'server error', 'error');
            }
            return;
        }
    }

    const isValid: () => boolean = () => {
        let hasErrors = false;
        let newErrs = [...formErrors]
        if(!title){
            hasErrors = true;
            newErrs[0] = true;
        }

        if(!description){
            hasErrors = true;
            newErrs[1] = true;
        }

        if(!category){
            hasErrors = true;
            newErrs[2] = true;
        }

        if(!visible){
            hasErrors = true;
            newErrs[3] = true;
        }
        
        if(!video){
            hasErrors = true;
            newErrs[4] = true;
        }

        if(hasErrors){
            setFormErrors(newErrs);
            return false;
        }

        return true;
    }

    const handleUpload = async () => {
        
        if(!isValid()) return;

        let body = {
            description,
            title,
            category_id: category?.id,
            thumbnail,
            visible,
            kids,
            tags,
            playlist,
            has_promotion: hasPromotion,
            channel_id: ctx.channel.id,
            user_id: ctx.currentUser.id,
            url: ''
        }

        try{
            ctx.showPreloader();

            //upload videoThumbnail to server
            if(thumbnail){
                let f2 = new FormData();
                f2.append('file', thumbnail);
                let thumbRes = await UtilsRequests.uploadPhoto(f2);
                if(thumbRes?.status && thumbRes.data){
                    body.thumbnail = thumbRes.data;
                }
            }

            //upload video to cloudflare
            let f1 = new FormData();
            f1.append('file', video)
            let videoResponse = await VideoRequests.uploadVideoToCloudFlare(f1);

            if(videoResponse?.success){
                videoResponse = videoResponse.result;
                if(!body.thumbnail) body.thumbnail = videoResponse.thumbnail;
                body.url = videoResponse.playback.hls;
            }
            
            let res = await VideoRequests.createVideo(body);
            ctx.hidePreloader();
            
            if(!res?.status){
                ctx.showSnackbar(res?.message || 'server error', 'error');
                return;    
            }
            
            navigate('/videos')

        }catch(err: any){
            ctx.hidePreloader();
            ctx.showSnackbar(err?.message || 'try again', 'error');
        }
    }

    return (
        <div className="page-video-upload">
            <header>
                <h1>Upload Video</h1>
                <Button className="btn secondary" onClick={handleUpload}>Upload</Button>
            </header>

            {
                isSubmission ?
                <div className='event-submission-notification'>
                    <Alert style={{width: '100%', boxSizing: 'border-box'}} severity='info'>This Video will be submitted to event: {event?.title} on stage: {event?.current_stage}</Alert>
                </div> : null
            }

            <main>
                <div className="s1">

                
                <div className="form-wrapper">
                    <div className={`mawahib-form-control ${formErrors[0] ? 'error-active' : ''}`}>
                        <label>Title</label>
                        <input placeholder='video title' type="text" value={title} onChange={e => setTitle(e.target.value)} />
                    </div>

                    <div className={`mawahib-form-control ${formErrors[1] ? 'error-active' : ''}`}>
                        <label>Description</label>
                        <textarea value={description} onChange={e => setDescription(e.target.value)}></textarea>
                    </div>

                    <div className={`mawahib-form-control ${formErrors[2] ? 'error-active' : ''}`}>
                        <label>Category</label>
                        <SelectInputComponent width={250} hasIndent='image' value={category} children={categoryList} placeholder='hello' onChange={e => setCategory(e)} />
                    </div>
                    
                    <div className={`mawahib-form-control`}>
                        <label>Video Thumbnail</label>
                        
                        <DropZone type="photo" onChange={e => setThumbnail(e)} />
                    </div>

                    <div className={`mawahib-form-control ${formErrors[3] ? 'error-active' : ''}`}>
                        <label>Visibility</label>

                        <SelectInputComponent width={200} hasIndent='icon' value={selectedVisibility} children={[
                            {icon: <RemoveRedEyeIcon />, label: 'Public', value: true},
                            {icon: <VisibilityOffIcon />, label: 'Private', value: false},
                            ]} onChange={e => {
                                setVisible(e.value);
                                setSelectedVisibility(e);
                            }} />
                    </div>

                    <div className={`mawahib-form-control`}>
                        <label>Is This Video Made For Kids</label>
                        <RadioInput value={kids} onChange={e => setKids(e)} children={[
                            {value: true, label: 'Yes', info: 'Examples of what may be considered made for kids include:\n\n Children are the primary audience of the video.\nChildren are not the primary audience, but the video is still directed at children because it features actors, characters, activities, games, songs, stories, or other subject matter that reflect an intent to target children.'},
                            {value: false, label: 'No', info: 'Examples of what may be considered not made for kids include: Content that contains sexual themes, violence, obscene, or other mature themes not suitable for young audiences. Age-restricted videos that aren’t appropriate for viewers under 18.'}
                        ]} />
                    </div>

                    <div className={`mawahib-form-control`}>
                        <label>Tags</label>
                        
                        <TagInput value={tags} onChange={e => setTags(e)} />
                    </div>

                    <div className={`mawahib-form-control`}>
                        <label>Add to playlist</label>

                        <SelectInputComponent width={300} value={playlist} children={playlistList} onChange={e => setPlaylist(e)} />
                    </div>

                    <LabeledSwitch value={hasPromotion} label="Do your video contain paid promotion or endorsement?" onChange={e => setHasPromotion(e)} />
                </div>
                
                </div>

                <div className="s2">
                    <div className="video-preview">
                        <VideoDropZone error={formErrors[4]} value={video} onChange={e => setVideo(e)} />
                        <div className="bottom-section">
                            <p>{title || 'video title'}</p>
                            <p className="channel-name">
                                {ctx?.channel?.name}
                            </p>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}

export default VideoUpload;