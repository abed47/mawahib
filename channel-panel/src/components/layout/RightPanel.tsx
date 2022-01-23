import React, { useState } from 'react';
import { IconButton } from '@mui/material';
import {EventsList} from '../../assets/data';
import { AiOutlineClose } from 'react-icons/ai';
import { IoPlayForward, IoPlayBack } from 'react-icons/io5';
import { GoUnmute } from 'react-icons/go';
import { FaPlay } from 'react-icons/fa';

const RightPanel = () => {

    const [eventList, setEventList] = useState<any[]>(EventsList)

    return (
        <div className="right-panel">
            <h3>Events</h3>

            <ul className="event-list">

                {
                    eventList.map((item, i) => {
                        return (
                            <li className="event-item" key={`event-list-item-${i}`}>
                                <img src={item.photo} alt="ev" />
                                <div className="info">
                                    <p className="title">{item?.title || ''}</p>
                                    <p className="description">{item?.description || ''}</p>
                                </div>
                            </li>
                        );
                    })
                }
            </ul>
            
            <div className="divider">
                <hr />
                    <p>Show All</p>
                <hr />
            </div>

            <div className="pinned-video">
                <p className="title">
                    pinned video
                </p>

                <div className="video-wrapper">
                    <p>you can pin a video here and continue you browsing</p>
                </div>

                <div className="controls">
                    <IconButton>
                        <GoUnmute />
                    </IconButton>

                    <IconButton>
                        <IoPlayBack />
                    </IconButton>

                    <IconButton>
                        <FaPlay />
                    </IconButton>

                    <IconButton>
                        <IoPlayForward/>
                    </IconButton>

                    <IconButton>
                        <AiOutlineClose />
                    </IconButton>
                </div>
            </div>
        </div>
    )
}

export default RightPanel;