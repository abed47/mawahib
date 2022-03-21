import React, { useState, useEffect } from 'react';
import { useCtx } from '../../utils/context';
import { Pagination } from '@mui/material';
import { ChannelRequests } from '../../utils/services/request';

const ChannelListing: React.FC = props => {

    const [dataList, setDataList] = useState<any[]>([]);
    const [offset, setOffset] = useState(0);
    const [totalRows, setTotalRows] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageCount, setPageCount] = useState(0);
    
    const ctx = useCtx();

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try{
            let res = await ChannelRequests.search(
                { 
                    pagination: { 
                        limit: 15, 
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

    return (
        <div className="channel-listing-page">

            <div className="item-list"></div>

            <div className="pagination">
                <Pagination page={currentPage} count={pageCount} size="small" onChange={handlePaginationChange} />
            </div>

        </div>
    )
}

export default ChannelListing;