import React from 'react';
import { Button, IconButton } from '@mui/material';
import { FiUsers } from 'react-icons/fi';
import { BsCollectionPlay, BsShareFill, BsBellSlashFill, BsBellFill } from 'react-icons/bs';
import { AiOutlineLike } from 'react-icons/ai';

const ChannelBar: React.FC<any> = props => {
    return (
        <div className="channel-bar">
            <div className="l">
                <img src={'http://localhost:4000/api/v1/uploads/' + props?.channel?.photo} alt="s" />
                <div className="in">
                    <p className='category'>{props?.channel?.category?.title || props?.video?.category?.name}</p>
                    <h1 className='title'>{props?.video?.title}</h1>
                    <span className='more' >
                        <span>
                            <FiUsers /> <p>{props?.channel?.subscriptions?.length || 0}</p>
                        </span>
                        <span>
                            <BsCollectionPlay /> <p>{props?.channel?.playlists?.length || 0}</p>
                        </span>
                    </span>
                </div>
            </div>
            <div className="r">
                <Button className='btn'>
                    <AiOutlineLike />
                    <p>{props?.video?.likes?.length || 0} like</p>
                </Button>

                <Button className='btn'> 
                    <BsShareFill /> 
                    <p>Share</p>    
                </Button>

                <div className="vr"></div>

                <Button className="btn outline">Follow</Button>
                <IconButton className='btn'><BsBellFill /></IconButton>
            </div>
        </div>
    );
}

export default ChannelBar;