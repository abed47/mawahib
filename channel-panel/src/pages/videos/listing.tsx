import React, { useState, useEffect } from 'react';
import { Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useCtx } from '../../utils/context';
import { VideoRequests, handlePhotoUrl, ChannelRequests } from '../../utils/services/request';
import moment from 'moment';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { shortenNumber } from '../../utils/helpers';

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
            let res = await ChannelRequests.getChannelVideo({
                channel_id: channelId,
                pagination:{limit: rowsPerPage, offset: 0}});
            ctx.hidePreloader();

            console.log(res);

            if(res && res?.status){
                setDataList(res.data);
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

                    <tbody>
                        {
                            dataList.map((item, i) => {
                                return (
                                    <tr className="table-row" key={`video-list-item-key-${i}`}>
                                        <td><input type="checkbox" /></td>   
                                        <td className='video'>
                                            <img src={handlePhotoUrl(item.thumbnail, "video")} alt="" />
                                            <div className="info">
                                                <p className="title">{item.title}</p>
                                                <p className="date">{moment(item.createdAt, 'YYYY-MM-DDThh:mm:ssZ').format('MMM DD, YYYY')}</p>    
                                            </div>
                                        </td>    
                                        <td className='visibility'>
                                            {
                                            item.visible ? 
                                                <div className="icon-ize">
                                                    <RemoveRedEyeIcon className='icon active' />
                                                    <p>Public</p>
                                                </div>
                                                : 
                                                <div className="icon-ize">
                                                    <RemoveRedEyeIcon className='icon active' />
                                                    <p>Private</p>
                                                </div>
                                        }
                                        </td>    
                                        <td>
                                            <p className='text f-16 c-1 f-base m0'>{shortenNumber(item.view_count)}</p>
                                        </td>    
                                        <td>
                                            <p className='text f-16 c-1 f-base m0'>{shortenNumber(item.comment_count)}</p>
                                        </td>    
                                    </tr>
                                );
                            })
                        }
                    </tbody>
                </table>
            </main>
        </div>
    );
}

export default VideoListing;