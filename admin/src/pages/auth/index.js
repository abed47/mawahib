/*jshint ignore: start*/
import {useState, useRef} from 'react'
// import shipImage from '../../assets/images/ship.png';
// import logo from '../../assets/images/logo.png';
// import fbIcon from '../../assets/images/fb.png';
// import instaIcon from '../../assets/images/insta.png';
// import twitterIcon from '../../assets/images/twitter.png';
import {Button, TextField,CircularProgress} from '@material-ui/core';
import dataProvider from '../../utils/providers';
import {useHistory} from 'react-router-dom';
import {loginValidators, hasErrors as valid} from '../../utils/helpers'
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';

function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
  }

const LoginPage = () => {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [processing, setProcessing] = useState(false);
    const [validators, setValidators] = useState([]);

    const [snackOpen, setSnackOpen] = useState(false);
    const [snackMessage, setSnackMessage] = useState("");

    const emailRef = useRef(null);
    const passwordRef = useRef(null);

    const history = useHistory()

    const handleLogin = () => {
        setValidators(loginValidators(email, password));
        let isValid = valid(loginValidators(email, password));
        if(isValid){
            setProcessing(true)
            dataProvider.create('login',{
                username: email.replace(/\ /ig, ""),
                password
            }).then(res => {
                setProcessing(false)
                setValidators([])
                if(res.data.status && res.data.results.length){
                    localStorage.setItem('currentUser', JSON.stringify(res.data.results[0]))
                    localStorage.setItem('userType', res.data.results[0].role)
                    localStorage.setItem('loggedIn', true)
                    if(res.data.results[0].role == 1){
                        history.push('/')
                    }
                    else if(res.data.results[0].role == 2){
                        history.push('/clients')
                    }else{
                        history.push('/welcome')
                    }
                    return
                }

                setSnackMessage("username or password wrong")
                setSnackOpen(true)
            }).catch( err => {
                setProcessing(false)
                setSnackMessage("username or password wrong")
                setSnackOpen(true)
                setValidators([false, true])
            })
        }
    }

    const handleEmailChange = (e) => {
        setValidators([])
        setEmail(e.target.value)
    }

    const handlePasswordChange = (e) => {
        setValidators([])
        setPassword(e.target.value);
    }

    const handleKeyPress = (e) => {
        if(e.key == "Enter"){
            if(e.target.id == "email"){
                passwordRef.current.focus()
                return
            }

            handleLogin()
        }
    }
    return (
        <div className="login-container">

            <div className="form-container">

                <dir className="form-section">
                    <div className="left">
                        {/* <img src={logo} /> */}
                        <h2>Login Account</h2>
                        <p>This is a secure system and you will need to provide you login details to access the site.</p>

                        <div className="form">
                            <form>
                                <div className="formControl">
                                    <TextField 
                                    id="email"
                                    className="w-100" 
                                    label="Username"
                                    variant="outlined" 
                                    value={email} 
                                    onChange={handleEmailChange}
                                    onKeyPress={handleKeyPress}
                                    inputRef={emailRef}
                                    error={validators[0] === false}
                                    // helperText="Incorrect entry."
                                    />
                                </div>
                                <div className="formControl">
                                    <TextField 
                                    id="password"
                                    className="w-100" 
                                    label="Password" 
                                    type="password" 
                                    variant="outlined" 
                                    value={password} 
                                    onKeyPress={handleKeyPress}
                                    onChange={handlePasswordChange}
                                    inputRef={passwordRef}
                                    error={validators[0] === false}
                                    />
                                </div>

                                <div className="forgot-password">
                                    <a href="#" >Forgot password?</a>
                                </div>

                                <Button className="login-btn" variant="contained" onClick={handleLogin} disabled={processing}>Sign In { processing && <CircularProgress className="progress" />} </Button>
                            </form>
                        </div>
                        

                        <p>To Request an account just <a href="#">email us</a></p>
                    </div>

                    <div className="right">
                        {/* <a><img src={fbIcon} /></a> */}
                        {/* <a><img src={instaIcon} /></a> */}
                        {/* <a><img src={twitterIcon} /></a> */}
                    </div>
                </dir>

                <div className="image-section">
                    {/* <img src={shipImage} /> */}
                </div>
            </div>

            <Snackbar open={snackOpen} autoHideDuration={3000} onClose={() => setSnackOpen(false)}>
                <Alert onClose={() => setSnackOpen(false)} severity="error">
                {snackMessage}
                </Alert>
            </Snackbar>

        </div>
    )
}

export default LoginPage;
/*jshint ignore: end */