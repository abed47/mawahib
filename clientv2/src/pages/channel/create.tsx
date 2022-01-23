import React, { useRef, useState } from 'react';
import PlaceHolder from '../../assets/images/user-placeholder.png';

const CreateChannel: React.FC = props => {

    const [ file, setFile ] = useState(null);
    const [ profile, setProfile ] = useState(null);
    const [ categoryList, setCategoryList ] = useState(['test cat', 'test cat 2', 'test cat 3']);
    
    const fileInputRef = useRef(null);
    const profileRef = useRef(null);

    return (
        <div className="create-channel-page">

            <h1 className="title">
                Channel Profile
            </h1>

            <div className="drop-zone">
                <input type="file" />
            </div>

            <div className="channel-profile">

                <div className="image">
                    <img src={PlaceHolder} alt="user" />
                    
                </div>

                <input type="file" />

                <h2>Upload channel profile</h2>
            </div>

            <div className="form-control">
                <label>Channel Name</label>
                <input type="text"/>
            </div>

            <div className="form-control">
                <label>About Your Channel</label>
                <textarea></textarea>
            </div>

            <div className="form-control">
                <label>Choose Channel Category</label>
                
            </div>
        </div>
    );

}

export default CreateChannel;