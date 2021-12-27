import { useContext, useEffect, useRef, useState } from "react";
import { Carousel } from "react-responsive-carousel";
import { searchVideos, getVideoPublicPath, getVideoThumbnailPublicPath } from '../../../utils/services/request';
import { AuthContext } from '../../../utils/context/auth';
import { LayoutContext } from '../../../utils/context/layout';
import { Swiper, SwiperSlide } from 'swiper/react';
import SwiperCore, { EffectFade,Navigation,Pagination, Autoplay } from 'swiper';
import { useHistory, Link } from "react-router-dom";
import 'swiper/swiper-bundle.min.css';
import { Button } from "@mui/material";
import {PlayArrow} from '@mui/icons-material';
import VideoJs from '../../../components/VideoJsComponent';
import ReactPlayer from 'react-player';

SwiperCore.use([EffectFade, Navigation, Pagination, Autoplay]);

const Banner2 = (props) => {

    const [videoList, setVideoList] = useState([]);
    const [thumbNailList, setThumbnailList] = useState([]);
    const [currentVid, setCurrentVid] = useState(null);
    const [currentVidIndex, setCurrentVidIndex] = useState(0);

    const authCtx = useContext(AuthContext);
    const layoutCtx = useContext(LayoutContext);
    const history = useHistory();

    const moveToVideo = (id) => {
        history.push('/watch/' + id + '?f=home&s=mb');
    }

    const videoRef = useRef([]);
    const sliderRef = useRef(null);

    const videoOptions = { // lookup the options in the docs for more options
        autoplay: true,
        controls: true,
        responsive: true,
        fluid: true,
        muted: true,
        sources: [{
          src: null,
          type: 'video/mp4'
        }]
    }

    const createVideoOptions = (v) => {
        return {
            autoplay: false,
            controls: false,
            responsive: true,
            fluid: true,
            muted: true,
            // poster: getVideoThumbnailPublicPath(v.thumbnail),
            sources: [{
            src: getVideoPublicPath(v.url),
            // type: 'video/mp4'
            }]
        }
    }

    const handlePlayerReady = (player, i) => {
        // console.log(player, i, 'player')
        videoRef.current[i] = player;
    
        // you can handle player events here
        player.on('waiting', () => {
          console.log('player is waiting');
        });
    
        player.on('dispose', () => {
          console.log('player will dispose');
        });
    };

    const handleVideoChange = (v, i) => {
        // return;
        if(i > 0){
            let prevIndex = i - 1;
            videoRef.current[prevIndex].children_[0].pause();
            videoRef.current[i].children_[0].play()
            return;
        }

        if(videoRef.current.length)videoRef.current[videoList.length - 1].children_[0].pause();
        if(videoRef.current.length)videoRef.current[i].children_[0].play()
    }


    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        
        try{
            let res = await searchVideos({pagination: {limit: 5},fields: {banner: 1}});
            
            if(res.status){
                setVideoList(res.data);
                if(res.data){
                    setCurrentVidIndex(0);
                    setCurrentVid(res.data[0]);
                    handleVideoChange(res.data[0],0)
                    // setThumbnailList(videoList);
                }
                return;
            }

            layoutCtx.showSnackBar('Error: ' + res.message, 'error')
        }catch(err){
            layoutCtx.showSnackBar('Error: ' + err.message, 'error')
        }
    }

    const handleSliderChange = (e) => {
        // console.log(e);
        // return
        console.log(sliderRef.current)
        handleVideoChange(videoList[e.realIndex],e.realIndex);
        setCurrentVid(videoList[e.realIndex]);
        setCurrentVidIndex(e.realIndex);
    }

    const handleThumbnailClick = (event, video, index) => {
        handleVideoChange(video,index);
        setCurrentVid(video);
        setCurrentVidIndex(index);
    }

    const handleWatchNow = () => {
        
    }

    return (
        <div className="home-banner">
            <div className="slider-wrapper">

                <div className="thumbnails">
                    {
                        videoList.map((t,i) => {
                            return (
                                <div key={ `thumbnail-${i}`} className={`thumbnail-list-item ${currentVidIndex == i ? 'active' : ''}`} onClick={(e) => {handleThumbnailClick(e, t, i)}}>
                                    <h1>{t.title}</h1>
                                </div>
                            );
                        })
                    }
                </div>

                <Swiper 
                    // initialSlide={0}
                    spaceBetween={30} 
                    centeredSlides={true} 
                    effect="fade"
                    loop={true}
                    pagination={false}
                    observeParents
                    observer
                    autoplay={{
                        delay: "6000"
                    }} 
                    // navigation={true} 
                    className="slider"
                    // modules={[EffectFade]}
                    slidesPerView={1}
                    onSlideNextTransitionStart={handleSliderChange}
                    ref={sliderRef}
                >
                    { videoList ?
                        videoList.map((v,i) => {
                            return (
                                <SwiperSlide className='slider-item' key={`slider-item-${i}`}>


                                    <div className="content">
                                        <div className="info">
                                            <Link className="link" to={`/watch/${v.id}?f=home&s=mb`} ><h1>{v?.title}</h1></Link>

                                            <div className="watch-pill">
                                                <div className="play-button" onClick={handleWatchNow}>
                                                    <PlayArrow />
                                                </div>

                                                <h2>Watch now</h2>
                                            </div>
                                        </div>

                                        <VideoJs options={createVideoOptions(v)} onReady={(el) => handlePlayerReady(el, i)} />

                                        {/* <img src={getVideoThumbnailPublicPath(v.thumbnail)} alt="slide" /> */}
                                    </div>
                                </SwiperSlide>
                            )
                        }) : ''
                    }
                </Swiper>

            </div>
        </div>
    );
}

export default Banner2;