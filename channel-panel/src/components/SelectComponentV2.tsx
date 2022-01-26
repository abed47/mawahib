import React, { useRef } from 'react';
import { FaChevronRight } from 'react-icons/fa';

const SelectV2: React.FC<{
    error: boolean, 
    options: { value: string | number, label: string }[]
    customClass?: string,
    onChange: (item: any) => void,
    placeholder: string,
    value?:any,
    tabIndex?:number
    }> = props => {

        const boxRef = useRef<HTMLDivElement>(null);

        const handleItemClick = (e: {value: any, label: string}) => {
            props.onChange(e);
            boxRef.current?.blur()
        }
    return (
        <div className="mawahib-select-v2" ref={boxRef} tabIndex={props.tabIndex || 9}>
            <p>{props?.value ? props.value.label : props.placeholder}</p>
            
            <FaChevronRight />

            <ul>
                {
                    props?.options?.map((item, i) => {
                        return <li key={`list-item-key-${new Date().getTime()}-${i}`} onClick={() => handleItemClick(item)}>
                            {item.label}
                        </li>
                    })
                }
            </ul>
        </div>
    );
}

export default SelectV2;