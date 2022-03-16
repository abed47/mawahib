import React, { useEffect, useRef } from 'react';
import { Stream } from '@cloudflare/stream-react';
import { IconButton } from '@mui/material';
import { AiOutlineClose } from 'react-icons/ai';

interface ComponentProps {
    url: string | any;
    hidePlayer: (e: boolean) => void;
}

const SubmissionPlayer: React.FC<ComponentProps> = props => {

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
        return <Stream responsive={true} className="video-player" controls src={formatVidId(props.url)}/>
    }

    return (
        <div className="submission-player">
            <IconButton onClick={() => props.hidePlayer(false)} className='close-btn'> <AiOutlineClose className='icon' /> </IconButton>
            <div className="player-wrapper">
                {getStream()}
            </div>
        </div>
    )
}

export default SubmissionPlayer;