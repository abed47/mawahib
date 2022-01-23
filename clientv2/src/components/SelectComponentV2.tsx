import React from 'react';

const SelectV2: React.FC<{
    error: boolean, 
    options: { value: string | number, label: string }[]
    customClass?: string,
    onChange: (item: any) => void,
    placeholder: string,
    value?:any
    }> = props => {

    return (
        <div className="mawahib-select-v2">
            <p>{props.placeholder}</p>

            <ul>
                {
                    props?.options?.map((item, i) => {
                        <li key={`list-item-key-${new Date().getTime()}-${i}`} onClick={() => props.onChange(item)}>
                            {item.label}
                        </li>
                    })
                }
            </ul>
        </div>
    );
}

export default SelectV2;