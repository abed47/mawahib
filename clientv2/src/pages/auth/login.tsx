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

            if(res?.status){
                ctx.hidePreloader();
                console.log(res);
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

                <Button className='btn icon' onClick={() => {}}>
                    <span><BsGoogle /></span>
                    <span>Google</span>
                </Button>
                <Button className='btn icon' onClick={() => {}}>
                    <span><FaFacebook/></span>
                    <span>Facebook</span>
                </Button>
                <Button className='btn icon' onClick={() => {}}>
                    <span><FaLinkedinIn /></span>
                    <span>Linkedin</span>
                </Button>

            </div>
        </div>
    );
}

export default LoginPage;