import React, { useState, useEffect } from 'react';
import UserPlaceHolder from '../../assets/images/user-placeholder.png';
import { useCtx } from '../../utils/context';
import { getServerPhoto, UserRequests, UtilsRequests } from '../../utils/services/request';
import { Button } from '@mui/material';
import CountrySelectComponent from '../../utils/Components/MawahibCountrySelectComponent';
import DateInputComponent from '../../utils/Components/MawahibDateInput';
import MawahibPhoneInput from '../../utils/Components/MawahibPhoneInputComponent';
import { Link } from 'react-router-dom';
import * as store from '../../utils/services/store';
import moment from 'moment';
//@ts-ignore
import CountryList from 'country-codes-list';

const AccountSettings: React.FC = props => {

    const [user, setUser] = useState<any>(null);
    const [country, setCountry] = useState<any>(null);
    const [name, setName] = useState<any>('');
    const [username, setUsername] = useState<any>('');
    const [email, setEmail] = useState<any>('');
    const [countryCode, setCountryCode] = useState<any>('+961');
    const [dob, setDob] = useState<any>('');
    const [phone, setPhone] = useState<any>('');
    const [password, setPassword] = useState('');

    const ctx = useCtx();

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try{
            ctx.showPreloader();
            let { data: userData } = await UserRequests.getUserInfo();
            ctx.hidePreloader();
            ctx.setToken(userData.token);
            ctx.setCurrentUser(userData.user);
            store.setItem('token', userData.token);
            store.setItem('currentUser', userData.user);
            setUser(userData.user);
            let u = userData.user;
            setName(u.name);
            setPhone(u.phone || '');
            setCountry(u.country || '');
            setEmail(u.email || '');
            setDob(u.dob || '');
            ctx.hidePreloader();
            
            if(u?.country){
                let c = CountryList.findOne('countryNameEn', u.country);
                setCountryCode('+' + c.countryCallingCode);
            }
        }catch(err: any){
            ctx.hidePreloader();
            ctx.showSnackbar(err?.message || 'server error' , 'error')
        }
    }

    const handlePhotoChange = async (e: any) => {
        let file = e.target.files[0]
        let fData = new FormData();
        fData.append('file', file);
        try{
            ctx.showPreloader();
            let res = await UtilsRequests.uploadPhoto(fData);
            let url = '/uploads/' + res.data;
            await UserRequests.updateUserInfo(ctx.currentUser?.id, {photo: url});
            let { data: userData } = await UserRequests.getUserInfo();
            ctx.setToken(userData.token);
            ctx.setCurrentUser(userData.user);
            store.setItem('token', userData.token);
            store.setItem('currentUser', userData.user);
            setUser(userData.user);
            ctx.hidePreloader();
        }catch(err: any){
            ctx.hidePreloader();
            ctx.showSnackbar(err?.message || 'server error', 'error');
        }
    }

    const handleCountryChange = (e: any) => {
        setCountry(e.countryNameEn);
        setCountryCode('+' + e.countryCallingCode)
    }

    const handleInfoUpdate = async () => {
        let body = {
            name,
            username,
            email,
            country,
            dob: moment(dob).format('YYYY-MM-DD'),
            phone
        };

        try{
            ctx.showPreloader();
            let res = await UserRequests.updateUserInfo(ctx.currentUser?.id, body);
            ctx.hidePreloader();

            if(res && res?.status){
                loadData();
                return;
            }

            if(res && res?.status === false){
                ctx.showSnackbar(res.message, 'error');
                return;
            }

            ctx.showSnackbar(res?.response?.data?.message || res?.message || 'server error', 'error');
        }catch(err){
            ctx.hidePreloader();
        }
    }

    return (
        <div className="account-settings-page">
            
            <h1 className="title">Account Settings</h1>

            <hr />

            <main>

                <div className="upload-photo">
                    <input onChange={handlePhotoChange} type="file" accept='image/png,image/jpeg,image/jpg' />
                    <div className="img">
                        <img src={user?.photo ? getServerPhoto(user.photo) : UserPlaceHolder} alt="user"/>
                    </div>
                    <p>Upload Photo</p>
                </div>

                <div className="form">

                    <div className="section">
                        <div className="form-control">
                            <label>Full name</label>
                            <input value={name} onChange={e => setName(e.target.value)} type="text" placeholder='Enter your full name' />
                        </div>

                        <div className="form-control">
                            <label>Username</label>
                            <input value={username} onChange={e => setUsername(e.target.value)} type="text" placeholder='Enter your username' />
                        </div>
                    </div>

                    <div className="section">
                        <div className="form-control">
                            <label>Email Address</label>
                            <input value={email} onChange={e => setEmail(e.target.value)} type="text" placeholder='Enter your email address' />
                        </div>
                    </div>

                    <div className="section">
                        <div className="form-control">
                            <label>Country</label>
                            <CountrySelectComponent value={country} onChange={handleCountryChange} placeholder='Select Country' />
                        </div>

                        <div className="form-control">
                            <label>Date of Birth</label>
                            <DateInputComponent value={dob} onChange={e => setDob(e.target.value)} />
                        </div>
                    </div>

                    <div className="section">
                        
                        <div className="form-control">
                            <label>Phone</label>
                                <MawahibPhoneInput 
                                value={phone} 
                                placeholder="Enter Phone Number" 
                                code={countryCode} 
                                onChange={(e: any) => {setPhone(e.target.value)}}
                                />
                        </div>
                    </div>

                    <h1 className='title-secondary'>Security And Privacy</h1>
                    
                    <div className="section">
                        <div className="form-control">
                            <label>Password</label>
                            <input value={password} onChange={e => setPassword(e.target.value)} type="password" placeholder='' />
                            <small><Link to="/reset-password">Forgot Password?</Link></small>
                        </div>
                    </div>

                    <Button className="btn" onClick={handleInfoUpdate}>Save Info</Button>

                </div>
            </main>
        </div>
    );
}

export default AccountSettings;