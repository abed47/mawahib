import { Tab, Tabs, Box, Typography } from '@mui/material';
import React, { useState, useEffect } from 'react';
import { useCtx } from '../../utils/context';
import { ChannelRequests, handlePhotoUrl } from '../../utils/services/request';
import { FaThumbsUp } from 'react-icons/fa';
import moment from 'moment';
import { Bar, Line } from 'react-chartjs-2';
import TimeAgo from 'react-timeago';

import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    BarElement,
    Filler
  } from 'chart.js';

  ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    BarElement,
    Filler
  );

function a11yProps(index: any) {
    return {
      id: `simple-tab-${index}`,
      'aria-controls': `simple-tabpanel-${index}`,
    };
  }

  function TabPanel(props: any) {
    const { children, value, index, ...other } = props;
  
    return (
      <div
        role="tabpanel"
        hidden={value !== index}
        id={`simple-tabpanel-${index}`}
        aria-labelledby={`simple-tab-${index}`}
        {...other}
      >
        {value === index && (
          <Box sx={{ p: 3 }}>
            <Typography>{children}</Typography>
          </Box>
        )}
      </div>
    );
  }
  
//   TabPanel.propTypes = {
//     children: PropTypes.node,
//     index: PropTypes.number.isRequired,
//     value: PropTypes.number.isRequired,
//   };
const Dashboard: React.FC<any> = props => {

    const [recentFollowersCount, setRecentFollowersCount] = useState(0);
    const [topRecentFollowers, setTopRecentFollowers] = useState<any[]>([]);
    const [likeCount, setLikeCount] = useState(0);
    const [totalEarnings, setTotalEarnings] = useState(0);
    const [cheerEarnings, setCheerEarnings] = useState(0);
    const [eventEarnings, setEventEarnings] = useState(0);
    const [totalWatchHours, setTotalWatchHours] = useState(0);
    const [totalViewTimes, setTotalViewTimes] = useState(0);
    const [currentTab, setCurrentTab] = useState(0);
    const [watchTabData, setWatchTabData] = useState<any>({label: [], data: []})
    const [followersData, setFollowersData] = useState<{data: any[], labels: any[]}>({data: [], labels: []});
    const [earningsData, setEarningsData] = useState<{data: any[], labels: any[]}>({data: [], labels: []});
    const [latestComments, setLatestComments] = useState<any[]>([]);



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
                //followers
                setTopRecentFollowers(d.recentFollowers);
                setRecentFollowersCount(d.recent_followers_all - d.recentFollowers.length);
                //likes
                setLikeCount(d.likes);
                //earnings
                setEventEarnings(d.total_event_winnings ? d.total_event_winnings : 0);
                setCheerEarnings(d.total_cheer ? d.total_cheer : 0);
                //views and view times
                setTotalEarnings(calcEarnings(d.total_event_winnings, d.total_cheer));
                setTotalWatchHours(calcWatchHours(d.watchTime));
                setTotalViewTimes(calcViewTimes(d.watchTime));
                setWatchTabData(formatWatchTabData(d.watchTime));
                //followers chart
                setFollowersData(formatFollowerData(d.subscription_stats));
                setEarningsData(formatEarningsData(d.earnings_stats));
                //comments
                setLatestComments(d.latest_comments);
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

    const calcEarnings: (a: any, b: any) => number = (a, b) => {
        if(!a && !b) return 0;
        return (!a ? 0 : +a) + (!b ? 0 : +b)
    }

    const calcWatchHours = (d: any) => {
        if(d?.length){
            let totalHours = 0;

            d.forEach((item: any, index: number) => {
                totalHours += item.sum.minutesViewed
            })

            totalHours = +(totalHours / 60).toFixed(2);
            return totalHours
        }
        return 0;
    }

    const calcViewTimes = (d: any) => {
        if(d?.length){
            let vCount = 0;

            d.forEach((item: any, index: number) => {
                vCount += item.count
            })

            return vCount
        }
        return 0;
    }

    const formatWatchTabData = (d: any) => {
        let labelsObj: any = {};

        d.forEach((item: any) => {
            let t = moment(item.dimensions.datetimeHour, 'YYYY-MM-DDThh:mm:ss').format('MM-DD');
            if(labelsObj[t]){
                labelsObj[t] = labelsObj[t] + item.sum.minutesViewed
                // return
            }else{
                labelsObj[t] = item.sum.minutesViewed
            }
        });

        if(Object.keys(labelsObj).length){
            return {data: Object.keys(labelsObj).map(i => labelsObj[i]), labels: Object.keys(labelsObj)}
        }
        return {data: [], labels: []}
    }

    const formatFollowerData = (d: any) => {
        let labelsObj: any = {};

        d.forEach((i: any) => {
            labelsObj[moment(i.cat, 'YYYY-MM-DD').format('MM-DD')] = i.count;
        })

        if(Object.keys(labelsObj).length){
            return {data: Object.keys(labelsObj).map(i => labelsObj[i]), labels: Object.keys(labelsObj)}
        }

        return {data: [], labels: []}
    }

    const formatEarningsData = (d: any) => {
        let labelsObj: any = {};

        d.forEach((i: any) => {
            labelsObj[moment(i.cat, 'YYYY-MM-DD').format('MM-DD')] = i.sum;
        })

        if(Object.keys(labelsObj).length){
            return {data: Object.keys(labelsObj).map(i => labelsObj[i]), labels: Object.keys(labelsObj)}
        }

        return {data: [], labels: []}
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

                <section>
                    <div className="total-earnings">
                        <div className="top">
                            <div className="l">
                                <h1>Total Earnings</h1>
                                <p>This week</p>
                            </div>
                            <div className="r">

                            </div>
                        </div>

                        <div className="bottom">
                            <div className="count">
                                <h1>total earnings</h1>
                                <p>${totalEarnings}</p>
                            </div>
                            
                            <div className="count">
                                <h1>after tax</h1>
                                <p>${totalEarnings}</p>
                            </div>

                            <div className="chart">
                                <Bar width={50} height={50} options={{
                                    
                                    plugins: {
                                    legend: {
                                        display: false
                                    },
                                    
                                    },
                                    scales: {
                                        yAxes: {
                                            display: false
                                        },
                                        xAxes: {
                                            display: false
                                        }
                                    }
                                }} data={
                                    {
                                        labels: [''],
                                        datasets: [
                                            {data: [cheerEarnings], backgroundColor: '#006896', maxBarThickness: 7, borderRadius: 5},
                                            {data: [eventEarnings], backgroundColor: '#4BBEB6', maxBarThickness: 7, borderRadius: 5},
                                            // {data: [5], backgroundColor: '#9C9C9C', label: 'event', maxBarThickness: 7, borderRadius: 5},
                                        ],
                                    }
                                } />
                            </div>
                        </div>

                        <div className="listings">
                            <ul>
                                <li>
                                    <p>Cheer</p>
                                    <p>${cheerEarnings}</p>
                                </li>
                                <li>
                                    <p>Events</p>
                                    <p>${eventEarnings}</p>
                                </li>
                            </ul>
                        </div>
                    </div>

                    <div className="watch-time">
                        <div className="top">
                            <h1>Watch Time</h1>
                            <p>This Week</p>
                        </div>

                        <div className="bottom">
                            <div className="l">
                                <h1>{totalWatchHours}</h1>
                                <p>hours</p>
                            </div>

                            <div className="r">
                                <div className="circle"></div>
                            </div>
                        </div>

                        <div className="listings">
                            <ul>
                                <li>
                                    <p>total minutes</p>
                                    <p>{totalWatchHours * 60}</p>
                                </li>

                                <li>
                                    <p>view count</p>
                                    <p>{totalViewTimes}</p>
                                </li>
                            </ul>
                        </div>
                    </div>


                    <div className="charting">
                        <Box width={'100%'} sx={{ borderBottom: 1, borderColor: 'divider' }}>
                        <Tabs value={currentTab} onChange={(e, v) => {
                            setCurrentTab(v)
                        }} aria-label="basic tabs example">
                            <Tab className='tab-head' label="Total View Time" {...a11yProps(0)} />
                            <Tab className='tab-head' label="Followers" {...a11yProps(1)} />
                            <Tab className='tab-head' label="Earnings" {...a11yProps(2)} />
                        </Tabs>
                        </Box>
                        <TabPanel className="tab-panel" value={currentTab} index={0}>
                            <Line height={90} width={220} data={{
                                  labels: watchTabData.labels,

                                    datasets: [
                                    {
                                        label: "Minutes",
                                        data: watchTabData.data,
                                        fill: true,
                                        backgroundColor: "#4bbeb61a",
                                        borderColor: "rgba(75,192,192,1)",
                                        borderWidth: 1,
                                        pointBackgroundColor: '#FFFFFF'
                                    }                                
                            ]}} />
                        </TabPanel>
                        <TabPanel className="tab-panel" value={currentTab} index={1}>
                            <Line height={90} width={220} data={{
                                    labels: followersData.labels,

                                        datasets: [
                                        {
                                            label: "Followers",
                                            data: followersData.data,
                                            fill: true,
                                            backgroundColor: "#4bbeb61a",
                                            borderColor: "rgba(75,192,192,1)",
                                            borderWidth: 1,
                                            pointBackgroundColor: '#FFFFFF'
                                        }                                
                                ]}} />
                        </TabPanel>
                        <TabPanel className="tab-panel" value={currentTab} index={2}>
                            <Line height={90} width={220} data={{
                                    labels: earningsData.labels,

                                        datasets: [
                                        {
                                            label: "First dataset",
                                            data: earningsData.data,
                                            fill: true,
                                            backgroundColor: "#4bbeb61a",
                                            borderColor: "rgba(75,192,192,1)",
                                            borderWidth: 1,
                                            pointBackgroundColor: '#FFFFFF'
                                        }                                
                                ]}} />
                        </TabPanel>
                    </div>

                    <div className="latest-comments">
                        <h1 className='title'>Latest comments</h1>

                        <div className="item-list">
                            {
                                latestComments.map((item: any, i: number) => {
                                    return (
                                        <div className="list-item" key={`comment-list-item-${i}`}>
                                            <div className="l">
                                                <img src={handlePhotoUrl(item?.user?.photo, "user")} alt="" />
                                            </div>
                                            <div className="r">
                                                <h2>{item.user.name} <span><TimeAgo date={item.createdAt} /></span></h2>
                                                <p>{item.content}</p>
                                            </div>
                                        </div>
                                    )
                                })
                            }
                        </div>
                    </div>
                </section>
            </main>
        </div>
    )
}

export default Dashboard;