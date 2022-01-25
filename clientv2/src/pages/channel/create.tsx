import React, { useRef, useState } from 'react';
import { Button, Switch } from '@mui/material';
import PlaceHolder from '../../assets/images/user-placeholder.png';
import SelectComponentV2 from '../../components/SelectComponentV2';
import { imageToBase64 } from '../../utils/helpers';
import { useCtx } from '../../utils/context';
import { ChannelRequests, UtilsRequests } from '../../utils/services/request';

const CreateChannel: React.FC = props => {

    const [ file, setFile ] = useState<any>(null);
    const [ profile, setProfile ] = useState<any>(null);
    const [ isMysterious, setIsMysterious ] = useState(false);
    const [ channelCover, setChannelCover ] = useState<any>(null);
    const [ channelProfile, setChannelProfile ] = useState<any>(null);
    const [ category, setCategory ] = useState(null);
    const [ categoryList, setCategoryList ] = useState(['test cat', 'test cat 2', 'test cat 3']);
    const [ description, setDescription ] = useState('');
    const [ name, setName ] = useState('');

    const ctx = useCtx();

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let f = e?.target?.files?.[0];
        setFile(f);
        imageToBase64(f).then(res => setChannelCover(res))
    }

    const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let f = e?.target?.files?.[0];
        setProfile(f);
        imageToBase64(f).then(res => setChannelProfile(res))
    }

    const handleSubmit = async () => {
        try{
            let cover = null;
            let photo = null;
            let photoRes = null;
            let coverRes = null;
            ctx.showPreloader();

            if(profile) {
                let fData2 = new FormData();
                fData2.append('file', profile);
                photoRes = await UtilsRequests.uploadPhoto(fData2);
                if(photoRes && photoRes?.status){
                    photo = photoRes.data;
                }
            }

            if(file) {
                let fData1 = new FormData();
                fData1.append('file',  file);
                coverRes = await UtilsRequests.uploadPhoto(fData1);

                if(coverRes && coverRes?.status){
                    cover = coverRes.data;
                }
            }
            
            let res = await ChannelRequests.createChannel({
                userId: ctx.currentUser.id,
                name,
                description,
                photo,
                cover,
                mysterious: isMysterious,
                category
            });

            ctx.hidePreloader();

            if(res && res?.response && typeof res?.response?.status === 'number'){
                ctx.showSnackbar(res.response.data.message, res.response.data.type);
                return
            }

            if(res?.message){
                ctx.showSnackbar(res.message, res.type);
            }
            
        }catch(err: any){
            console.log(err.response)
            ctx.hidePreloader();
            ctx.showSnackbar(err?.message || err?.error || 'server error', 'error');
        }
    }

    return (
        <div className="create-channel-page">

            <div className="title">
                <h1>
                    Create Channel
                </h1>
            </div>

            <div className="sub-title">
                <p>Channel profile</p>
            </div>

            <div className="drop-zone">
                <input type="file" onChange={handleImageChange} />
                { channelCover ? <img src={channelCover} alt="" /> : <p>upload cover photo</p> }
            </div>

            <div className="channel-profile">

                <div className="image">
                    {
                    channelProfile ?
                    <img src={channelProfile} alt="user" /> : 
                    <img src={PlaceHolder} alt="user" />
                    }
                </div>

                <input type="file" onChange={handleProfileChange} />

                <h2>Upload channel profile</h2>
            </div>

            <div className="form-control">
                <label>Channel Name</label>
                <input type="text" value={name} onChange={e => setName(e.target.value)}/>
            </div>

            <div className="form-control">
                <label>About Your Channel</label>
                <textarea rows={8} cols={100} value={description} onChange={e => setDescription(e.target.value)}></textarea>
            </div>

            <div className="form-control">
                <label>Choose Channel Category</label>
                <SelectComponentV2 placeholder="lsdkfj" options={categoryList.map((it, i) => {
                    return {value: i, label: it}
                })} onChange={setCategory} error={false} value={category} />
            </div>

            <div className="form-control">
                <label>Enable Mysterious Mode?</label>

                <div className="input" tabIndex={5}>
                    {isMysterious ? 'Yes' : 'No'}
                    <Switch  onChange={e => setIsMysterious(e.target.checked)} />
                </div>
                <small>Once you create your channel, you can't change Anonyms identity, <button>Read more</button></small>
            </div>

            <div className="actions">
                <Button className="outlined btn white">Cancel</Button>
                <Button className="btn secondary sm" onClick={handleSubmit}>Create channel</Button>
            </div>
        </div>
    );

}

export default CreateChannel;