import React, { useEffect, useState } from 'react';
import { Button } from '@mui/material';
import { useCtx } from '../../utils/context';
import { useNavigate } from 'react-router-dom';
import StorageService from '../../utils/services/store';
import LogoImg from '../../assets/images/logo.png';
import { BsGoogle } from 'react-icons/bs';
import { FaFacebook, FaLinkedinIn } from 'react-icons/fa';
import { AuthRequests } from '../../utils/services/request';
import validator from 'validator';
import { useLinkedIn } from 'react-linkedin-login-oauth2';
import GoogleLogin from 'react-google-login';
import { facebookLogin, twitterLogin } from '../../utils/services/firebase/auth';

const LoginPage: React.FC = props => {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState<{email:boolean,password: boolean}>({email: false, password: false})

    const ctx = useCtx();
    const navigation = useNavigate();

    useEffect(() => {

        return () => {
            ctx.hidePreloader();
        }
    }, [])

    const handleSignUpClick = () => {
        navigation('/signup')
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
                if(res.data?.channel) StorageService.setItem('channel', res.data?.channel);
                ctx.setCurrentUser(res.data.user);
                ctx.setUserChannel(res.data?.channel || null)
                ctx.setLoggedIn(true);
                ctx.setToken(res.data.token);
                navigation('/')
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
                ctx.setUserChannel(res.data?.channel || null)
                ctx.setCurrentUser(res.data);
                ctx.setLoggedIn(true);
                ctx.setToken(res.data.token);
                navigation('/')
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
                        StorageService.setItem('currentUser', response.data);
                        StorageService.setItem('loggedIn', true);
                        StorageService.setItem('token', response.data.token);
                        ctx.setUserChannel(res.data?.channel || null)
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
                ctx.setUserChannel(res.data?.channel || null)
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
        <div className="login-page">
            
            <div className="login-dialog">
                
                <img src={LogoImg} alt="pht" />

                <h1>Sign in</h1>

                <p>new to MAWAHIB? <span className="color-secondary" onClick={handleSignUpClick}>Sign up for free</span></p>

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

            </div>
        </div>
    );
}

export default LoginPage;