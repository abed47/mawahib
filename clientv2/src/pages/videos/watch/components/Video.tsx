import React, { useEffect, useRef } from 'react';
import { Stream } from '@cloudflare/stream-react';

const VideoWrapper: React.FC<any> = props => {

    const streamRef = useRef<any>(null);

    useEffect(() => {
        // console.log(streamRef)
    }, [props])

    const formatVidId = (v: string) => {
        let s = v || '';
        s = s.replace(/https:\/\/videodelivery\.net\//ig,"");
        s = s.replace(/\/manifest\/video\.m3u8/ig, "")
        return s;
    }

    const getStream = () => {
        return <Stream responsive={true}  className="video-player" controls src={formatVidId(props.url)}/>
    }
    
    return (
        <div className="video-wrapper">
            <div className="video">
                {props.url ? getStream() : null}
            </div>
        </div>
    );
}
export default VideoWrapper;