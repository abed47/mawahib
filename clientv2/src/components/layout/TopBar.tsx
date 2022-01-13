import React from 'react';
import LogoImg from '../../assets/images/logo.png';
import SearchBar from './components/SearchBar';
import UserProfile from './components/UserProfile';

const TopBar = () => {
    return (
        <div className="top-bar">

            <div className="logo">
                <img src={LogoImg} alt="logo" />
            </div>

            <div className="search-bar-container">
                <SearchBar />
            </div>
            
            <div className="tools">
                <UserProfile />
            </div>
        </div>
    );
}

export default TopBar;