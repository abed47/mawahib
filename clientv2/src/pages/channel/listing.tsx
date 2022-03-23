import React, { useState, useEffect } from 'react';
import { useCtx } from '../../utils/context';
import { Pagination } from '@mui/material';
import { ChannelRequests, handlePhotoUrl } from '../../utils/services/request';
import { useNavigate } from 'react-router-dom';

const ChannelListing: React.FC = props => {

    const [dataList, setDataList] = useState<any[]>([]);
    const [offset, setOffset] = useState(0);
    const [totalRows, setTotalRows] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageCount, setPageCount] = useState(0);
    
    const ctx = useCtx();
    const navigate = useNavigate();

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try{
            let res = await ChannelRequests.search(
                { 
                    pagination: { 
                        limit: 20, 
                        offset: 0
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

    const handlePaginationChange: (event: React.ChangeEvent<unknown>, page: number) => void = (e, page) => {
        setCurrentPage(page);
        paginate(page)
    }

    const paginate = async (p: number) => {
        try{
            let res = await ChannelRequests.search(
                { 
                    pagination: { 
                        limit: 20, 
                        offset: 20 * (p - 1)
                    } 
                }
                );
            if(res && res?.status){
                setDataList(res.data);
                setTotalRows(res.pagination.totalRows);
                setPageCount(Math.ceil(res.pagination.totalRows / 20));
            }
        }catch(err: any){
            ctx.hidePreloader();
        }
    }

    const moveTo = (s: string) => {
        navigate(s);
    }

    return (
        <div className="channel-listing-page">

            <div className="item-list">
                {
                    dataList.map((item: any, index) => {
                        return (
                            <div className="list-item" key={`list-item-key-${index}`} onClick={() => moveTo('/channel/' + item.id)}>
                                <img src={handlePhotoUrl(item.photo)} alt="" />
                                <div className="info">
                                    <p className='name'>{item.name}</p>
                                    <p className="subs">{item.subscription_count} subs.</p>
                                </div>
                            </div>
                        )
                    })
                }
            </div>

            <div className="pagination">
                <Pagination page={currentPage} count={pageCount} size="small" onChange={handlePaginationChange} />
            </div>

        </div>
    )
}

export default ChannelListing;