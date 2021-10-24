import { useState } from 'react';
import { Checkbox, FormControlLabel, Button } from '@mui/material';
import LoginBg from '../../assets/images/authbg.png';
import { useHistory } from 'react-router-dom';
import LoadingComponent from '../../components/LoadingComponent';
import SnackBar from '../../components/SnackBar';
import RequestService from '../../utils/services/request';

const RegisterPage = (props) => {

    const [loading, setLoading] = useState(false);
    const [fName, setFName] = useState('');
    const [lName, setLName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [rememberMe, setRememberMe] = useState(false);

    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarType, setSnackbarType] = useState('');
    const [snackbarMessage, setSnackbarMessage] = useState('');

    const history = useHistory();

    const movetoLogin = () => history.push('login');

    const handleFNameChange = (e) => {
        setFName(e.target.value);
    }

    const handleLNameChange = (e) => {
        setLName(e.target.value);
    }

    const handleEmailChange = (e) => {
        setEmail(e.target.value);
    }

    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
    }

    const handleConfirmPasswordChange = (e) => {
        setConfirmPassword(e.target.value);
    }

    const handleRememberMeChange = (e) => {
        setRememberMe(e.target.checked);
    }

    const showMessage = (type, message) => {
        setSnackbarMessage(message);
        setSnackbarType(type);
        setSnackbarOpen(true);
    }

    const handleRegister = async () => {
        try{
            setLoading(true);
            let res =await RequestService.signup({first_name: fName, last_name: lName, email, password});
            setLoading(false);
            if(res.status){
                showMessage('success', 'sign up successful');
                movetoLogin();
                return
            }
            showMessage(res.type, res.message);
        }catch(err){
            console.log(err)
        }
    }

    return(
        <div className="register-page">
            
            <div className="bg-layer">
                <img src={LoginBg} alt="" />
            </div>

            <div className="main-layer">
                <div className="header">
                    <p>Already have an account?</p>
                    <Button className="btn theme-outline primary md-1 " onClick={movetoLogin}>Sign IN</Button>
                </div>
                <div className="form">
                    <h1>SIGN UP</h1>
                    <p>
                        <span>sign up with your email address</span>
                    </p>
                    

                    <div className="form-control">
                        <input type="text" placeholder="First name" value={fName} onChange={handleFNameChange} autoComplete="off" />
                    </div>

                    <div className="form-control">
                        <input type="text" placeholder="Last Name" value={lName} onChange={handleLNameChange} />
                    </div>

                    <div className="form-control">
                        <input type="text" placeholder="email" value={email} onChange={handleEmailChange} />
                    </div>

                    <div className="form-control">
                        <input type="password" placeholder="Password" value={password} onChange={handlePasswordChange} />
                    </div>

                    <div className="form-control">
                        <input type="password" placeholder="Confirm password" value={confirmPassword} onChange={handleConfirmPasswordChange} />
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
                        
                        <Button variant="contained" className="btn theme-primary" onClick={handleRegister}>Sign up</Button>
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

export default RegisterPage;