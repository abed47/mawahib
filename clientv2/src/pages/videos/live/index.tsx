import React, { useState, useEffect } from 'react';
import { Stream } from '@cloudflare/stream-react';
import { useParams } from 'react-router-dom';
import socketIo from 'socket.io-client';
import * as rxjs from 'rxjs';
import { TextField } from '@mui/material';
import { useCtx } from '../../../utils/context';

const evHub = new rxjs.Subject();


const WatchLive: React.FC<any> = props => {

    const [roomId, setRoomId] = useState('');
    const [comments, setComments] = useState<any>([]);
    const [evHubSubscription, setEvHubSubscription] = useState<any>(null);
    const [comment, setComment] = useState('');
    
    const params = useParams<{id: string}>();
    const ctx = useCtx();
    
    useEffect(() => {

        loadData();

        return () => {
            evHub.unsubscribe();
        }
    }, [])


    const loadData = () => {
        if(params?.id) {
            setRoomId(params.id);

            let socket = socketIo('http://localhost:4005');
            

            socket.on('connect', () => {
                
                console.log('connected to socket')

                
            });


            socket.emit('join-room', {roomId: params.id});

            socket.on('new-comment', (ev: any) => {
                console.log('new comment')
                setComments((comments: any) => [...comments, 'test'])
            })

            evHub.subscribe((r: any) => {
                console.log(r)
                if(r?.type === "socket"){
                    console.log(r);
                    socket.emit('send-comment', {
                        user_id: ctx.currentUser.id, 
                        comment: r.value.comment, 
                        photo: ctx.currentUser.photo, 
                        name: ctx.currentUser.name, 
                        createdAt: new Date().getTime(), 
                        follower: false,
                        roomId: params.id,
                    })
                }
                
                // if(r?.type === "comment"){
                //     let arr = [...comments,r.value];
                //     setComments(arr);
                // }
            })

            socket.on('room-joined', e => {
                socket = socketIo('http://localhost:4005');
            })

            

            socket.on('disconnect', () => {
                evHub.unsubscribe();
                console.log('disconnected from socket')
            })
        }
    }

    const handleComment = (e: any) => {
        if(e?.code && e.code == "Enter"){
            evHub.next({value: {roomId, comment: e.target.value}, event: 'send-comment', type: 'socket'});
            setComment('');   
            return;
        }
    }
    
    return (
        <div className="watch-live-stream">
            <div className="video-container">
                <Stream src={roomId} controls />
            </div>
            <div className="comment-box">
                <div className="comment-list">
                    {
                        comments.map((item: any, i: number) => {
                            return (
                                <div className="comment-list-item" key={`comment-list-item-${i}`}>
                                    {item}
                                </div>
                            )
                        })
                    }
                </div>
                <div className="input-container">
                    <TextField value={comment} onChange={e => setComment(e.target.value)} onKeyPress={handleComment} />
                </div>
            </div>
        </div>
    )
}

export default WatchLive;