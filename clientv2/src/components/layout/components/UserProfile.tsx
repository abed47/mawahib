import React, {useState, useEffect} from 'react';
import UserPlaceholder from '../../../assets/images/user-placeholder.png';
import { BsCreditCardFill } from 'react-icons/bs';
import { GiTwoCoins } from 'react-icons/gi';
import { FiChevronRight, FiLogOut } from 'react-icons/fi';
import { MdOutlineContactPage } from 'react-icons/md';
import { FaCog } from 'react-icons/fa';

const UserProfile: React.FC = props => {

    const [menuOpen, setMenuOpen] = useState<boolean>(false);

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
        setMenuOpen(true);
    }

    const handleCloseMenu = () => {
        setMenuOpen(false);
    }
    
    return (
        <div className="profile-circle">
            <img id='profilePic' onClick={handleOpenMenu} src={UserPlaceholder} alt='user' />

            <div className={`pop-over ${menuOpen ? 'active' : ''}`}>

                <h4>
                    Ibrahim Mahammed
                </h4>

                <div className="menu-item s">
                    <div className="icon">
                        <BsCreditCardFill />
                    </div>

                    <p className="title">
                        Wallet
                    </p>

                    <div className="amount">
                        <GiTwoCoins />
                        <p>999,999</p>
                    </div>

                    <FiChevronRight />
                </div>

                <div className="combined">
                    <div className="menu-item">
                        <div className="icon">
                            <MdOutlineContactPage />
                        </div>

                        <p className="title">
                            My Channel
                        </p>
                    </div>
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

                <div className="menu-item">
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