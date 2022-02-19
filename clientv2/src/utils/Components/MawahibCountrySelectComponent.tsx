import React, { useState, useEffect, useRef } from 'react';
//@ts-ignore
import * as CList from 'country-codes-list';
import { FaFlag, FaChevronRight } from 'react-icons/fa';

interface ComponentProps {
    value: any;
    onChange: (e: any) => void;
    placeholder: string
}

const CountrySelectComponent: React.FC<ComponentProps> = props => {

    // const [val, setVal] = useState<any>(null);
    const [countryList, setCountryList] = useState<any[]>([]);

    const elRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = () => {
        setCountryList(CList.all());
    }

    const handleChange = (e: any) => {
        props.onChange(e.countryNameEn)
        if(elRef.current?.blur) elRef.current.blur();
    }

    return (
        <div ref={elRef} className="mawahib-country-select input" tabIndex={3}>
            <FaFlag />
            {
                props.value ? 
                <p className="value">{props.value}</p> :
                <p className="placeholder">{props?.placeholder}</p>
            }

            <FaChevronRight />

            <div className="item-list">
                {
                    countryList.map((item, index) => {
                        return (
                            <div  onClick={() => handleChange(item)} className="list-item" key={`country-list-item-${index}`}>
                                {item.countryNameEn}
                            </div>
                        );
                    })
                }
            </div>
        </div>
    )
}

export default CountrySelectComponent;