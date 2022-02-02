import React, { useRef } from 'react';
import PhotoSizeSelectActualIcon from '@mui/icons-material/PhotoSizeSelectActual';
import ReactPlayer from 'react-player';

interface VideoDropZoneInterface {
    value?: File | null;
    onChange?: (e: File) => void;
    error?: boolean
}
const VideoDropZone: React.FC<VideoDropZoneInterface> = props => {

    const inputRef = useRef<HTMLInputElement>(null);

    const handleChooseVideo = (e: any) => {
        if(inputRef.current?.click) inputRef.current.click()
    }

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let f = e.target.files?.[0];

        if(f && props?.onChange){
            props.onChange(f)
        }
    }

    return (
        <div className={`mawahib-video-drop-zone-input ${props?.error ? 'error-active' : ''}`}>

            <input type="file" ref={inputRef} onChange={handleFileChange} />

            {
                props?.value ? 
                <div className="preview">
                    <ReactPlayer 
                        url={
                            URL.createObjectURL(props.value)
                        }  
                        width={170} 
                        height={100} 
                        controls
                         />
                </div>
                : 
                <div className="placeholder" onClick={handleChooseVideo}>
                    <PhotoSizeSelectActualIcon />
                </div>
            }

        </div>
    );
}

export default VideoDropZone