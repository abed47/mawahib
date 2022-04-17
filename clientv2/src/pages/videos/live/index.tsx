import React, { useState, useEffect } from 'react';
import { Stream } from '@cloudflare/stream-react';

const WatchLive: React.FC<any> = props => {

    return (
        <div className="watch-live-stream">
            <div className="video-container">
                <Stream src={'067a3efb89f25306bd00d07310118598'} controls />
            </div>
            
        </div>
    )
}

export default WatchLive;