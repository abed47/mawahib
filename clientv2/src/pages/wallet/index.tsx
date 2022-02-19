import React, { useState, useEffect } from 'react';
import { useCtx } from '../../utils/context';
import { useNavigate } from 'react-router-dom';
import CheerIcon from '../../assets/icons/cheer.png';
import { PurchasesRequests, getServerPhoto } from '../../utils/services/request';
import { Button } from '@mui/material';
import { Link } from 'react-router-dom';

const Wallet: React.FC = props => {

    const [balance, setBalance] = useState(0);
    const [productList, setProductList] = useState<any[]>([]);

    const navigate = useNavigate();
    const ctx = useCtx();

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        if(!ctx.currentUser?.id) navigate('/login')
        try{
            ctx.showPreloader();
            let prods:any = await PurchasesRequests.listProducts();
            let walletInfo = await PurchasesRequests.walletInfo();
            ctx.hidePreloader();
            setProductList(prods.data);
            setBalance(walletInfo.data[0].balance);
        }catch(err: any){
            ctx.hidePreloader();
            ctx.showSnackbar(err?.message || 'server error', 'error')
        }
    }

    return (
        <div className="wallet-page">

            <h1 className="title">Wallet</h1>
            <hr />

            <main>
                <div className="s1">
                    <p className="title">Add Cheer To Your Mawahib Account</p>

                    <ul className='product-list'>
                        {
                            productList.map((item, index) => {
                                return (
                                    <li className="product-list-item" key={`product-list-item-${index}`}>
                                        <div className="info">
                                            <img src={item?.photo ? getServerPhoto(item.photo) : CheerIcon} alt="" />
                                            <div>
                                                <h1>{item.name}</h1>
                                                <span>{item.description}</span>
                                            </div>
                                        </div>

                                        <div className="purchase-button">
                                            <h5>${item.price}</h5>
                                            <Button className="btn" onClick={() => navigate('/checkout/' + item?.id)}>Add</Button>
                                        </div>
                                    </li>
                                );
                            })
                        }
                    </ul>
                </div>
                <div className="s2">
                    <p className="title small">Your Balance</p>
                    <div className="balance">
                        <img src={CheerIcon} alt="balance icon" />
                        <p>{balance || 0} Cheer</p>
                    </div>
                </div>
            </main>

            <div className="transactions">
                 <p>View your <Link to={'/transaction-history'}>transactions</Link> history</p>
            </div>
        </div>
    );
}

export default Wallet;