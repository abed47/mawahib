import { useContext, useEffect, useState, useRef } from "react";
import { useParams } from "react-router";
import VideoJS from "../../components/VideoJsComponent";
import { AuthContext } from "../../utils/context/auth";
import { LayoutContext } from "../../utils/context/layout";
import { createComment, dislikeVideo, getPhotoPublicPath, getRelatedVideos, getVideoPublicPath, getVideoThumbnailPublicPath, likeVideo, recordView, searchComments, searchLikes, searchVideos } from "../../utils/services/request";
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import IconButton from '@mui/material/IconButton';
import ReadModeReact from 'read-more-react';
import { Button, TextField } from "@mui/material";
import UserPlaceHolder from '../../assets/images/placeholder.jpg';
import TimeAgo from 'react-timeago';

const WatchPage = (params) => {

    const [video, setVideo] = useState(null);
    const [relatedVideos, setRelatedVideos] = useState([]);
    const [liked, setLiked] = useState(false);
    const [likes, setLikes] = useState(0);
    const [backgroundProcessing, setBackgroundProcessing] = useState(false);
    const [viewed, setViewed] = useState(false);
    
    const [comments, setComments] = useState([]);
    const [totalComments, setTotalComments] = useState(0);
    const [commentInputValue, setCommentInputValue] = useState('');
    const [newComments, setNewComments] = useState([]);

    const playerRef = useRef(null);

    const { id: videoId } = useParams();

    const authCtx = useContext(AuthContext);
    const layoutCtx = useContext(LayoutContext);

    const buildPlayerOptions = (v) => {
        return {
            autoplay: true,
            controls: true,
            responsive: true,
            fluid: true,
            sources:[{
                src: getVideoPublicPath(v?.url)
            }]
        }
    }

    useEffect(() => {
        loadData();
    }, []);
    

    const loadData = async () => {
        
        try{

            layoutCtx.showPreLoader();

            let v = await searchVideos({fields:{video_id: videoId}}, 1);

            let likeRes = await searchLikes({fields: {user_id: authCtx.user.id, video_id: videoId}});

            let commentRes = await searchComments({fields:{video_id: videoId}, pagination:{limit: 5}}, 1);

            let relatedVideoRes = await getRelatedVideos({fields: {
                title: v?.data[0]?.title,
                tags: v?.data[0]?.tags,
                channel_id: v?.data[0]?.channel?.id
            }, pagination: {limit: 10}}, 1);

            if(relatedVideoRes && relatedVideoRes.status){
                setRelatedVideos(relatedVideoRes.data);
            }

            if(commentRes && commentRes.status){
                setComments(commentRes.data);
                setTotalComments(commentRes.pagination.totalRows)
            }

            if(likeRes && likeRes.status){
                if(likeRes.data.length) setLiked(true)
            }

            setVideo(v.data[0]);
            setLikes(v.data[0].like_count || 0);
            layoutCtx.hidPreLoader();

        }catch(err){
            console.log(err);
            layoutCtx.hidPreLoader();
        }
    }

    const handlePlayerReady = (player) => {

        playerRef.current = player;

        player.on('play', () => {
            if(!viewed){
                
                recordView({video_id: videoId}).then(r => {
                    setViewed(true);
                }).catch(err => {
                    console.log(err);
                })
            }
        })

        player.on('waiting', () => {
            console.log('player is waiting');
        });

        player.on('dispose', () => {
            console.log('player will dispose');
        })
    }


    const handleVideoLike = async () => {
        try{
            setBackgroundProcessing(true)
            let body = {};
            body['user_id'] = authCtx.user.id;
            body['video_id'] = videoId;
            let res = await likeVideo(body);
            setBackgroundProcessing(false)
            
            if(!res.status){
                layoutCtx.showSnackBar(res.message, res.type);
                return;
            }
            setLiked(true);
            let ls = +likes + 1;
            setLikes(ls);
        }catch(err){
            // layoutCtx.showSnackBar(err.message, err.type)
            console.log(err)
        }
    }

    const handleVideoDislike = async () => {
        try{
            setBackgroundProcessing(true)
            let body = {};
            body['user_id'] = authCtx.user.id;
            body['video_id'] = videoId;
            let res = await dislikeVideo(body);
            setBackgroundProcessing(false)
            if(!res.status){
                layoutCtx.showSnackBar(res.message, res.type);
                return;
            }

            setLiked(false);
            let ls = +likes - 1;
            setLikes(ls);
            
        }catch(err){
            // layoutCtx.showSnackBar(err.message, err.type)
            console.log(err)
        }
    }


    const onCommentSubmit = async () => {
        let body = {};
        body['user_id'] = authCtx.user.id;
        body['video_id'] = videoId;
        body['content'] = commentInputValue;

        createComment(body).then(res => {
            if(res && res.status){
                //create new array with old comments
                let newCommentsArr = [...comments];
                let newComment = {...res.data};
                //add user to new comment
                newComment['user'] = authCtx.user;
                //push new comment to array
                newCommentsArr.push(newComment);
                setCommentInputValue('');
                setComments(newCommentsArr)

                //add newly inserted comment to array for filtering
                let a = [...newComments];
                a.push(newComment.id);
                setNewComments(a);
            }
        }).catch(err => {
            console.log(err)
        });
    }

    const handleLoadMore = () => {

        let offset = comments.length;
        if(newComments.length) offset = offset - newComments.length;

        let excludes = {};
        if(newComments.length) excludes['id'] = newComments;
        searchComments({fields:{video_id: videoId}, pagination:{limit: 5, offset}, excludes}, 1).then(res => {
            let nComments = [...comments];

            res.data.forEach((c,i) => {
                nComments.push(c)
            });
            setComments(nComments)
        }).catch(err => {
            console.log(err);
        });
    }
    

    return (
        <div className="watch-page">
            <section className="top">
                <div className="player-wrapper">
                    <div className="player">
                        {
                            video ? <VideoJS options={buildPlayerOptions(video)} onReady={el => handlePlayerReady(el)}  /> : ""
                        }
                    </div>

                    <div className="info">
                        <span className="title">
                            <h1>{video?.title}</h1>

                            <span className="stats">
                                <span>
                                    <IconButton><RemoveRedEyeIcon style={{color: 'white'}} /> </IconButton>
                                    <h5>{video?.view_count}</h5>
                                </span>

                                <span>
                                    {
                                        !liked ? <IconButton disabled={backgroundProcessing} onClick={handleVideoLike} ><FavoriteBorderIcon style={{color: 'white'}} /></IconButton> : <IconButton disabled={backgroundProcessing} onClick={handleVideoDislike}><FavoriteIcon style={{color: 'white'}} /></IconButton>
                                    }
                                    <h5>{likes}</h5>
                                </span>
                            </span>
                        </span>
                        <div className="channel">
                            <img src={getPhotoPublicPath(video?.channel?.photo)} alt="" />
                            <h2>{video?.channel?.name}</h2>
                        </div>
                        {
                            video?.description ?
                            <div className="description">
                                <ReadModeReact text={video.description} />
                            </div> : ""
                        }
                    </div>
                </div>
               
                <section className="bottom">
                    <div className="comment-list">
                        {
                            comments.map((c, i) => {
                                return (
                                    <div className="comment-item" key={`comment-${i}`}>
                                        {
                                            c.user.photo ? <div> <img src={getPhotoPublicPath(c.user.photo)} alt="" /> </div> :<div> <img src={UserPlaceHolder} alt="" /> </div>
                                        }

                                        <div>
                                            <span className="user-name">
                                                <span className="name">{`${c.user.first_name} ${c.user.last_name}`}</span>
                                                <span className="time-ago"><TimeAgo date={c.createdAt} /></span>
                                            </span>
                                            <span className="content">
                                                <ReadModeReact text={c.content} />
                                            </span>
                                        </div>
                                    </div>
                                );
                            })
                        }

                        {
                            comments.length < totalComments ?
                            <Button variant="text" color="info" className="load-more theme- w-100" onClick={handleLoadMore}>
                                load more
                            </Button> : ""
                        }
                    </div>
                    <div className="comment-box">
                        <TextField
                        inputProps={{style: {color: 'white'}}}
                        fullWidth
                        multiline placeholder={"Write comment here"} 
                        value={commentInputValue}
                        onChange={e => setCommentInputValue(e.target.value)}/>
                        <Button disabled={!commentInputValue.length} onClick={onCommentSubmit} variant="contained" className="btn theme-primary">Submit</Button>
                    </div>
                </section>
            </section>
            <section className="bottom">
                <div className="related-videos-wrapper">
                        {
                            relatedVideos.map( (item, i) => {
                                return (
                                    <div className="related-video-item">
                                        <img src={getVideoThumbnailPublicPath(item.thumbnail)} alt="thumbnail" />
                                        <div>
                                            <h1>{item.title}</h1>
                                            <h2>{item?.channel?.name}</h2>
                                            <h3>{item.view_count} views</h3>
                                        </div>
                                    </div>
                                );
                            })
                        }
                    </div>
            </section>
        </div>
    );
}

export default WatchPage;