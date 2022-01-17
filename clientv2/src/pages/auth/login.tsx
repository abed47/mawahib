import React, { useEffect, useState } from 'react';
import { Button } from '@mui/material';
import { useCtx } from '../../utils/context';
import { useNavigate } from 'react-router-dom';
import StorageService from '../../utils/services/store';
import LogoImg from '../../assets/images/logo.png';
import { BsGoogle } from 'react-icons/bs';
import { FaFacebook, FaLinkedinIn } from 'react-icons/fa';

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

    const handleLogin = async () => {
        ctx.showPreloader();

        try{}catch(err){
            
        }
    }

    return (
        <div className="login-page">
            
            <div className="login-dialog">
                
                <img src={LogoImg} alt="pht" />

                <h1>Sign in</h1>

                <p>new to MAWAHIB? <span className="color-secondary" onClick={handleSignUpClick}>Sign up for free</span></p>

                <form>
                    <input type="text" value={email} onChange={e => setEmail(e.target.value)} className={`mawahib input glowing ${errors.email ? 'error-active' : ''}`} placeholder='Email Address' />
                    <input type="password" value={password} onChange={e => setPassword(e.target.value)} className={`mawahib input glowing ${errors.password ? 'error-active' : ''}`} placeholder='Password' />
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