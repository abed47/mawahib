import React, { useState, useEffect } from 'react';
import UserPlaceHolder from '../../assets/images/user-placeholder.png';
import { useCtx } from '../../utils/context';
import { getServerPhoto } from '../../utils/services/request';
import { Button } from '@mui/material';
import CountrySelectComponent from '../../utils/Components/MawahibCountrySelectComponent';
const AccountSettings: React.FC = props => {

    const [user, setUser] = useState<any>(null);
    const [country, setCountry] = useState<any>(null);

    const ctx = useCtx();

    useEffect(() => {
        loadData();
    }, []);

    const loadData = () => {
        setUser(ctx.currentUser);
        setCountry(ctx.currentUser?.country);
    }

    return (
        <div className="account-settings-page">
            
            <h1 className="title">Account Settings</h1>

            <hr />

            <main>

                <div className="upload-photo">
                    <input type="file" accept='image/png,image/jpeg,image/jpg' />
                    <div className="img">
                        <img src={user?.photo ? getServerPhoto(user.photo) : UserPlaceHolder} alt="user"/>
                    </div>
                    <p>Upload Photo</p>
                </div>

                <div className="form">

                    <div className="section">
                        <div className="form-control">
                            <label>Full name</label>
                            <input type="text" placeholder='Enter your full name' />
                        </div>

                        <div className="form-control">
                            <label>Username</label>
                            <input type="text" placeholder='Enter your username' />
                        </div>
                    </div>

                    <div className="section">
                        <div className="form-control">
                            <label>Email Address</label>
                            <input type="text" placeholder='Enter your email address' />
                        </div>
                    </div>

                    <div className="section">
                        <div className="form-control">
                            <label>Country</label>
                            <CountrySelectComponent value={country} onChange={(e) => setCountry(e)} placeholder='Select Country' />
                        </div>
                    </div>
                    <div className="section"></div>

                    <h1>Security And Privacy</h1>

                    <Button>Save Info</Button>
                </div>
            </main>
        </div>
    );
}

export default AccountSettings;