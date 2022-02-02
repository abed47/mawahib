import React, { useState } from 'react';
import Popup from 'reactjs-popup';
import HelpIcon from '@mui/icons-material/Help';
interface RadioInputInterface {
    onChange?: (e: any) => void;
    value?: any;
    children?: any[];
}

const RadioInput: React.FC<RadioInputInterface> = props => {
    
    const [ value, setValue ] = useState(null);
    const [ open, setOpen ] = useState(false);

    const handleItemSelect = (e: any) => {
        if(props?.onChange){
            props.onChange(e);
            setValue(e)
        }
    }

    return (
        <div className="mawahib-radio-input">
            {
                props?.children ? props.children.map((item, index) => {
                    return (
                        <div className={`radio-item ${value === item.value ? 'active' : ''}`} key={`radio-item-key-${index}`} onClick={() => handleItemSelect(item.value)}>
                            <div className={`item-circle`}> <div className="inner-circle"></div> </div>
                            <p>{item.label}</p>
                            {
                                item?.info ?
                                <Popup
                                    className="info-container"
                                    on="hover"
                                    trigger={(open: any) => {
                                        return <HelpIcon className='icon' />
                                    }}
                                    position="right center"
                                    closeOnDocumentClick
                                >
                                    <span className='info-container'>{item.info}</span>
                                </Popup> : null
                            }
                        </div>
                    );
                }) : null
            }
        </div>
    )
}

export default RadioInput