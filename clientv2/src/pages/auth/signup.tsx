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
import moment from 'moment';
import SelectComponent from '../../components/SelectComponent';
//@ts-ignore
import countryCodes from 'country-codes-list';

const LoginPage: React.FC = props => {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [username, setUsername] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [country, setCountry] = useState('');
    const [phone, setphone] = useState('');
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
        console.log(e.target.value)
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

        return true;
    }

    const handleLogin = async () => {
        if(!isValid()) return;
        ctx.showPreloader();

        try{
            let body = JSON.stringify({email, password});
            let res = await AuthRequests.emailLogin(body);
            console.log(res);

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
                        <SelectComponent error={errors.country} items={Object.keys(countryCodes.customList('countryNameEn'))} label="Country" onChange={() => {}} selectedValue={false} />
                    </div>

                </form>

                <Button className='btn' onClick={handleLogin}>Sign up</Button>

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