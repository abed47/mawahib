import React, { MouseEventHandler, useEffect, useRef, useState } from 'react';
import { BsFillGrid1X2Fill, BsBookFill, BsViewList } from 'react-icons/bs';
import { IoArrowUp } from 'react-icons/io5';
import { BiCalendarMinus } from 'react-icons/bi';
import { HiClipboardList } from 'react-icons/hi';
import { FaPlay } from 'react-icons/fa';
import { useLocation, useNavigate } from 'react-router-dom';
import { useCtx } from '../../utils/context';
const SideNav: React.FC = () => {

    const [bgTop, setBgTop] = useState<number>(0);
    const [activePath, setActivePath] = useState<string>('/');

    const discoverRef = useRef<HTMLDivElement>(null);
    const categoriesRef = useRef<HTMLDivElement>(null);
    const eventsRef = useRef<HTMLDivElement>(null);
    const playlistRef =  useRef<HTMLDivElement>(null);
    const channelRef = useRef<HTMLDivElement>(null);
    const continueWatchingRef = useRef<HTMLDivElement>(null);
    const votedNowRef = useRef<HTMLDivElement>(null);
    const bgRef = useRef<HTMLDivElement>(null);
    
    const location = useLocation();
    const navigate = useNavigate();
    const ctx = useCtx();

    useEffect(() => {
        handleCurrentPage('/')
    }, [location.pathname, activePath]);

    const handleCurrentPage = (p: string) => {
        setActivePath(location.pathname);
        if(activePath === '/') setBgTop(discoverRef?.current?.offsetTop || 5);
        if(activePath.includes('/cat')) setBgTop(categoriesRef?.current?.offsetTop || 5);
        if(activePath.includes('/channel')) setBgTop(channelRef?.current?.offsetTop || 5);
        if(activePath.includes('/event')) setBgTop(eventsRef?.current?.offsetTop || 5);
        if(activePath.includes('/playlist')) setBgTop(playlistRef?.current?.offsetTop || 5);
        if(activePath.includes('/continue-watching')) setBgTop(continueWatchingRef?.current?.offsetTop || 5);
        if(activePath.includes('/voted')) setBgTop(votedNowRef?.current?.offsetTop || 5);
    }

    const handleClick: MouseEventHandler<HTMLDivElement> = (e) => {
        setBgTop(e.currentTarget?.offsetTop || 5);
        navigate(e.currentTarget.innerText === 'Discover' ? '/' : e.currentTarget.innerText.toLocaleLowerCase().replace(/ /, '-'))
    }

    return (
        <div className="side-nav">
            
            <div className="link-list">

                <div className="active-background" ref={bgRef} style={{top: bgTop}}></div>

                <div className="link-list-item-wrapper">

                    <div className={`link-list-item ${activePath === '/' ? 'active' : ''}`} ref={discoverRef} onClick={handleClick}>
                        <BsFillGrid1X2Fill className='icon' />

                        <p>Discover</p>
                    </div>

                    <div className={`link-list-item ${activePath.includes('/cat') ? 'active' : ''}`} ref={categoriesRef} onClick={handleClick}>
                        <BsBookFill className='icon' />

                        <p>Categories</p>
                    </div>

                    <div className={`link-list-item ${activePath.includes('/event') ? 'active' : ''}`} ref={eventsRef} onClick={handleClick}>
                        <BiCalendarMinus className='icon' />

                        <p>Events</p>
                    </div>

                    <div className={`link-list-item ${activePath.includes('/playlist') ? 'active' : ''}`} ref={playlistRef} onClick={handleClick}>
                        <HiClipboardList className='icon' />

                        <p>Playlists</p>
                    </div>

                    <div className={`link-list-item ${activePath.includes('/channel') ? 'active' : ''}`} ref={channelRef} onClick={handleClick}>
                        <BsViewList className='icon' />

                        <p>Channels</p>
                    </div>

                    <div className={`link-list-item ${activePath.includes('/continue-watching') ? 'active' : ''}`} ref={continueWatchingRef} onClick={handleClick}>
                        <FaPlay className='icon' />

                        <p>Continue Watching</p>
                    </div>

                    <div className={`link-list-item ${activePath.includes('/vote') ? 'active' : ''}`} ref={votedNowRef} onClick={handleClick}>
                        <IoArrowUp className='icon' />

                        <p>Voted Now</p>
                    </div>
                </div>

            </div>

            <hr />


            <div className="pinned-category-list">

                <h3>Pinned Category</h3>

                <ul>
                    {
                        ctx.pinnedCategories.map((item, index) => {
                            return <li key={`side-nav-pinned-category-item-${index}`} onClick={() => navigate('/category/' + item.id)}>{item.name}</li>
                        })
                    }
                </ul>
            </div>
        </div>
    )
}

export default SideNav;