import React, { useEffect } from 'react';
import LogoImg from '../../assets/images/logo.png';
import SearchBar from './components/SearchBar';
import UserProfile from './components/UserProfile';
import { AiOutlineMenu } from 'react-icons/ai';
import { IconButton } from '@mui/material';
import { useCtx } from '../../utils/context';

const TopBar = () => {

    const ctx = useCtx();

    const handleClickOutside = (e: any) => {
        if(e.target.id !== "MobileMenuToggleIcon" && e.target.id !== "MobileMenuToggleIconButton"){
            ctx.setSideNavOpen(false);
        }
    }

    useEffect(() => {

        window.addEventListener('click', handleClickOutside);

        return () => {
            window.removeEventListener('click', handleClickOutside);
        }
    }, [])

    const handleOpenSideNav = () => {
        ctx.setSideNavOpen(true);
    }

    return (
        <div className="top-bar">

            <IconButton id="MobileMenuToggleIconButton" className='mobile-menu-toggle' onClick={handleOpenSideNav} >
                <AiOutlineMenu id='MobileMenuToggleIcon' />
            </IconButton>

            <div className="logo" >
                <img src={LogoImg} alt="logo" />
            </div>

            {/* <div className="search-bar-container">
                <SearchBar />
            </div> */}
            
            <div className="tools">
                <UserProfile />
            </div>
        </div>
    );
}

export default TopBar;