import React, { useState, useEffect, useRef } from 'react';
import { FaFlag, FaChevronRight } from 'react-icons/fa';

interface ComponentProps {
    value: string;
    code: string;
    onChange: (e: any) => void;
    placeholder: string
}

const MawahibPhoneInput: React.FC<ComponentProps> = props => {

    const [focused, setFocused] = useState(false);

    const handleElFocus = () => {
        setFocused(true);
    }

    const handleElBlur = () => {
        setFocused(false);
    }

    const handleChange = (e: any) => {
        props.onChange(e)
    }

    return (
        <div className={`mawahib-phone-input ${focused ? 'active' : ''}`} tabIndex={99}>
            <FaFlag />
            <p>({props.code})</p>
            <input 
                className="custom" 
                type="number" value={props.value} 
                onChange={handleChange} 
                placeholder={props.placeholder}
                onFocus={handleElFocus}
                onBlur={handleElBlur} />
            <FaChevronRight />
        </div>
    )
}

export default MawahibPhoneInput;