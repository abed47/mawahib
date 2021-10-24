import { useState, useContext, useRef } from 'react';
import Button from '@mui/material/Button';
import { AuthContext } from '../../../utils/context/auth';
import { LayoutContext } from '../../../utils/context/layout';
import { useHistory } from 'react-router-dom';
import { LinearProgress, TextField } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import UploadIcon from '@mui/icons-material/UploadFile';
import "video.js/dist/video-js.css";
import VideoJS from './VideoJs';
import {dataURLtoFile, imgToBase64} from '../../../utils/helpers';
import ChipInput from '../../../components/material-ui-chip-input';
import { getCurrentUserChannel, videos_ms_url } from '../../../utils/services/request';
import StoreService from '../../../utils/services/store';
import axios from 'axios';

const MawahibTheme = createTheme({
    palette:{
        primary: {
            main: '#006796',
            contrastText: '#FFFFFF',
        },
        secondary: {
            main: '#4ec1b8',
            contrastText: '#FFFFFF'
        },
        text:{
            primary: '#006796',
            secondary: '#006796',
            disabled: '#979696',
        },
    },
    components:{
        MuiChip:{
            styleOverrides:{
                colorPrimary: '#FFFFFF',
                colorSecondary: '#FFFFFF',
                iconColorPrimary: '#FFFFFF'
            },
            defaultProps: {
                color: "primary"
            }
        }
    }
});

