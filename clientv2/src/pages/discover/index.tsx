import React from 'react';
import HomeBanner from './components/banner';
import { videos } from '../../assets/data';
const Discover: React.FC = props => {
    return (
        <div className="discover-page">
            <HomeBanner items={videos} />
        </div>
    );
}

export default Discover;