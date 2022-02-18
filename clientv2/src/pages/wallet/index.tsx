import React, { useState, useEffect } from 'react';
import { useCtx } from '../../utils/context';
import { useNavigate } from 'react-router-dom';

const Wallet: React.FC = props => {

    const navigate = useNavigate();
    const ctx = useCtx();

    useEffect(() => {
        loadData();
    }, []);

    const loadData = () => {
        if(!ctx.currentUser?.id) navigate('/login')
    }
    return (
        <div className="wallet-page"></div>
    );
}

export default Wallet;