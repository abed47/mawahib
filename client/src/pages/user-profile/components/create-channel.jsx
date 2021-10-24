import React,{ useContext, useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { createTheme,ThemeProvider } from '@mui/material';
import UploadIcon from '@mui/icons-material/UploadFile';
import { FormGroup, FormControlLabel, Checkbox } from '@mui/material';
import { LayoutContext } from '../../../utils/context/layout';
import { AuthContext } from '../../../utils/context/auth';
import { imgToBase64 } from '../../../utils/helpers';
import {createChannel, getCurrentUser, getCurrentUserChannel, updateUserProfile, uploadPhoto} from '../../../utils/services/request';
import { useHistory } from 'react-router-dom';
import StoreService from '../../../utils/services/store';

const steps = ['Channel info', 'Channel Branding', 'User Agreement'];

const theme = createTheme({
    palette:{
        primary: {
            main: '#006796',
            contrastText: 'white'
        },
        secondary:{
            main: '#4ec1b8',
            contrastText: 'white'
        },
        text:{
            primary:'#FFFFFF',
            secondary: '#979696'
        },
    },
    overrides: {
        MuiStepIcon: {
         root: {
           '&$completed': {
             color: 'pink',
           },
           '&$active': {
             color: 'red',
           },
         },
         active: {},
         completed: {},
       }}
})

const CreateChannelPage = (props) => {

    const [activeStep, setActiveStep] = useState(0);
    const [skipped, setSkipped] = useState(new Set());

    const [channelName, setChannelName] = useState('');
    const [channelSlogan, setChannelSlogan] = useState('');
    const [channelDescription, setChannelDescription] = useState('');
    const [logo, setLogo] = useState(null);
    const [cover, setCover] = useState(null);
    const [watermark, setWatermark] = useState(null);
    const [acceptedAgreement, setAcceptedAgreement] = useState(false);
    const [coverDataUrl, setCoverDataUrl] = useState('');
    const [logoDataUrl, setLogoDataUrl] = useState('');
    const [watermarkDataUrl, setWatermarkDataUrl] = useState('');

    const layoutCtx = useContext(LayoutContext);
    const authCtx = useContext(AuthContext);
    const history = useHistory();

    useEffect(() => {

        checkForChannel()

    },[])

    const checkForChannel = async () => {
        if(!authCtx.hasChannel){
            try {
                let u = await getCurrentUser();
                if(u.data.channel_id){
                    layoutCtx.showSnackBar('user already has a channel', 'info');
                    //hanlde channel is here
                }

                authCtx.setUser(u.data);

                let c = await getCurrentUserChannel();

                if(c.data?.id){
                    authCtx.setHasChannel(true);
                    authCtx.setChannel(c.data);

                    if(!u.data.channel_id){
                        await updateUserProfile(StoreService.get('currentUser').id, {channel_id: c.data.id})
                    }
                    layoutCtx.showSnackBar('user already has a channel', 'info')
                    history.push('/user-profile')
                }
            } catch (error) {
                
            }
        }
    }

    const isStepOptional = (step) => {
        return step === 1;
      };
    
      const isStepSkipped = (step) => {
        return skipped.has(step);
      };
    
      const handleNext = () => {
        if(activeStep == 2) return handleSubmit();
        
        let newSkipped = skipped;
        if (isStepSkipped(activeStep)) {
          newSkipped = new Set(newSkipped.values());
          newSkipped.delete(activeStep);
        }
    
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
        setSkipped(newSkipped);
      };
    
      const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
      };

      const handleNameChange = (e) => {
          setChannelName(e.target.value);
      }

      const handleSloganChange = (e) => {
          setChannelSlogan(e.target.value);
      }

      const handleDescriptionChange = (e) => {
          setChannelDescription(e.target.value);
      }

      const handleLogoChange = (e) => {
          setLogo(e.target.files[0]);
          imgToBase64(e.target.files[0]).then(i => {
              setLogoDataUrl(i);
          }).catch(err => {
              layoutCtx.showSnackBar(err.message || err || 'choose another image', 'error')
          })
      }

      const handleWatermarkChange = (e) => {
          setWatermark(e.target.files[0]);
          imgToBase64(e.target.files[0]).then(i => {
            setWatermarkDataUrl(i);
          }).catch(err => {
            layoutCtx.showSnackBar(err.message || err || 'choose another image', 'error')
          })
      }

      const handleCoverChange = (e) => {
          setCover(e.target.files[0]);
          imgToBase64(e.target.files[0]).then(i => {
            setCoverDataUrl(i);
          }).catch(err => {
            layoutCtx.showSnackBar(err.message || err || 'choose another image', 'error')
          })
      }

      const handleAgreementChange = (e, v) => {
          setAcceptedAgreement(v);
      }

      let stepOneProps = {
          channelName,
          handleNameChange,
          channelSlogan,
          handleSloganChange,
          channelDescription,
          handleDescriptionChange
      };

      let stepTowProps = {
          logo,
          handleLogoChange,
          watermark,
          handleWatermarkChange,
          cover,
          handleCoverChange,
          logoDataUrl,
          coverDataUrl,
          watermarkDataUrl
      };

      let stepThreeProps = {
          acceptedAgreement,
          handleAgreementChange
      };

      const getStepContent = () => {
          switch (activeStep){
            case 0:
                return <Step1 {...stepOneProps} />
            case 1:
                return <Step2 {...stepTowProps} />
            case 2:
                return <Step3 {...stepThreeProps} />
            case 3:
                return <Step3 {...stepThreeProps} />
            default:
                return <Step1 {...stepOneProps} />
          }
      }

    const handleValidation = () => {
        if(!channelName){
            layoutCtx.showSnackBar('channel name should not be empty', 'error');
            return false;
        }

        if(!channelDescription){
            layoutCtx.showSnackBar('channel description should not be empty', 'error');
            return false;
        }

        if(!logo) {
            layoutCtx.showSnackBar('please upload a channel logo', 'error');
            return false;
        }

        if(!acceptedAgreement){
            layoutCtx.showSnackBar('you need to accept user agreement', 'warning');
            return false;
        }
        return true;
    }

    const handleSubmit = async () => {
        if(!handleValidation()) return;
        layoutCtx.showPreLoader();
        let lUrl = null;
        let wUrl = null;
        let cUrl = null;

        try{
            if(logo){
                let f1 = new FormData();
                f1.append('name', 'channel-logo');
                f1.append('file', logo);
                let r1 = await uploadPhoto(f1);
                lUrl = r1.data;
            }

            if(watermark){
                let f2 = new FormData();
                f2.append('name', 'channel-watermark');
                f2.append('file', watermark);
                let r2 = await uploadPhoto(f2);
                wUrl = r2.data
            }

            if(cover){
                let f3 = new FormData();
                f3.append('name', 'channel-cover');
                f3.append('file', cover);
                let r3 = await uploadPhoto(f3);
                cUrl = r3.data;
            }

            let channelObj = {
                name: channelName,
                slogan: channelSlogan || '',
                description: channelDescription || '',
                photo: lUrl || '',
                userId: authCtx.user.id,
                cover: cUrl || '',
                watermark: wUrl
            }
            
            let res = await createChannel(channelObj);

            let updatedUser = await getCurrentUser();

            if(res.status){
                authCtx.setUser(updatedUser.data);
                authCtx.setHasChannel(true);
                authCtx.setChannel(res.data);
            }
            layoutCtx.showSnackBar(res.message, res.type);
            layoutCtx.hidPreLoader();
            history.push('/user-profile')
        }catch(err){
            console.log(err);
            layoutCtx.hidPreLoader();
        }
    }

    return (
        <div className="create-channel-page">
            <div className="wrapper">
            <div className="header">
                <h1>Create Channel</h1>
            </div>
            <ThemeProvider theme={theme}>

                <Stepper activeStep={activeStep}>
                    {steps.map((label, index) => {
                    const stepProps = {};
                    const labelProps = {};
                    
                    if (isStepSkipped(index)) {
                        stepProps.completed = false;
                    }
                    return (
                        <Step key={label} {...stepProps}>
                        <StepLabel {...labelProps} color="textPrimary">{label}</StepLabel>
                        </Step>
                    );
                    })}
                </Stepper>
                <div>
                    <Typography sx={{ mt: 2, mb: 1 }}>
                        {getStepContent()}
                    </Typography>

                    {/* Bottom nav */}
                    <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
                        <Button
                        // color="inherit"
                        disabled={activeStep === 0}
                        onClick={handleBack}
                        sx={{ mr: 1 }}
                        variant="contained"
                        >
                        Back
                        </Button>
                        <Box sx={{ flex: '1 1 auto' }} />
                        <Button onClick={handleNext} variant="contained">
                        {activeStep === steps.length - 1 ? 'Finish' : 'Next'}
                        </Button>
                    </Box>
                </div>
                </ThemeProvider>
            </div>
        </div>
    );
}

