import React, { useEffect, useState } from 'react';
import { Button } from '@mui/material';
import { useCtx } from '../../utils/context';
import { useNavigate } from 'react-router-dom';
import StorageService from '../../utils/services/store';
import LogoImg from '../../assets/images/logo.png';
import { BsGoogle } from 'react-icons/bs';
import { FaFacebook, FaLinkedinIn } from 'react-icons/fa';
import { FiTwitter } from 'react-icons/fi';
import { AuthRequests } from '../../utils/services/request';
import validator from 'validator';
import moment from 'moment';
import SelectComponent from '../../components/SelectComponent';
//@ts-ignore
import countryCodes from 'country-codes-list';
import GoogleLogin from 'react-google-login';
import { facebookLogin, twitterLogin } from '../../utils/services/firebase/auth';
import { useLinkedIn } from 'react-linkedin-login-oauth2';

const LoginPage: React.FC = props => {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [username, setUsername] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [country, setCountry] = useState('');
    const [phone, setPhone] = useState('');
    const [countryCode, setCountryCode] = useState('');
    const [dob, setDob] = useState<any>(moment().format('YYYY-MM-DD'))
    const [errors, setErrors] = useState<{
        name: boolean,
        email: boolean,
        username: boolean,
        dob: boolean,
        password: boolean,
        confirmPassword: boolean,
        country: boolean,
        phone: boolean
    }>({name: false, email: false, password: false, dob: false, username: false, confirmPassword: false, country: false, phone: false})

    const ctx = useCtx();
    const navigation = useNavigate();

    

    useEffect(() => {

        return () => {
            ctx.hidePreloader();
        }
    }, [])

    const handleSignInClick = () => {
        navigation('/login')
    }

    const handleEmailChange = (e: any) => {
        let err = {...errors};
        err.email = false;
        setErrors(err);
        setEmail(e.target.value)
    }

    const handlePasswordChange = (e: any) => {
        let err = {...errors};
        err.password = false;
        setErrors(err);
        setPassword(e.target.value)
    }

    const handleNameChange = (e: any) => {
        let err = {...errors};
        err.name = false;
        setErrors(err);
        setName(e.target.value)
    }

    const handleUsernameChange = (e: any) => {
        let err = {...errors};
        err.username = false;
        setErrors(err);
        setUsername(e.target.value)
    }

    const handleDobChange = (e:any) => {
        let errs = {...errors};
        errs.dob = false;
        setErrors(errs);
        setDob(e.target.value)
        if(!moment(e.target.value, 'YYYY-MM-DD').isValid()){
            errs.dob = true;
            setErrors(errs);
        }
    }

    const handlePasswordConfirmChange = (e: any) => {
        let  err = {...errors};
        if(e.target.value !== password){
            err.password = true;
            err.confirmPassword = true;
            setErrors(err);
            setConfirmPassword(e.target.value);
            return;
        }
        err.password = false;
        err.confirmPassword = false;
        setErrors(err);
        setConfirmPassword(e.target.value);
    }

    const isValid = () => {
        if(!validator.isEmail(email)){
            let e = {...errors}
            e.email = true;
            setErrors(e);
            return false;
        }

        if(validator.isEmpty(password)){
            let e = {...errors}
            e.password = true;
            setErrors(e);
            return false;
        }
        

        if(validator.isEmpty(username)){
            let e = {...errors}
            e.username = true;
            setErrors(e);
            return false;
        }
        

        if(validator.isEmpty(name)){
            let e = {...errors}
            e.name = true;
            setErrors(e);
            return false;
        }

        if(validator.isEmpty(confirmPassword)){
            let e = {...errors}
            e.confirmPassword = true;
            setErrors(e);
            return false;
        }
        

        return true;
    }

    const handleLogin = async () => {
        if(!isValid()) return;
        ctx.showPreloader();

        try{
            
            let body = JSON.stringify({
                username,
                dob,
                email,
                name,
                country,
                phone,
                password
            });

            let res = await AuthRequests.register(body);

            if(res?.status){
                ctx.hidePreloader();
                navigation('/login');
                return;
            }

            if(res?.message){
                ctx.hidePreloader();
                ctx.showSnackbar(res?.message, res?.type || 'error')
            }

        }catch(err: any){
            ctx.hidePreloader();
            ctx.showSnackbar(err?.message || 'server error', 'error');
        }
    }

    const handleGoogleSuccess = async (e: any) => {
        let body = JSON.stringify({type: 'google', token: e.tokenId});
        ctx.showPreloader();
        try{
            let res = await AuthRequests.social(body);
            ctx.hidePreloader();

            if(res?.status){
                StorageService.setItem('currentUser', res.data);
                StorageService.setItem('loggedIn', true);
                StorageService.setItem('token', res.data.token);
                ctx.setCurrentUser(res.data);
                ctx.setLoggedIn(true);
                ctx.setToken(res.data.token);
                navigation('/')
                return;
            }
        }catch(err: any){
            ctx.hidePreloader();
            ctx.showSnackbar(err?.message || 'request error', 'error');
        }
    };
    const handleGoogleFailure = (err: any) => {
        ctx.showSnackbar(err?.message || 'error occurred', 'error');
    }

    const handleFacebookResponse = (e: any) => {
        facebookLogin().then(async (res: any) => {
            if(res?.user && res?.user?.accessToken){

                ctx.showPreloader();

                try{
                    let response = await AuthRequests.social(JSON.stringify({type: 'facebook', token: res.user.accessToken, name: res.user.displayName, email: res.user.email, profile_pic: res.user.photoURL}));
                    ctx.hidePreloader();
                    
                    if(response?.status){
                        StorageService.setItem('currentUser', response.data);
                        StorageService.setItem('loggedIn', true);
                        StorageService.setItem('token', response.data.token);
                        ctx.setCurrentUser(response.data);
                        ctx.setLoggedIn(true);
                        ctx.setToken(response.data.token);
                        navigation('/')
                        return;
                    }

                    if(response?.message){
                        ctx.showSnackbar(response?.message || 'server error', response?.type || 'error');
                    }
                }catch(err: any){
                    ctx.hidePreloader();
                    ctx.showSnackbar(err?.message || 'server error', 'error');
                }

            }
        }).catch(err => console.log(err))
    }

    const handleTwitterSignup = () => {
        twitterLogin().then(async (res: any) => {
            if(res?._tokenResponse){
                ctx.showPreloader();
                try{
                    let response = await AuthRequests.social(JSON.stringify({
                        type: 'twitter', token: res._tokenResponse.oauthAccessToken, 
                        token_secret: res._tokenResponse.oauthTokenSecret}));
                    ctx.hidePreloader();
                    

                    if(response?.status){
                        StorageService.setItem('currentUser', response.data);
                        StorageService.setItem('loggedIn', true);
                        StorageService.setItem('token', response.data.token);
                        ctx.setCurrentUser(response.data);
                        ctx.setLoggedIn(true);
                        ctx.setToken(response.data.token);
                        navigation('/')
                        return;
                    }

                    if(response?.message){
                        ctx.showSnackbar(response?.message || 'server error', response?.type || 'error');
                    }
                }catch(err: any){
                    ctx.hidePreloader();
                    ctx.showSnackbar(err?.message || 'server error', 'error');
                }
            }
            
        }).catch(err => {
            ctx.showSnackbar(err?.message || 'error occurred', 'error');
        })
    }

    const handleLinkedInLogin = async (e: string) => {
        ctx.showPreloader();

        try{
            let res = await AuthRequests.social(JSON.stringify({
                token: e,
                type: 'linkedin'
            }));
            ctx.hidePreloader();

            if(res?.status){
                StorageService.setItem('currentUser', res.data);
                StorageService.setItem('loggedIn', true);
                StorageService.setItem('token', res.data.token);
                ctx.setCurrentUser(res.data);
                ctx.setLoggedIn(true);
                ctx.setToken(res.data.token);
                navigation('/')
                return;
            }

            if(res?.message){
                ctx.showSnackbar(res?.message || 'server error', res?.type || 'error');
            }

        }catch(err: any){
            ctx.hidePreloader();
            ctx.showSnackbar(err?.message || 'server error', 'error');
        }
    }

    const { linkedInLogin } = useLinkedIn({
        clientId: '78hlwqe988mqdd',
        redirectUri: `${window.location.origin}/linkedin`,
        scope:"r_liteprofile,r_emailaddress",
        onSuccess: handleLinkedInLogin,
        onError: (err: any) => {
            console.log(err);
        }
    })

    return (
        <div className="signup-page">
            
            <div className="signup-dialog">
                
                <img src={LogoImg} alt="pht" />

                <h1>Sign up</h1>

                <p>Already have an account? <span className="color-secondary" onClick={handleSignInClick}>Sign in here</span></p>

                <form>
                    <div className="form-group">
                        <input type="text" value={name} onChange={handleNameChange} className={`mawahib input glowing ${errors.name ? 'error-active' : ''}`} placeholder="Full name" />
                        <input type="text" value={username} onChange={handleUsernameChange} className={`mawahib input glowing ${errors?.username ? 'error-active' : ''}`} placeholder="User name" />
                    </div>

                    <div className="form-group">
                        <input type="text" value={email} onChange={handleEmailChange} className={`mawahib input glowing ${errors.email ? 'error-active' : ''}`} placeholder='Email Address' />
                        <input type="date" value={dob} onChange={handleDobChange} className={`mawahib input glowing ${errors.dob ? 'error-active' : ''}`} />
                    </div>

                    <div className="form-group">
                        <input type="password" value={password} onChange={handlePasswordChange} className={`mawahib input glowing ${errors.password ? 'error-active' : ''}`} placeholder='Password' />
                        <input type="password" value={confirmPassword} onChange={handlePasswordConfirmChange} className={`mawahib input glowing ${errors.confirmPassword ? 'error-active' : ''}`} placeholder='Re-type your password' />
                    </div>

                    <div className="form-group">
                        <SelectComponent 
                            value={country}
                            error={errors.country} 
                            items={Object.keys(countryCodes.customList('countryNameEn'))} 
                            label="Country" 
                            onChange={e => setCountry(e)} 
                            selectedValue={false} />
                        <input type="text" value={phone} onChange={e => setPhone(e.target.value)} className={`mawahib input glowing ${errors?.phone ? 'error-active' : ''}`} placeholder="Phone number" />
                    </div>

                </form>

                <Button className='btn' onClick={handleLogin}>Sign up</Button>

                <p className="continue-with-socials">Or continue with</p>

                <div className="btn-group">
                    <GoogleLogin 
                        clientId='607293539045-ue9vdfogoisgrg222si7db7h5ghk11is.apps.googleusercontent.com'
                        render={renderProps => {
                            return <Button {...renderProps} className='btn icon'>
                                <span><BsGoogle /></span>
                                <span>Google</span>
                            </Button>
                        }}
                        cookiePolicy='single_host_origin'
                        onSuccess={handleGoogleSuccess}
                        onFailure={handleGoogleFailure}
                    />
                    <Button className='btn icon' onClick={handleFacebookResponse}>
                        <span><FaFacebook/></span>
                        <span>Facebook</span>
                    </Button>
                </div>

                <div className="btn-group">
                    <Button className='btn icon' onClick={linkedInLogin}>
                        <span><FaLinkedinIn /></span>
                        <span>Linkedin</span>
                    </Button>

                    <Button className='btn icon' onClick={handleTwitterSignup}>
                        <span><FiTwitter /></span>
                        <span>Twitter</span>
                    </Button>
                </div>
            </div>
        </div>
    );
}

export default LoginPage;