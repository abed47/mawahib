import React from 'react';
import { Stream } from '@cloudflare/stream-react';

const VideoWrapper: React.FC<any> = props => {

    const formatVidId = (v: string) => {
        let s = v || '';
        s = s.replace(/https:\/\/videodelivery\.net\//ig,"");
        s = s.replace(/\/manifest\/video\.m3u8/ig, "")
        console.log(s)
        return s;
    }
    
    return (
        <div className="video-wrapper">
            <div className="video">
                <Stream responsive={true} className="video-player" controls src={formatVidId(props.url)}/>
            </div>
        </div>
    );
}
export default VideoWrapper;