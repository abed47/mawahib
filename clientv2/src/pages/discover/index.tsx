import React, { useEffect, useState } from 'react';
import HomeBanner from './components/banner';
import TopTalents from './components/top-talents';
import HomeRecommendedVideos from './components/recommended';
import TopCategoriesComponent from './components/top-categories';
import OtherVideoListComponent from './components/other-videos';
import { useCtx } from '../../utils/context';
import { UtilsRequests } from '../../utils/services/request';

const Discover: React.FC = props => {

    const [bannerItems, setBannerItems] = useState([]);
    const [topTalents, setTopTalents] = useState([]);
    const [recommendedList, setRecommendedList] = useState([]);
    const [categories, setCategories] = useState([]);
    const [otherVideos, setOtherVideos] = useState([]);
    const [liveTalents, setLiveTalents] = useState([]);

    const ctx = useCtx();

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try{
            ctx.showPreloader();
            let res = await UtilsRequests.getHome();
            ctx.hidePreloader();

            if(res && res?.status){
                ctx.hidePreloader();
                let d = res.data;
                setCategories(d.categories);
                setBannerItems(d.bannerItems);
                setTopTalents(d.topTalents[0]);
                setRecommendedList(d.recommended);
                setOtherVideos(d.otherVideos);
                setLiveTalents(d.liveTalents);
                console.log(d)
                return;
            }

            if(res && res?.status === false){
                ctx.showSnackbar(res?.message || 'server error', 'error');
                return;
            }

            ctx.showSnackbar(res?.request?.data?.message || 'server error', 'error');
        }catch(err: any){
            ctx.hidePreloader();
            ctx.showSnackbar(err?.message || 'server error', 'error');
        }
    }
    return (
        <div className="discover-page">
            <HomeBanner items={bannerItems} />
            <TopTalents items={topTalents} live={liveTalents || []} />
            <HomeRecommendedVideos items={recommendedList} />
            <TopCategoriesComponent items={categories} />
            <OtherVideoListComponent items={otherVideos} />
        </div>
    );
}

export default Discover;