import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../../utils/context/auth";
import ProfilePlaceHolder from '../../../assets/images/placeholder.jpg';
import { Button } from '@mui/material';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import CountryList from 'country-list';
import { makeStyles } from "@mui/styles";
import moment from 'moment';
import { updateUserProfile, getCurrentUser, updateUserProfilePicture, getPhotoPublicPath } from "../../../utils/services/request";
import StoreService from "../../../utils/services/store";
import { useHistory } from "react-router-dom";

const useStyles = makeStyles({
    underline: {
      "&&&:before": {
        borderBottom: "none"
      },
      "&&:after": {
        borderBottom: "none"
      }
    }
  });

const UserProfileSettingComponent = (props) => {

    const [fName, setFName]         = useState('');
    const [lName, setLName]         = useState('');
    const [email, setEmail]         = useState('');
    const [phone, setPhone]         = useState('');
    const [country, setCountry]     = useState('');
    const [dob, setDob]             = useState('');
    const [username, setUsername]   = useState('');
    const [file, setFile]           = useState(null);

    const [countryList, setCountryList] = useState([]);

    const authCtx = useContext(AuthContext);
    const history = useHistory();

    useEffect(() => {
        loadData()
    }, [authCtx.loggedIn, authCtx.user]);

    const loadData = () => {
        //load countries
        setCountryList(CountryList.getData())
        //load user data
        let user = authCtx.user;
        loadDates(user)
        setFName(user.first_name);
        setLName(user.last_name);
        setCountry(user.country ? {name: user.country, code: CountryList.getCode(user.country)} : {code: 'AE', name: 'United Arab Emirates'});
        setPhone(user.phone || '');
        setEmail(user.email || '');
        setUsername(user.username || '');
    }

    const loadDates = (user) => {
        if(!user.dob){
            setDob(moment(user.dob,).format('YYYY-MM-DD'))
        }else{
            setDob(moment(user.dob).format('YYYY-MM-DD'))
        }
    }

    const handleCountryChange = (val, newVal) => {
        setCountry(newVal);
    }

    const getCountryProp = (name) => {
        if(name && name.name && name.code) return name;
        if(!name) return '';
        return {
            code: CountryList.getCode(name),
            name
        }
    }

    const handleDateChanged = (e) => {
        setDob(moment(e.target.value, 'YYYY-MM-DD').format('YYYY-MM-DD'))
    }

    const triggerChange = () => {}

    const moveToCreatChannel = () => {
        history.replace('create-channel')
    }
    
    const moveToMyChannel = () => {
        history.replace('/channel');
    }

    const handleSubmit = async () => {
        try {
            let updateObj = {
                first_name: fName,
                last_name: lName,
                email: email,
                username: username || '',
                country: country.name || '',
                phone: phone || '',
                dob: moment(dob,'YYYY-MM-DD').format('YYYY-MM-DD') || ''
            }
    
            let userId = authCtx.user.id;
    
            let res = await updateUserProfile(userId, updateObj);

            let updatedUser = await getCurrentUser();
            
            authCtx.setUser(updatedUser.data);
            StoreService.store('currentUser',updatedUser.data)
    
            triggerChange()
        } catch (err) {
            console.error(err);
        }
    }

    const handleFileChange = async (e) => {
        try {
            console.log('changes')
            let file = e.target.files[0];
            console.log(file)
            let formData = new FormData();
            formData.append('file', file);
            formData.append('id', authCtx.user.id);

            await updateUserProfilePicture(formData);

            let updatedUser = await getCurrentUser();
            
            authCtx.setUser(updatedUser.data);
            StoreService.store('currentUser',updatedUser.data)
        } catch (err) {
            console.error(err);
        }
    }


    return (
        <div className="user-profile-settings">
            <div className="header">
                <h1 onClick={() => console.log(authCtx.channel)}>Settings</h1>
            </div>
            <div className="wrapper">
                <section>
                    <div className="photo-holder">
                        {
                            authCtx?.user?.photo ? 
                            <img src={getPhotoPublicPath(authCtx?.user?.photo)} alt="user" /> :
                            <img src={ProfilePlaceHolder} alt="user" />
                        }

                        <div className="upload-file-btn">
                            <Button className="btn theme-primary">Change Image</Button>
                            <input type="file" value={file} onChange={handleFileChange} />
                        </div>
                    </div>
                </section>

                <section>
                    <div className="settings-group">
                        <h1>Your Info</h1>

                        <div className="form-group">
                            <label>First Name</label>
                            <input type="text" value={fName} onChange={e => setFName(e.target.value)} autoComplete="nope" />
                        </div>

                        <div className="form-group">
                            <label>Last Name</label>
                            <input type="text" value={lName} onChange={e => setLName(e.target.value)} autoComplete="off" />
                        </div>

                        <div className="form-group">
                            <label>Country</label>
                            <Autocomplete
                            className="special-input-auto-complete"
                            disablePortal
                            id="combo-box-demo"
                            options={countryList}
                            getOptionLabel={option => option?.name || ''}
                            sx={{ width: 300 }}
                            value={getCountryProp(country)}
                            onChange={handleCountryChange}
                            renderInput={(params) => <TextField variant="standard" autoComplete="nope" {...params} InputProps={{ ...params.InputProps, autoComplete: 'new-password',
                            form: {
                              autoComplete: 'off',
                            }, disableUnderline: true, style:{height: '24px'} }} />}
                            />
                        </div>

                        <div className="form-group">
                            <label>Phone</label>
                            <input type="text" value={phone} onChange={e => setPhone(e.target.value)} autoComplete="nope" />
                        </div>

                        <div className="form-group">
                            <label>Date of birth</label>
                            <input type="date" autoComplete="nope" value={dob} onChange={handleDateChanged} />
                        </div>
                    </div>

                    <div className="settings-group">
                        <h1>Account</h1>

                        <div className="form-group">
                            <label>Email</label>
                            <input type="text" autoComplete="nope" value={email} onChange={e => setEmail(e.target.value)} />
                        </div>

                        <div className="form-group">
                            <label>Username</label>
                            <input type="text" autoComplete="nope" value={username} onChange={e => setUsername(e.target.value)} />
                        </div>

                        <div className="form-group">
                            <label>Password</label>
                            <Button variant="contained" className="btn theme-secondary">Change Password</Button>
                        </div>
                    </div>

                    <div className="actions">

                        {
                            !authCtx.channel?.id ? 
                            <Button variant="contained" className="btn theme-primary mr-4" onClick={moveToCreatChannel}>Create Channel</Button> :
                            <Button variant="contained" className="btn theme-primary mr-4" onClick={moveToMyChannel}>Manage Channel</Button>
                        }

                        <Button variant="contained" className="btn theme-primary" onClick={handleSubmit}>Save</Button>
                    </div>
                </section>
            </div>
        </div>
    )
}

export default UserProfileSettingComponent;