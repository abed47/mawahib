import React, {useState, useEffect, useContext} from 'react';
import {Button, TextField, FormControl, FormControlLabel} from '@material-ui/core';
import PhoneInput from 'react-phone-input-2';
import CountryList from 'country-list';
import Autocomplete from '@material-ui/lab/Autocomplete';
import EvaIcon from 'react-eva-icons';
import {LayoutContext} from '../../utils/context/LayoutContext';
import {serverUrl} from '../../utils/providers/local-http-provider';
import axios from 'axios';

const CreateCompanyDialog = (props) => {
    
    const [name, setName]                   = useState("");
    const [address, setAddress]             = useState("");
    const [phone, setPhone]                 = useState("");
    const [country, setCountry]             = useState("");
    const [email, setEmail]                 = useState("");
    const [website, setWebsite]             = useState("");
    const [photo, setPhoto]                 = useState("");
    const [countries, setCountries]         = useState("");
    const [countryCode, setCountryCode]     = useState("us");
    
    const [hasFile, setHasFile]             = useState(false);
    const [fileDataUrl, setFileDataUrl]     = useState("");
    const [uploadFile, setUploadFile]       = useState();
    
    const ctx = useContext(LayoutContext);

    const handleFileChange = e => {
        let file = e.target.files[0];

        convertFile(file).then(res => {
            setHasFile(true);
            setFileDataUrl(res);
            setUploadFile(file);
        }).catch(err => {
            alert(err);
        });
    }

    const convertFile = f => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            
            reader.readAsDataURL(f);

            reader.onload = e => resolve(reader.result);
            reader.onerror = e => reject(e);

        });
    }

    useEffect(() => {
        setCountries(CountryList.getData());

        return () => {

        }
    }, []);

    const handleSubmit = () => {
        let formData = new FormData();

        formData.append('name', name);
        formData.append('email', email);
        formData.append('phone', phone);
        formData.append('address', address);
        formData.append('file', uploadFile ? uploadFile : null);
        formData.append('country', country);
        formData.append('website', website);
        formData.append('client_id', props.clientId);

        axios.post(serverUrl + 'company', formData, {
            headers:{
                'Content-Type': 'multipart/form-data'
            }
        }).then(res => {
            if(res.data && res.data.status){
                ctx.showSnack("Created Successfully", "success");
                props.success()
                return;
            }
            ctx.showSnack("Unknown Error", "error");
            props.close();
        }).catch(err => {
            ctx.showSnack(err.response && err.response.message ? err.response.message : "Unknown Error", "error");
            props.close();
        })

    }

    return (
        <div className="company-profile-dialog create">
            
            <div className="content">

                <div className="form-control">
                    <TextField
                        fullWidth
                        label="Name"
                        value={name}
                        onChange={e => setName(e.target.value)}
                        id="filled-size-small"
                        variant="standard"
                        size="small"
                    />
                </div>

                <div className="form-control">
                    <TextField
                        fullWidth
                        label="address"
                        value={address}
                        multiline
                        onChange={e => setAddress(e.target.value)}
                        id="filled-size-small"
                        variant="standard"
                        size="small"
                    />
                </div>

                <div className="form-control">
                    <Autocomplete
                        id="combo-box-demo"
                        options={countries}
                        getOptionLabel={(option) => option.name}
                        inputValue={country}

                        onChange={(e,d) => {
                            if(d && d.code) setCountryCode(d.code.toLowerCase())
                        }}

                        onInputChange={(event, newInputValue) => {
                            setCountry(newInputValue);
                        }}

                        renderInput={(params) => <TextField {...params} variant="standard" />}
                    />
                </div>

                <div className="form-control">
                    <PhoneInput 
                        value={phone} 
                        country={countryCode} 
                        onChange={(value, obj) => {
                        setPhone(value);
                        setCountry(obj.name)
                    }} />
                </div>

                <div className="form-control">
                    <TextField
                        fullWidth
                        label="Email"
                        value={email}
                        multiline
                        onChange={e => setEmail(e.target.value)}
                        id="filled-size-small"
                        variant="standard"
                        size="small"
                    />
                </div>

                <div className="form-control">
                    <TextField
                        fullWidth
                        label="Website"
                        value={website}
                        multiline
                        onChange={e => setWebsite(e.target.value)}
                        id="filled-size-small"
                        variant="standard"
                        size="small"
                    />
                </div>

                <div className="form-control ">
                    <div className="upload">

                        <input type="file" onChange={handleFileChange} />

                        {
                            hasFile ? (<img src={fileDataUrl} alt="company logo" />) : ""
                        }

                        {
                            !hasFile ? <span><EvaIcon name="upload-outline" fill="#5670a1" size="large" /></span> : ""
                        }
                    </div>
                </div>
                
            </div>

            <div className="actions">
                <Button color="primary" onClick={props.close}>Close</Button>
                <Button color="primary" onClick={handleSubmit}>Create</Button>
            </div>
        </div>
    );
}

export default CreateCompanyDialog;