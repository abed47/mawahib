import React, { useState, useEffect } from 'react';
import { Button, TablePagination } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useCtx } from '../../utils/context';
import { VideoRequests, handlePhotoUrl, ChannelRequests } from '../../utils/services/request';
import moment from 'moment';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { shortenNumber } from '../../utils/helpers';

const VideoListing: React.FC = props => {

    const [dataList, setDataList] = useState<any[]>([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [totalRows, setTotalRows] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    const navigation = useNavigate();
    const ctx = useCtx();
    
    useEffect(() => {
        loadData();
    }, []);

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
                setTotalRows(res.pagination.totalRows);
                setTotalPages(Math.ceil(res.pagination.totalRows / rowsPerPage))
            }
        }catch(err: any){
            ctx.hidePreloader();
            ctx.showSnackbar(err?.message || 'server error', 'error');
        }
    }

    const handleChangePage = (e: any, v: any) => {
        setCurrentPage(v);
        loadMore(v * rowsPerPage, rowsPerPage);
    }

    const handleChangeRowsPerPage = (e: any) => {
        let v = e.target.value;
        setRowsPerPage(v);
        loadMore(currentPage, v);
    }

    const loadMore = async (offset: any, limit: any) => {
        try{
            let channelId = ctx.channel?.id;
            ctx.showPreloader();
            let res = await ChannelRequests.getChannelVideo({
                channel_id: channelId,
                pagination:{limit: limit, offset}});
            ctx.hidePreloader();

            console.log(res);

            if(res && res?.status){
                setDataList(res.data);
                setTotalRows(res.pagination.totalRows);
                setTotalPages(Math.ceil(res.pagination.totalRows / rowsPerPage))
            }
        }catch(err: any){
            ctx.hidePreloader();
            ctx.showSnackbar(err?.message || 'server error', 'error');
        }
    }

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
                            {/* <td><input type="checkbox" /></td> */}
                            <td className='text f-14 c-2'>Video</td>
                            <td className='text f-14 c-2'>Visibility</td>
                            <td className='text f-14 c-2'>Views</td>
                            <td className='text f-14 c-2'>Comments</td>
                            <td className='text f-14 c-2'>Likes</td>
                        </tr>
                    </thead>

                    <tbody>
                        {
                            dataList.map((item, i) => {
                                return (
                                    <tr className="table-row" key={`video-list-item-key-${i}`}>
                                        {/* <td><input type="checkbox" /></td>    */}
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
                                                    <VisibilityOffIcon className='icon active' />
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
                                        <td>
                                            <p className='text f-16 c-1 f-base m0'>{shortenNumber(item.like_count)}</p>
                                        </td>    
                                    </tr>
                                );
                            })
                        }
                    </tbody>
                </table>
            </main>

            <footer>
                <TablePagination
                    className='pagination'
                    component="div"
                    count={totalRows}
                    page={currentPage}
                    onPageChange={handleChangePage}
                    rowsPerPage={rowsPerPage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                    />
            </footer>
        </div>
    );
}

export default VideoListing;