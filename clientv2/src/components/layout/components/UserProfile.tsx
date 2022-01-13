import React from 'react';
import UserPlaceholder from '../../../assets/images/user-placeholder.png';

const UserProfile: React.FC = props => {
    
    return (
        <div className="profile-circle">
            <img src={UserPlaceholder} alt='user' />

            <div className="pop-over">

                <h4>
                    Ibrahim Mahammed
                </h4>
            </div>
        </div>
    )
}

export default UserProfile;