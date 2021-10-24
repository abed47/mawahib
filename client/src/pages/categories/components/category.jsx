import { useEffect, useRef, useState } from "react";
import { CircularProgress } from '@mui/material';
import VideoItem from "./videoItem";

const CategoryPage = () => {
    const [videoList, setVideoList] = useState([1,2,3,4,5,5,6,6,7,7,8,56,4,34,34,5,345,345,34,345,534,534,534,534,345,345,345,534]);
    const [totalVideos, setTotalVideos] = useState(90);
    const [processing, setProcessing] = useState(false);

    const pageRef = useRef(null);

    useEffect(() => {

    }, [])

    const handleScroll = (e) => {
        let scrollHeight = e.target.scrollHeight;
        let scrollTop = e.target.scrollTop;
        let clientHeight = e.target.clientHeight;

        let currentPosition = scrollTop + clientHeight;

        if(currentPosition === scrollHeight){
            loadMore();
        }
    }

    const loadMore = () => {
        if(videoList.length < totalVideos){
            setProcessing(true);
        }
    }
    return (
        <div className="category-page" ref={pageRef} onScroll={handleScroll}>
            {
                videoList.map((item, index) => {
                    return <VideoItem key={'category-page-item-video' + index} {...item} />
                })
            }

            <div className={`loader ${processing ? 'active' : ''}`}>
                <CircularProgress />
            </div>
        </div>
    );
}

export default CategoryPage;