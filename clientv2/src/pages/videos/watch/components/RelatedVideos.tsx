import React, { useState, useEffect } from 'react';
import { CircularProgress } from '@mui/material';
const RelatedVideos: React.FC<{videoId: number}> = props => {

    const [processing, setProcessing] = useState(true);
    const [dataList, setDataList] = useState<any[]>([])

    useEffect(() => {
        loadData();
    }, [props.videoId]);

    const loadData = async () => {}

    return (
        <div className="related-videos">
            { processing ? 
                <CircularProgress className='progress' /> : 
                <div className="item-list">
                    {
                        dataList.map((item, index) => {
                            return (
                                <div className="item">
                                    <img src={item.thumbnail} alt="thumbnail" />
                                    <div className="info">
                                        <p className="name">{item?.title}</p>
                                        <p className="views">{item?.views?.length || 0} views</p>
                                    </div>
                                    <p className="channel">{item?.channel?.name}</p>
                                </div>
                            );
                        })
                    }
                </div> }
        </div>
    );
}

export default RelatedVideos;