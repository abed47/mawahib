import React, { useState, useEffect } from 'react';
import { Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useCtx } from '../../utils/context';
import { VideoRequests } from '../../utils/services/request';

const VideoListing: React.FC = props => {

    const [dataList, setDataList] = useState<any[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalRows, setTotalRows] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    const navigation = useNavigate();
    const ctx = useCtx();
    
    useEffect(() => {
        loadData();
    }, []);

    const getOffset = (n: number) => {
        if(n === 1) return 0;
        if(n > 1) return n / rowsPerPage
    }

    const loadData = async () => {
        try{
            let channelId = ctx.channel?.id;
            ctx.showPreloader();
            let res = await VideoRequests.searchVideos({
                fields: {channel_id: channelId}, 
                pagination:{limit: rowsPerPage, offset: 0}});
            ctx.hidePreloader();

            console.log(res);

            if(res && res?.status){

            }
        }catch(err: any){
            ctx.hidePreloader();
            ctx.showSnackbar(err?.message || 'server error', 'error');
        }
    }

    const handleLoadMore = () => {}

    const handleNext = () => {}

    const handlePrevious = () => {}

    const navigateTo = (url: string) => {
        navigation(url);
    }


    return (
        <div className="page-video-listing">
            <header>
                <h1>Videos</h1>
                <Button className='btn secondary' onClick={() => navigateTo('/videos/upload')}>Upload</Button>
            </header>

            <hr />

            <main>

                <table>
                    <thead>
                        <tr>
                            <td><input type="checkbox" /></td>
                            <td>Video</td>
                            <td>Visibility</td>
                            <td>Views</td>
                            <td>Comments</td>
                            <td>Likes</td>
                        </tr>
                    </thead>
                </table>
            </main>
        </div>
    );
}

export default VideoListing;