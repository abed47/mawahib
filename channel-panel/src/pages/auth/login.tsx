import React, { useEffect, useState } from 'react';
import { Button } from '@mui/material';
import { useCtx } from '../../utils/context';
import { useNavigate, useSearchParams } from 'react-router-dom';
import StorageService from '../../utils/services/store';
import LogoImg from '../../assets/images/logo.png';
import { BsGoogle } from 'react-icons/bs';
import { FaFacebook, FaLinkedinIn } from 'react-icons/fa';
import { AuthRequests } from '../../utils/services/request';
import validator from 'validator';
import { useLinkedIn } from 'react-linkedin-login-oauth2';
import GoogleLogin from 'react-google-login';
import { facebookLogin } from '../../utils/services/firebase/auth';
import SnackBar from '../../components/layout/components/SnackBar';
import PreLoader from '../../components/layout/components/Preloader';
// import { getQe } from '../..';
import { getQe } from '../../utils/helpers';
import simpleCrypto from 'simple-crypto-js';

const LoginPage: React.FC = props => {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState<{email:boolean,password: boolean}>({email: false, password: false})

    const ctx = useCtx();
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();

    useEffect(() => {
        
        checkParams();

        return () => {
            ctx.hidePreloader();
        }
    }, []);

    const decryptActions = (a: string) => {
        let crypto = new simpleCrypto(getQe());
        let r = crypto.decrypt(a);
        return r;
    }

    const checkParams = async () => {
        let q = new URLSearchParams(searchParams);
        let tok = q.get('tok');
        if(!tok) return;
        let action = q.get('act');        
        let parsedActions: any = null;
        if(action) parsedActions = decryptActions(decodeURI(action).replace(/\ /ig, "+"));

        try{
            ctx.showPreloader();
            let res: any = await AuthRequests.tokenLogin({token: tok});
            ctx.hidePreloader();
            ctx.setToken(res.token);
            ctx.setCurrentUser(res.user);
            ctx.setChannel(res.user.channel);
            StorageService.setItem('token', res.token);
            StorageService.setItem('currentUser', res.user);
            StorageService.setItem('channel', res.user.channel);
            if(parsedActions?.action) return handleAction(parsedActions);
            navigate('/');
        }catch(err: any){
            ctx.hidePreloader();
            ctx.showSnackbar(err?.message || err?.error || 'server error', 'error');
        }
    }

    const handleAction = (p: any) => {
        if(p.action === 'event_submit'){
            let url = `/videos/upload?action=${p.action}&event_id=${p.event_id}`;
            navigate(url);
        }
    }

    const handleSignUpClick = () => {
        navigate('/signup')
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

        return true;
    }

    const handleLogin = async () => {
        if(!isValid()) return;
        ctx.showPreloader();

        try{
            let body = JSON.stringify({email, password});
            let res = await AuthRequests.emailLogin(body);
            ctx.hidePreloader();

            if(res?.status){
                StorageService.setItem('currentUser', res.data.user);
                StorageService.setItem('loggedIn', true);
                StorageService.setItem('token', res.data.token);
                ctx.setCurrentUser(res.data.user);
                ctx.setLoggedIn(true);
                ctx.setToken(res.data.token);
                navigate('/')
                return;
            }

            ctx.showSnackbar(res?.message || 'server error', 'error');

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
                navigate('/')
                return;
            }

            ctx.showSnackbar(res?.message || 'server error', 'error');
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
                        console.log(response)
                        StorageService.setItem('currentUser', response.data);
                        StorageService.setItem('loggedIn', true);
                        StorageService.setItem('token', response.data.token);
                        ctx.setCurrentUser(response.data);
                        ctx.setLoggedIn(true);
                        ctx.setToken(response.data.token);
                        navigate('/')
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
                navigate('/')
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
        <div className="login-page">
            
            <div className="login-dialog">
                
                <img src={LogoImg} alt="pht" />

                <h1>Sign in</h1>

                {/* <p>new to MAWAHIB? <span className="color-secondary" onClick={handleSignUpClick}>Sign up for free</span></p> */}

                <form>
                    <input type="text" value={email} onChange={handleEmailChange} className={`mawahib input glowing ${errors.email ? 'error-active' : ''}`} placeholder='Email Address' />
                    <input type="password" value={password} onChange={handlePasswordChange} className={`mawahib input glowing ${errors.password ? 'error-active' : ''}`} placeholder='Password' />
                </form>

                <Button className='btn' onClick={handleLogin}>Sign in</Button>

                <p className="continue-with-socials">Or continue with</p>

                <GoogleLogin 
                        clientId='607293539045-ue9vdfogoisgrg222si7db7h5ghk11is.apps.googleusercontent.com'
                        render={renderProps => {
                            return <Button className='btn icon' onClick={renderProps.onClick}>
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
                <Button className='btn icon' onClick={linkedInLogin}>
                    <span><FaLinkedinIn /></span>
                    <span>Linkedin</span>
                </Button>
                <SnackBar />
                <PreLoader />
            </div>
        </div>
    );
}

export default LoginPage;