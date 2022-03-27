import { Button } from '@mui/material';
import React, { useState, useEffect } from 'react';
import { useCtx } from '../../utils/context';
import { ChannelRequests } from '../../utils/services/request';

const Dashboard: React.FC<any> = props => {

    const ctx = useCtx();

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try{
            ctx.showPreloader();
            let res = await ChannelRequests.channelDashboard({channel_id: ctx.channel.id});
            ctx.hidePreloader();
            console.log(res);
        }catch(err: any){
            ctx.hidePreloader();
            ctx.showSnackbar(err?.message || 'server error', 'error');
        }
    }

    return (
        <div className="dashboard">
            <header>
                <h1>Dashboard</h1>

                <Button>Back to Website</Button>
            </header>
            <main>
                <aside></aside>
                <section></section>
            </main>
        </div>
    )
}

export default Dashboard;