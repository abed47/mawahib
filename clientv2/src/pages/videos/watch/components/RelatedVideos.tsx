import React, { useState, useEffect } from 'react';
import { CircularProgress } from '@mui/material';
import { useCtx } from '../../../../utils/context';
import { VideoRequests } from '../../../../utils/services/request';

const RelatedVideos: React.FC<{category: number}> = props => {

    const [processing, setProcessing] = useState(false);
    const [dataList, setDataList] = useState<any[]>([]);
    const [totalRows, setTotalRows] = useState<number>(0);

    const ctx = useCtx();

    useEffect(() => {
        loadData();
        
        return () => {
            setDataList([])
        }
    }, [props.category]);

    const loadData = async () => {
        if(!props?.category) return;
        try{
            setProcessing(true);
            let res: any = await VideoRequests.getRelatedVideos({
                fields: { category_id: props.category },
                pagination: { limit: 6, offset: dataList.length }
            });
            setProcessing(false);
            
            if(res && res?.status){
                setDataList(res.data);
            }
        }catch(err: any){
            setProcessing(false);
            ctx.showSnackbar(err?.message || 'server error', 'error');
        }
    }

    return (
        <div className="related-videos">
            { processing ? 
                <CircularProgress className='progress' /> : 
                <div className="item-list">
                    {
                        dataList?.length ? dataList.map((item, index) => {
                            return (
                                <div className="item" key={`related-video-list-item-${index}`}>
                                    <img src={item.thumbnail} alt="thumbnail" />
                                    <div className="info">
                                        <p className="name">{item?.title}</p>
                                        <p className="views">{item?.views?.length || 0} views</p>
                                    </div>
                                    <p className="channel">{item?.channel?.name}</p>
                                </div>
                            );
                        }) : null
                    }
                </div> }
        </div>
    );
}

export default RelatedVideos;