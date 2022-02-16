import React, { useEffect, useState } from 'react';
import { TextField, CircularProgress } from '@mui/material';
import { UtilsRequests, VideoRequests } from '../../../../utils/services/request';
import { useCtx } from '../../../../utils/context';
import UserPlaceHolder from '../../../../assets/images/user-placeholder.png';
import ReactTimeAgo from 'react-time-ago';

const VideoComments: React.FC<{videoId: number}> = props => {
    
    const [comment, setComment] = useState('');
    const [processing, setProcessing] = useState(false);
    const [commentList, setCommentList] = useState<any[]>([]);
    const [totalRows, setTotalRows] = useState(0);
    const [loadMoreProcessing, setLoadMoreProcessing] = useState(false);

    const ctx = useCtx();

    useEffect(() => {
        loadData();
    }, [props.videoId]);

    const loadData = async () => {
        try{
            let res = await VideoRequests.searchComments({
                fields: { video_id: props?.videoId },
                pagination: {
                    offset: 0,
                    limit: 5
                }
            });
            if(res?.status) {
                setCommentList(res.data);
                setTotalRows(res.pagination.totalRows);
            }
        }catch(err){
            console.log(err);
        }
    }

    const loadMore = async () => {
        try{
            setLoadMoreProcessing(true);
            let res = await VideoRequests.searchComments({
                fields: { video_id: props?.videoId },
                pagination: {
                    offset: commentList.length,
                    limit: 5
                }
            });
            setLoadMoreProcessing(false);
            if(res?.status) {
                let l = [...commentList, ...res.data];
                setCommentList(l);
                setTotalRows(res.pagination.totalRows);
            }
        }catch(err){
            setLoadMoreProcessing(false);
            console.log(err);
        }
    }

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if(e.key === "Enter" && !e.shiftKey){
            e.preventDefault();
            createComment();
            return;
        }
    }

    const createComment = async () => {
        try{
            let res = await VideoRequests.createComment({user_id:ctx.currentUser?.id, video_id: props.videoId, content: comment})
            
            if(res?.status){
                createNewComment(comment);
                setComment('');
                return;
            }

            if(res?.status === false){
                ctx.showSnackbar(res?.message || 'server error', 'error');
            }
        }catch(err){
            console.log(err)
        }
    }

    const createNewComment = (c: string) => {
        let cList: any = [...commentList];
        let s: any = {
            id: new Date().getTime(),
            content: c,
            user: ctx.currentUser,
            createdAt: new Date()
        }
        cList.push(s);
        setCommentList(cList);
    }

    return (
        <div className="comments">
            <div className="comment-container">
                {
                    commentList.map((item: any, index) => {
                        return (
                            <div className="comment" key={`comment-list-item-${index}`}>
                                <div className="comment-header">
                                    <img src={UtilsRequests.getPhotoUrl(item?.user?.photo)|| UserPlaceHolder} alt="user profile" />
                                    <div className="info">
                                        <p className="name">{item?.user?.name}</p>
                                        <p className="time"> <ReactTimeAgo date={item?.createdAt}/> </p>
                                    </div>
                                </div>
                                <div className="content">{item.content}</div>
                                
                            </div>
                        );
                    })
                }
            </div>
            { totalRows > commentList.length ? <div className="load-more">
                <div className="l"></div>
                <p onClick={loadMore} className={`c ${loadMoreProcessing ? 'active' : ''}`}>Load More <CircularProgress className='progress-circle' /> </p>
                <div className="r"></div>
            </div> : null }
            <div className="new-comment">
                <TextField 
                    fullWidth
                    placeholder='Write comment here'
                    variant="standard"
                    value={comment} 
                    multiline
                    onKeyDown={handleKeyPress}
                    onChange={e => setComment(e.target.value)} />
            </div>
        </div>
    );
}

export default VideoComments;