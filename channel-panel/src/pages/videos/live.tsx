import React, { useState, useEffect, useRef } from 'react';
import { Alert, Button, Select, MenuItem } from '@mui/material';
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
import { useNavigate, useSearchParams } from 'react-router-dom';
import moment from 'moment';
import socketIo from 'socket.io-client';

const LiveStream: React.FC<any> = props => {
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

    //camera stream
    const [stream, setStream] = useState<any>(null);
    const [streamMedia, setStreamMedia] = useState<any>(null);
    const [streamType, setStreamType] = useState<'camera' | 'screen'>('camera');
    const [streamStarted, setStreamStarted] = useState(false);
    const [mRecorder, setMRecorder] = useState<null | MediaRecorder>(null);
    
    const ctx = useCtx();
    const navigate = useNavigate();
    const [urlSearchParams] = useSearchParams();
    const videoRef = useRef<HTMLVideoElement>(null);

    useEffect(() => {
        loadStreams();
        loadData();

        return () => {
            if(mRecorder?.stop) mRecorder.stop();
            if(mRecorder?.ondataavailable) mRecorder.ondataavailable = () => {}
            console.log('finished')
        }
    }, []);

    useEffect(() => {
        handleStream();
    }, [streamType]);

    const handleStream = () => {
        if(streamType === "camera"){
            let cameraStream = navigator.mediaDevices.getUserMedia({
                video: true,
                audio: true
            })
            
            cameraStream.then((r: any) => {
                setStreamMedia(r);
                setStream(cameraStream);
                if(videoRef.current) videoRef.current.srcObject = r
            })

        }
        if(streamType === "screen"){
            let displayStream = navigator.mediaDevices.getDisplayMedia({
                video: true,
                audio: true
            })
            
            displayStream.then((r: any) => {
                setStreamMedia(r);
                setStream(displayStream);
                if(videoRef.current) videoRef.current.srcObject = r
            })
        }

    }

    const loadStreams = () => {
        let permissions = navigator.permissions;

        
    }

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
                    handleEventVerification(e);
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

    const handleEventVerification = (e: any) => {
        let stages = e.event_stages;
        if(!stages || stages?.length < 1) {
            // ctx.showSnackbar('Cannot Submit', 'warn');
            navigate('/videos');
            return false;
        }

        let cStage = stages.filter((item: any) => item.stage_number === e.current_stage);

        if(cStage?.length < 1) return navigate('/videos');
        if(!moment(new Date()).isAfter(cStage[0].submission_start) || !moment(new Date()).isBefore(cStage[0].submission_end)) navigate('/videos')

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
        
        // if(!video){
        //     hasErrors = true;
        //     newErrs[4] = true;
        // }

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
            url: '',
            type: 3,
            event_id: isSubmission ? event?.id : null,
            stage_number: isSubmission ? event?.current_stage : null,
            stage_id: isSubmission ? event?.event_stages?.filter((item: any) => item.stage_number === event.current_stage)?.[0]?.id : null
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
            let liveStreamData = {
                
                meta:{ name: title},
                recording: { 
                    mode: "automatic", 
                    timeoutSeconds: 10,
                    requireSignedURLs: false, 
                    allowedOrigins: ["*"] }
            }

            let videoResponse = await VideoRequests.startLiveStream(liveStreamData);

            console.log('reached here')
            console.log(videoResponse);

            let rtmpsUrl = videoResponse.result.rtmps.url;
            let rtmpsKey = videoResponse.result.rtmps.streamKey;

            let socket = socketIo('http://localhost:4005');
            let mediaRecorder = new MediaRecorder(streamMedia, {mimeType: 'video/webm'});

            socket.on('connect', () => {
                
                mediaRecorder.ondataavailable = (ev) => {
                    if(ev.data && ev.data.size > 0){
                        socket.emit('data', { data: ev.data, rtmpsKey, rtmpsUrl })
                    }
                }
                mediaRecorder.start(1000);
                mediaRecorder.onerror = () => {
                    streamMedia.getTracks().forEach((t: any) => t.stop())
                    
                }
            });
            socket.on('disconnect', () => {
                streamMedia.getTracks().forEach((t: any) => t.stop())
            })
            return;
            
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
        <div className="live-stream-page">
            <header>
                <h1>Live Stream</h1>
                <Button className="btn secondary" onClick={handleUpload}>Stream</Button>
            </header>

            {
                isSubmission ?
                <div className='event-submission-notification'>
                    <Alert style={{width: '100%', boxSizing: 'border-box'}} severity='info'>This Video will be submitted to event: {event?.title} on stage: {event?.current_stage}</Alert>
                </div> : null
            }

            <main>
                <div className={`stream-overlay ${streamStarted ? 'active' : ''}`}></div>
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
                        {/* <VideoDropZone error={formErrors[4]} value={video} onChange={e => setVideo(e)} /> */}

                        <video ref={videoRef} autoPlay={true} />
                            {/* <source src={streamMedia} /> */}
                        <div className="bottom-section">
                            <p>{title || 'video title'}</p>
                            <p className="channel-name">
                                {ctx?.channel?.name}
                            </p>
                            <div>
                                <Select className='select' value={streamType} onChange={(e: any) => setStreamType(e.target.value)}>
                                    <MenuItem value="camera">Camera</MenuItem>
                                    <MenuItem value="screen">Share Screen</MenuItem>
                                </Select>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}

export default LiveStream;