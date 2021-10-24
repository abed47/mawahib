import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Checkbox, FormControlLabel, Button } from '@mui/material';
import LoginBg from '../../assets/images/authbg.png';
import { useHistory } from 'react-router-dom';
import LoadingComponent from '../../components/LoadingComponent';
import RequestService from '../../utils/services/request';
import StoreService from '../../utils/services/store';
import SnackBar from '../../components/SnackBar';


const LoginPage = (props) => {

    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [rememberMe, setRememberMe] = useState(false);

    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarType, setSnackbarType] = useState('');
    const [snackbarMessage, setSnackbarMessage] = useState('');

    const history = useHistory();

    useEffect(() => {
        if(StoreService.get('currentUser') && StoreService.get('currentUser').id){
            moveToHome();
        }
    },[]);

    const moveToRegister = () => history.push('register');
    const moveToPasswordReset = () => history.push('reset');
    const moveToHome = () => history.push('home');

    const handleEmailChange = (e) => {
        setEmail(e.target.value);
    }

    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
    }

    const handleRememberMeChange = (e) => {
        setRememberMe(e.target.checked);
    }

    const showMessage = (type, message) => {
        setSnackbarMessage(message);
        setSnackbarType(type);
        setSnackbarOpen(true);
    }

    const handleLogin = async() => {
        try{
            setLoading(true)
            let res = await RequestService.login({email, password});
            setLoading(false);
            if(res.status){
                if(rememberMe) StoreService.store('type', 2,2);
                let data = res.data;
                StoreService.store('token', data.token);
                StoreService.store('currentUser', data.user);
                showMessage('success', 'login successful');
                moveToHome();
                return;
            }

            showMessage(res.type, res.message)
        }catch(err){
            console.log(err)
        }
    }

    const handleSuccessfulLogin = (data) => {}

    return(
        <div className="login-page">
            
            <div className="bg-layer">
                <img src={LoginBg} alt="" />
            </div>

            <div className="main-layer">
                <div className="header">
                    <p>Don't have an account?</p>
                    <Button className="btn theme-outline primary md-1 " onClick={moveToRegister}>Sign up</Button>
                </div>
                <div className="form">
                    <h1>SIGN IN</h1>
                    <p>
                        <span>sign in with email or username and password, don't remember your email or password?</span>
                        <Link to="#" onClick={moveToPasswordReset}>Click here</Link>
                    </p>
                    

                    <div className="form-control">
                        <input type="text" placeholder="username or email" value={email} onChange={handleEmailChange} />
                    </div>

                    <div className="form-control">
                        <input type="password" placeholder="Password" value={password} onChange={handlePasswordChange} />
                    </div>

                    <div className="form-group">
                        <FormControlLabel
                            value="rememberME"
                            control={<Checkbox />}
                            label="Remember me"
                            labelPlacement="end"
                            className="checkbox"
                            onChange={handleRememberMeChange}
                            />
                        
                        <Button variant="contained" className="btn theme-primary" onClick={handleLogin}>LOGIN</Button>
                    </div>

                    <div className="or-section">
                        <hr />
                        <span>or</span>
                        <hr />
                    </div>

                    <Button variant="contained" className="w-100 mt-5">Login with Facebook</Button>
                </div>
                <div className="footer"></div>
            </div>

            <LoadingComponent shown={loading} />
            <SnackBar open={snackbarOpen} type={snackbarType} message={snackbarMessage} handleClose={() => setSnackbarOpen(false)} />

        </div>
    );
}

export default LoginPage;