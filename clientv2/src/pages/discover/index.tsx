import React from 'react';
import HomeBanner from './components/banner';
import { videos, channels, categories } from '../../assets/data';
import TopTalents from './components/top-talents';
import HomeRecommendedVideos from './components/recommended';
import TopCategoriesComponent from './components/top-categories';
import OtherVideoListComponent from './components/other-videos';

const Discover: React.FC = props => {
    return (
        <div className="discover-page">
            <HomeBanner items={videos} />
            <TopTalents items={channels} />
            <HomeRecommendedVideos items={videos} />
            <TopCategoriesComponent items={categories} />
            <OtherVideoListComponent items={videos} />
        </div>
    );
}

export default Discover;