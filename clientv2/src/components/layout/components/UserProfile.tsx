import React, {useState, useEffect} from 'react';
import UserPlaceholder from '../../../assets/images/user-placeholder.png';
import { BsCreditCardFill } from 'react-icons/bs';
import { GiTwoCoins } from 'react-icons/gi';
import { FiChevronRight, FiLogOut } from 'react-icons/fi';
import { MdOutlineContactPage } from 'react-icons/md';
import { FaCog } from 'react-icons/fa';
import { useCtx } from '../../../utils/context';
import { useNavigate } from 'react-router-dom';
import StorageService from '../../../utils/services/store';

const UserProfile: React.FC = props => {

    const [menuOpen, setMenuOpen] = useState<boolean>(false);
    
    const ctx = useCtx();
    const navigation = useNavigate();

    useEffect(() => {

        window.addEventListener('click', handleClickOutSide);

        return () => {
            window.removeEventListener('click', handleClickOutSide);
            setMenuOpen(false);
        }

    }, []);

    const handleClickOutSide = (e: globalThis.MouseEvent) => {
        let clicked: any = e.target;
        if(clicked?.id === 'profilePic') return;
        handleCloseMenu();
    }

    const handleOpenMenu = () => {
        if(!ctx.loggedIn) return navigation('/login');
        setMenuOpen(true);
    }

    const handleCloseMenu = () => {
        setMenuOpen(false);
    }

    const handleLogout = () => {
        ctx.setCurrentUser(null);
        ctx.setToken('');
        ctx.setLoggedIn(false);
        StorageService.clear();
        navigation('/login')
    }

    const navigateTo = (url: string, redirect:boolean = false, includeToken: boolean = false) => {
        if(includeToken) url += '/login?tok=' + StorageService.getItem('token');
        if(redirect) return window.open(url, '_blank')
        navigation(url);
    }
    
    return (
        <div className="profile-circle">
            <img id='profilePic' onClick={handleOpenMenu} src={UserPlaceholder} alt='user' />

            <div className={`pop-over ${menuOpen ? 'active' : ''}`}>

                <h4>
                    {ctx?.currentUser?.name || ''}
                </h4>

                <div className="menu-item s" onClick={() => navigateTo('/wallet')}>
                    <div className="icon">
                        <BsCreditCardFill />
                    </div>

                    <p className="title">
                        Wallet
                    </p>

                    <div className="amount">
                        <GiTwoCoins />
                        <p>{ctx.currentUser?.wallet?.amount || 0}</p>
                    </div>

                    <FiChevronRight />
                </div>

                <div className="combined">
                    {
                        ctx.userChannel?.id ? (
                            <div className="menu-item" onClick={() => navigateTo('http://localhost:5000', true, true)}>
                                <div className="icon">
                                    <MdOutlineContactPage />
                                </div>

                                <p className="title">
                                    My Channel
                                </p>
                            </div>
                        ) : (
                            <div className="menu-item" onClick={() =>  navigateTo('/create/channel')}>
                                <div className="icon">
                                    <MdOutlineContactPage />
                                </div>

                                <p className="title">
                                    Creat Channel
                                </p>
                            </div>
                        )
                    }
                    <hr />
                    <div className="menu-item">
                        <div className="icon">
                            <FaCog />
                        </div>

                        <p className="title">
                            Account Settings
                        </p>
                    </div>
                </div>

                <div className="menu-item" onClick={handleLogout}>
                    <div className="icon">
                        <FiLogOut />
                    </div>

                    <p className="title">
                        Logout
                    </p>
                </div>
            </div>
        </div>
    )
}

export default UserProfile;