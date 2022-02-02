import React from 'react';

interface LabeledSwitchInterface {
    value: boolean;
    onChange: (e: boolean) => void;
    label?: string;
}

const LabeledSwitch: React.FC<LabeledSwitchInterface> = props => {

    return (
        <div className="mawahib-switch-input">
            
            {props.label ? <label>{props.label}</label> : null }

            <div className={`switch ${props.value ? 'active' : ''}`} onClick={e => props.onChange(!props.value)}>
                <div className="circle"></div>
            </div>
        </div>
    );
}

export default LabeledSwitch;