let Step1 = (props) => {
    return (
        <div className="step-content">
            <div className="form-control">
                <label>Channel name</label>
                <input type="text" value={props.channelName} onChange={props.handleNameChange} />
            </div>
            <div className="form-control">
                <label>Channel slogan</label>
                <input type="text" value={props.channelSlogan} onChange={props.handleSloganChange} />
            </div>
            <div className="form-control mt-5">
                <label>Channel description</label>
                <textarea name="" id="" cols="30" rows="10" value={props.channelDescription} onChange={props.handleDescriptionChange}></textarea>
            </div>
        </div>
    )
}

let Step2 = (props) => {
    return (
        <div className="step-content images">
 

            <div className="form-control">
                <label>Watermark</label>
                <div className="upload-container logo">
                    {props.watermarkDataUrl ? <img src={props.watermarkDataUrl} alt="watermark" /> : ''}
                    <span className="icon"><UploadIcon /></span>
                    <span className="hint">150x150 pixels</span>
                    <input type="file" onChange={props.handleWatermarkChange}/>
                </div>
            </div>
 
            <div className="form-control">
                <label>Logo</label>
                <div className="upload-container logo">
                    {props.logoDataUrl ? <img src={props.logoDataUrl} alt="logo" /> : ''}
                    <span className="icon"><UploadIcon /></span>
                    <span className="hint">512x512 pixels</span>
                    <input type="file" onChange={props.handleLogoChange}/>
                </div>
            </div>

            <div className="form-control">
                <label>Cover</label>
                <div className="upload-container cover">
                    {props.coverDataUrl ? <img src={props.coverDataUrl} alt="cover" /> : ''}
                    <span className="icon"><UploadIcon /></span>
                    <span className="hint">2560 x 1440</span>
                    <input type="file" onChange={props.handleCoverChange}/>
                </div>
            </div>


        </div>
    );
}
let Step3 = (props) => {
    return (
        <div className="step-content user-agreement">
            <span className="agreement-content">
                Lorem ipsum dolor sit amet consectetur, adipisicing elit. 
                Cupiditate ut atque rerum, deleniti quod ratione aspernatur tenetur 
                commodi minima saepe incidunt odio consequatur corporis, voluptatem 
                sunt recusandae delectus at illo.
                Lorem ipsum dolor sit amet consectetur, adipisicing elit. 
                Cupiditate ut atque rerum, deleniti quod ratione aspernatur tenetur 
                commodi minima saepe incidunt odio consequatur corporis, voluptatem 
                sunt recusandae delectus at illo.
                Lorem ipsum dolor sit amet consectetur, adipisicing elit. 
                Cupiditate ut atque rerum, deleniti quod ratione aspernatur tenetur 
                commodi minima saepe incidunt odio consequatur corporis, voluptatem 
                sunt recusandae delectus at illo.
                Lorem ipsum dolor sit amet consectetur, adipisicing elit. 
                Cupiditate ut atque rerum, deleniti quod ratione aspernatur tenetur 
                commodi minima saepe incidunt odio consequatur corporis, voluptatem 
                sunt recusandae delectus at illo.
                Lorem ipsum dolor sit amet consectetur, adipisicing elit. 
                Cupiditate ut atque rerum, deleniti quod ratione aspernatur tenetur 
                commodi minima saepe incidunt odio consequatur corporis, voluptatem 
                sunt recusandae delectus at illo.
                Lorem ipsum dolor sit amet consectetur, adipisicing elit. 
                Cupiditate ut atque rerum, deleniti quod ratione aspernatur tenetur 
                commodi minima saepe incidunt odio consequatur corporis, voluptatem 
                sunt recusandae delectus at illo.
                Lorem ipsum dolor sit amet consectetur, adipisicing elit. 
                Cupiditate ut atque rerum, deleniti quod ratione aspernatur tenetur 
                commodi minima saepe incidunt odio consequatur corporis, voluptatem 
                sunt recusandae delectus at illo.
                Lorem ipsum dolor sit amet consectetur, adipisicing elit. 
                Cupiditate ut atque rerum, deleniti quod ratione aspernatur tenetur 
                commodi minima saepe incidunt odio consequatur corporis, voluptatem 
                sunt recusandae delectus at illo.
                Lorem ipsum dolor sit amet consectetur, adipisicing elit. 
                Cupiditate ut atque rerum, deleniti quod ratione aspernatur tenetur 
                commodi minima saepe incidunt odio consequatur corporis, voluptatem 
                sunt recusandae delectus at illo.
                Lorem ipsum dolor sit amet consectetur, adipisicing elit. 
                Cupiditate ut atque rerum, deleniti quod ratione aspernatur tenetur 
                commodi minima saepe incidunt odio consequatur corporis, voluptatem 
                sunt recusandae delectus at illo.
                Lorem ipsum dolor sit amet consectetur, adipisicing elit. 
                Cupiditate ut atque rerum, deleniti quod ratione aspernatur tenetur 
                commodi minima saepe incidunt odio consequatur corporis, voluptatem 
                sunt recusandae delectus at illo.
                Lorem ipsum dolor sit amet consectetur, adipisicing elit. 
                Cupiditate ut atque rerum, deleniti quod ratione aspernatur tenetur 
                commodi minima saepe incidunt odio consequatur corporis, voluptatem 
                sunt recusandae delectus at illo.
                Lorem ipsum dolor sit amet consectetur, adipisicing elit. 
                Cupiditate ut atque rerum, deleniti quod ratione aspernatur tenetur 
                commodi minima saepe incidunt odio consequatur corporis, voluptatem 
                sunt recusandae delectus at illo.
                Lorem ipsum dolor sit amet consectetur, adipisicing elit. 
                Cupiditate ut atque rerum, deleniti quod ratione aspernatur tenetur 
                commodi minima saepe incidunt odio consequatur corporis, voluptatem 
                sunt recusandae delectus at illo.
                Lorem ipsum dolor sit amet consectetur, adipisicing elit. 
                Cupiditate ut atque rerum, deleniti quod ratione aspernatur tenetur 
                commodi minima saepe incidunt odio consequatur corporis, voluptatem 
                sunt recusandae delectus at illo.
                Lorem ipsum dolor sit amet consectetur, adipisicing elit. 
                Cupiditate ut atque rerum, deleniti quod ratione aspernatur tenetur 
                commodi minima saepe incidunt odio consequatur corporis, voluptatem 
                sunt recusandae delectus at illo.
                Lorem ipsum dolor sit amet consectetur, adipisicing elit. 
                Cupiditate ut atque rerum, deleniti quod ratione aspernatur tenetur 
                commodi minima saepe incidunt odio consequatur corporis, voluptatem 
                sunt recusandae delectus at illo.
                Lorem ipsum dolor sit amet consectetur, adipisicing elit. 
                Cupiditate ut atque rerum, deleniti quod ratione aspernatur tenetur 
                commodi minima saepe incidunt odio consequatur corporis, voluptatem 
                sunt recusandae delectus at illo.
                Lorem ipsum dolor sit amet consectetur, adipisicing elit. 
                Cupiditate ut atque rerum, deleniti quod ratione aspernatur tenetur 
                commodi minima saepe incidunt odio consequatur corporis, voluptatem 
                sunt recusandae delectus at illo.
                Lorem ipsum dolor sit amet consectetur, adipisicing elit. 
                Cupiditate ut atque rerum, deleniti quod ratione aspernatur tenetur 
                commodi minima saepe incidunt odio consequatur corporis, voluptatem 
                sunt recusandae delectus at illo.
                Lorem ipsum dolor sit amet consectetur, adipisicing elit. 
                Cupiditate ut atque rerum, deleniti quod ratione aspernatur tenetur 
                commodi minima saepe incidunt odio consequatur corporis, voluptatem 
                sunt recusandae delectus at illo.
                Lorem ipsum dolor sit amet consectetur, adipisicing elit. 
                Cupiditate ut atque rerum, deleniti quod ratione aspernatur tenetur 
                commodi minima saepe incidunt odio consequatur corporis, voluptatem 
                sunt recusandae delectus at illo.
            </span>
            <div className="checkbox-container">
                <FormGroup>
                    <FormControlLabel control={<Checkbox color="secondary" checked={props.acceptedAgreement} onChange={props.handleAgreementChange} />} label="I agree" />
                </FormGroup>
            </div>
        </div>
    );
}

export default CreateChannelPage;