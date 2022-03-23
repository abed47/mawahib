import React, { MouseEventHandler, useEffect, useRef, useState } from 'react';
import { BsFillGrid1X2Fill } from 'react-icons/bs';
import { useLocation, useNavigate } from 'react-router-dom';
import { BsFillPlayCircleFill } from 'react-icons/bs';
import { MdPersonAddAlt1 } from 'react-icons/md';

const SideNav: React.FC = () => {

    const [bgTop, setBgTop] = useState<number>(0);
    const [activePath, setActivePath] = useState<string>('/');

    const dashboardRef = useRef<HTMLDivElement>(null);
    const videosRef = useRef<HTMLDivElement>(null);
    const categoriesRef = useRef<HTMLDivElement>(null);
    const eventsRef = useRef<HTMLDivElement>(null);
    const playlistRef =  useRef<HTMLDivElement>(null);
    const channelRef = useRef<HTMLDivElement>(null);
    const continueWatchingRef = useRef<HTMLDivElement>(null);
    const votedNowRef = useRef<HTMLDivElement>(null);
    const bgRef = useRef<HTMLDivElement>(null);
    const followersRef = useRef<HTMLDivElement>(null);

    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        handleCurrentPage('/')
    }, [location.pathname, activePath]);

    const handleCurrentPage = (p: string) => {
        setActivePath(location.pathname);
        if(activePath === '/') setBgTop(dashboardRef?.current?.offsetTop || 5);
        if(activePath.includes('/videos')) setBgTop(videosRef?.current?.offsetTop || 5)
        if(activePath.includes('/cat')) setBgTop(categoriesRef?.current?.offsetTop || 5);
        if(activePath.includes('/channel')) setBgTop(channelRef?.current?.offsetTop || 5);
        if(activePath.includes('/event')) setBgTop(eventsRef?.current?.offsetTop || 5);
        if(activePath.includes('/playlist')) setBgTop(playlistRef?.current?.offsetTop || 5);
        if(activePath.includes('/continue-watching')) setBgTop(continueWatchingRef?.current?.offsetTop || 5);
        if(activePath.includes('/voted')) setBgTop(votedNowRef?.current?.offsetTop || 5);
        if(activePath.includes('/followers')) setBgTop(followersRef?.current?.offsetTop || 5);
    }

    const handleClick: MouseEventHandler<HTMLDivElement> = (e) => {
        setBgTop(e.currentTarget?.offsetTop || 5);
        navigate(e.currentTarget.innerText === 'Dashboard' ? '/' : e.currentTarget.innerText.toLocaleLowerCase().replace(/ /, '-'))
    }

    return (
        <div className="side-nav">
            
            <div className="link-list">

                <div className="active-background" ref={bgRef} style={{top: bgTop}}></div>

                <div className="link-list-item-wrapper">

                    <div className={`link-list-item ${activePath === '/' ? 'active' : ''}`} ref={dashboardRef} onClick={handleClick}>
                        <BsFillGrid1X2Fill className='icon' />

                        <p>Dashboard</p>
                    </div>

                    <div className={`link-list-item ${activePath.includes('/videos') ? 'active' : ''}`} ref={videosRef} onClick={handleClick}>
                        <BsFillPlayCircleFill className='icon' />

                        <p>Videos</p>
                    </div>

                    <div className={`link-list-item ${activePath.includes('/followers') ? 'active' : ''}`} ref={followersRef} onClick={handleClick}>
                        <MdPersonAddAlt1 className='icon' />

                        <p>Followers</p>
                    </div>
                </div>

            </div>

        </div>
    )
}

export default SideNav;