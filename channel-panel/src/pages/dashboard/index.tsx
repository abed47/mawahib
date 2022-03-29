import { Button } from '@mui/material';
import React, { useState, useEffect } from 'react';
import { useCtx } from '../../utils/context';
import { ChannelRequests, handlePhotoUrl } from '../../utils/services/request';
import { FaThumbsUp } from 'react-icons/fa';
const Dashboard: React.FC<any> = props => {

    const [recentFollowersCount, setRecentFollowersCount] = useState(0);
    const [topRecentFollowers, setTopRecentFollowers] = useState<any[]>([]);
    const [likeCount, setLikeCount] = useState(0);

    const ctx = useCtx();

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try{
            ctx.showPreloader();
            let res = await ChannelRequests.channelDashboard({channel_id: ctx.channel.id});
            ctx.hidePreloader();
            
            if(res && res?.status){
                console.log(res);
                let d = res.data;
                setTopRecentFollowers(d.recentFollowers)
                setRecentFollowersCount(d.recent_followers_all - d.recentFollowers.length)
                setLikeCount(d.likes);
                return;
            }

            if(res && res?.status === false){
                ctx.showSnackbar(res.message || 'server error', 'error');
                
                return;
            }

            if(res?.response?.data?.data?.status === false){
                ctx.showSnackbar(res?.response?.data?.data?.message || 'server error', 'error');
            }
        }catch(err: any){
            ctx.hidePreloader();
            ctx.showSnackbar(err?.message || 'server error', 'error');
        }
    }

    return (
        <div className="page-dashboard">
            <header>
                <h1>Dashboard</h1>

                {/* <Button>Back to Website</Button> */}
            </header>
            <main>
                <aside>
                    <div className="recent-followers">
                        <h1>Recent Followers</h1>
                        <p>Today</p>

                        <div className="followers-list">
                            {
                                topRecentFollowers.map((item, i) => {
                                    return (
                                        <div className="follower-icon" key={`follower-icon-${i}`}>
                                            <img src={handlePhotoUrl(item.user.photo, "user")} alt="" />
                                        </div>
                                    )
                                })
                            }

                            {recentFollowersCount ? <p>+{recentFollowersCount} more</p> : null}
                        </div>
                    </div>

                    <div className="recent-likes">
                        <h1>Likes</h1>
                        <p>This Week</p>

                        <div className="like-count">
                            <FaThumbsUp className='icon' />

                            <p>{likeCount.toLocaleString()}</p>
                        </div>
                    </div>
                </aside>
                <section></section>
            </main>
        </div>
    )
}

export default Dashboard;