const UploadVideoScreen = (props) => {

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [tags, setTags] = useState([]);
    const [loading, setLoading] = useState(false);

    const layoutCtx = useContext(LayoutContext);
    const authCtx = useContext(AuthContext);
    const history = useHistory();

    const [video, setVideo] = useState(null);
    const [videoUrlPath, setVideoUrlPath] = useState('');
    const [videoType, setVideoType] = useState('');
    const [currentVideoChild, setCurrentVideoChild] = useState(null);
    const [imageDataUrl, setImageDataUrl] = useState('');
    const [image, setImage] = useState(null);

    const [uploadProgress, setUploadProgress] = useState(0);

    const playerRef = useRef(null);
    const videoFileInputRef = useRef(null);

    const videoJsOptions = {
        // autoplay: true,
        controls: true,
        responsive: true,
        fluid: true,
        sources: [{
        src: videoUrlPath,
        type: 'video/mp4'
        }],
        playbackRates: [0.5, 1, 1.5, 2],
        aspectRatio: '16:9'
    }

    function captureVideo() {
        if(!currentVideoChild) return;
        let vEl = currentVideoChild;
        var canvas = document.createElement("canvas");
        canvas.width = vEl.videoWidth;
        canvas.height = vEl.videoHeight;
        var canvasContext = canvas.getContext("2d");
        canvasContext.drawImage(vEl, 0, 0);
        let dUrl = canvas.toDataURL('image/png');
        setImageDataUrl(dUrl);
        setImage(dataURLtoFile(dUrl, 'image.png'))
    }

    const handleImageChange = (e) => {
        imgToBase64(e.target.files[0]).then(res => {
            setImage(e.target.files[0]);
            setImageDataUrl(res);
        });
    }

    const handlePlayerReady = (player) => {
        playerRef.current = player;
    
        player.on('pause', () => {
            setCurrentVideoChild(player.children_[0])
        })

        player.on('play', () => {
            console.log('play pressed')
        })
        // you can handle player events here
        player.on('waiting', () => {
          console.log('player is waiting');
        });
    
        player.on('dispose', () => {
          console.log('player will dispose');
        });
      };

    const handleVideoInputChange = (e) => {
        if(!e.target.files[0]) return;
        setVideo(e.target.files[0]);
        if(video){
            setVideoUrlPath(URL.createObjectURL(e.target.files[0]));
            setVideoType(e.target.files[0].type);
            playerRef.current.pause();
            playerRef.current.src({
                src: URL.createObjectURL(e.target.files[0]),
                type: e.target.files[0].type
            })
            playerRef.current.play();
            return;
        }
        setVideoUrlPath(URL.createObjectURL(e.target.files[0]));
        setVideoType(e.target.files[0].type);
    }

    const handleChangeVideo = (e) => {
        videoFileInputRef.current.click()
    }

    const handleAddTag = (e,v) => {
        let newTags = [...tags];
        newTags.push(e);
        setTags(newTags);
    }

    const handleDeleteTag = (e,index) => {
        let newTags = [...tags];
        newTags.splice(index, 1);
        setTags(newTags);
    }

    const moveToChannel = () => {
        history.push('/channel?t=uploads');
    }

    const handleSubmit = async () => {
        
        try{
            setLoading(true);
            //validation

            //validate channel
            if(!authCtx.channel.id){
                let channelRes =  await getCurrentUserChannel();
                let channelData = channelRes.data;
                StoreService.store('currentUserChannel', channelData)
                authCtx.setChannel(channelData);
                authCtx.setHasChannel(true);
            }

            let formData = new FormData();
            formData.append('video', video);
            formData.append('thumb', image);
            formData.append('title', title);
            formData.append('description', description);
            formData.append('channel_id', authCtx.channel.id || StoreService.get('currentUserChannel').id);
            formData.append('user_id', authCtx.user.id);
            formData.append('video_type', videoType);
            formData.append('tags', tags.length ? tags.join(',-,') : '');

            let token = StoreService.get('token');

            let axiosRes = await axios.request({
                method: 'POST',
                url: videos_ms_url + 'videos/upload',
                data: formData,
                headers: {
                    'Authorization': 'Bearer ' + token
                },
                onUploadProgress: (p) => {
                    setUploadProgress(Math.floor((p.loaded / p.total) * 100)); 
                    //this.setState({
                        //fileprogress: p.loaded / p.total
                    //})
                  }
            })

            let res = axiosRes.data;

            setLoading(false);
            layoutCtx.showSnackBar(res.message, res.type);
            setUploadProgress(0);
            moveToChannel();

        }catch(err){
            setLoading(false);
            console.log(err)
        }
    }

    return (
        <ThemeProvider theme={MawahibTheme}>
        <div className="video-upload-page">
            <div className="header" disabled>
                <div className="title">
                    <h1>Upload Video</h1>
                </div>
                <div className="actions">
                    <Button variant="contained" className="btn theme-info" color="info" onClick={moveToChannel}>Cancel</Button>
                    <Button variant="contained" className="btn theme-primary ml-5" onClick={handleSubmit}>Upload</Button>
                </div>

            </div>

            <div className={`linear-progress ${loading ? 'active' : ''}`}>
                <LinearProgress color="primary" variant="determinate" value={uploadProgress} />
            </div>

            <div className="content">
                <div className={`overlay ${loading ? 'active' : ''}`}></div>
                <div className="form">

                    <TextField 
                        variant="outlined"
                        label="Title"
                        className="textfield"
                        inputProps={{className:"textfield-override"}}
                        fullWidth
                        value={title}
                        onChange={e =>  setTitle(e.target.value)}
                    />

                    <TextField 
                        variant="outlined"
                        label="Description"
                        multiline
                        className="textfield"
                        rows={5}
                        inputProps={{className:"textfield-override"}}
                        fullWidth
                        value={description}
                        onChange={e => setDescription(e.target.value)}
                    />

                    <ChipInput 
                        className="textfield"
                        variant="outlined"
                        label="tags"
                        fullWidth
                        value={tags}
                        onAdd={handleAddTag}
                        onDelete={handleDeleteTag}
                    />
                </div>

                <div className="video-content">
                    <div className="video-container">
                        
                    {
                        video ? <div className="video">
                            <VideoJS options={videoJsOptions} onReady={handlePlayerReady}/>
                        </div> : ''
                    }
                    


                        <input type="file" onChange={handleVideoInputChange} ref={videoFileInputRef} />

                        <div className="read-only">
                            <UploadIcon color="primary" style={{width: '40px', height: '40px'}} />
                            <span>Upload Video</span>
                        </div>
                    </div>

                    <div className={`video-actions ${video ? 'active' : ''}`}>
                        <Button variant="contained" className="btn theme-primary" onClick={handleChangeVideo}>Change Video</Button>
                        <Button variant="contained" className="btn theme-primary" onClick={captureVideo}>Use as thumbnail</Button>
                    </div>

                    <div className="image-container">
                        {
                            image ? <img src={imageDataUrl} alt="thumbnail" className="image" /> : ''
                        }

                        <input type="file" onChange={handleImageChange} />

                        <div className="read-only">
                            <UploadIcon color="primary" style={{width: '40px', height: '40px'}} />
                            <span>Upload Thumbnail</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        </ThemeProvider>
    );
}

export default UploadVideoScreen;