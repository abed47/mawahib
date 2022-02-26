import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useCtx } from '../../utils/context';
import { getVideoThumb, VideoRequests } from '../../utils/services/request';
import { Pagination } from '@mui/material';

const CategoryListing: React.FC = props => {

    const [dataList, setDataList] = useState([]);
    const [processing, setProcessing] = useState(false);
    const [offset, setOffset] = useState(0);
    const [totalRows, setTotalRows] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageCount, setPageCount] = useState(0);

    const { id } = useParams();
    const navigate = useNavigate();
    const ctx = useCtx();

    useEffect(() => {
        loadData();
    }, [id]);

    const loadData = async () => {
        try{
            let res = await VideoRequests.searchVideos({ fields: { category_id: id }, pagination: { limit: 15, offset} });
            
            if(res && res?.status){
                setDataList(res.data);
                setTotalRows(res.pagination.totalRows);
                setPageCount(Math.ceil(res.pagination.totalRows / 15));
            }
        }catch(err: any){
            ctx.hidePreloader();
            ctx.showSnackbar(err?.message || 'server error', 'error');
        }
    }
    
    const handleThumbnail = (url: string) => {
        if(url?.match(/https/ig)?.length) return url;
        return getVideoThumb(url);
    }

    const handlePaginationChange: (event: React.ChangeEvent<unknown>, page: number) => void = (e, page) => {
        setCurrentPage(page);
        paginate(page)
    }

    const paginate = async (p: number) => {
        try{
            let res = await VideoRequests.searchVideos(
                { 
                    fields: { category_id: id }, 
                    pagination: { 
                        limit: 15, 
                        offset: 15 * (p - 1)
                    } 
                }
                );
            
            if(res && res?.status){
                setDataList(res.data);
                setTotalRows(res.pagination.totalRows);
                setPageCount(Math.ceil(res.pagination.totalRows / 15));
            }
        }catch(err: any){
            ctx.hidePreloader();
            
        }
    }

    const handleVideoClick = (item: any) => {
        navigate('/watch/' + item.id);
    }

    return (
        <div className="category-listing-page">
            <div className="title">
                <h1>Category</h1>
            </div>
            <main>
                <div className="video-item-list">
                    {
                        dataList.map((item: any, index) => {
                            return (
                                <div className="video-list-item" key={`video-list-item-${index}`} onClick={() => handleVideoClick(item)}>
                                    <img src={handleThumbnail(item?.thumbnail)} alt="video thumb" />
                                    <div className="info">
                                        <div className="l">
                                            <h2 className="video-title">{item.title}</h2>
                                            <p className="channel-name">{item?.channel?.name}</p>
                                        </div>
                                        <div className="r">
                                            <p className="views">{item.views.length} views</p>
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    }
                </div>
            </main>
            <div className="pagination">
                <Pagination page={currentPage} count={pageCount} size="small" onChange={handlePaginationChange} />
            </div>
        </div>
    );
}

export default CategoryListing;