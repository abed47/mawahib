import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCtx } from '../../utils/context';
import { PurchasesRequests } from '../../utils/services/request';
import CheerIcon from '../../assets/icons/cheer.png';
import ReactTimeAgo from 'react-time-ago';

const getStatusDiv = (status: any) => {
    switch (status) {
        case 1:
            return <div className={`status-pill-${status}`}>Pending</div>    
        case 2:
            return <div className={`status-pill-${status}`}>Verifying</div>    
        case 3:
            return <div className={`status-pill-${status}`}>Accepted</div>    
        case 4:
            return <div className={`status-pill-${status}`}>Cancelled</div>    
    }
}

const TransactionsPage: React.FC = props => {

    const [dataList, setDataList] = useState<any[]>([])

    const ctx = useCtx();
    const navigate = useNavigate();

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try{
            ctx.showPreloader();
            let res = await PurchasesRequests.getTransactionHistory();
            ctx.hidePreloader();


            if(res?.status === true){
                setDataList(res.data);
                return;
            }

            if(res?.status === false){
                ctx.showSnackbar(res?.message || 'server error', 'error');
                navigate('/wallet');
                return;
            }

            navigate('/wallet');
        }catch(err: any){
            ctx.hidePreloader();
            ctx.showSnackbar(err?.message || 'server error', 'error');
            navigate('/wallet');
        }
    }

    return (
        <div className="transactions-page">
            <h1>Transactions</h1>

            <table>
                <thead>
                    <tr>
                        <th>Transaction Ref</th>
                        <th>Cheer</th>
                        <th>Amount Paid</th>
                        <th>Date</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        dataList.map((item, index) => {
                            return (
                                <tr key={`transaction-list-item-${index}`}>
                                    <td>{item.ref}</td>
                                    <td>{item.amount} Cheer <img src={CheerIcon} alt="cheer icon" /></td>
                                    <td>${item.paid_amount}</td>
                                    <td><ReactTimeAgo date={item.createdAt} /></td>
                                    <td>{getStatusDiv(item.status)}</td>
                                </tr>
                            );
                        })
                    }
                </tbody>
            </table>
        </div>
    );
}

export default TransactionsPage;