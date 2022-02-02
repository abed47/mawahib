import React, { useRef } from 'react';
import { FaChevronCircleDown } from 'react-icons/fa';
import { UtilsRequests } from '../utils/services/request';

interface SelectInputComponentInterface {
    hasIndent?: 'image' | 'icon' | 'text',
    textIndex?: string,
    children: any[],
    value?: any,
    onChange?: (item: any) => void,
    error?: boolean,
    placeholder?: string,
    tabIndex?: number,
    width?: number
}

const SelectInputComponent: React.FC<SelectInputComponentInterface> = props => {

    const listRef = useRef<HTMLDivElement>(null);

    const handleItemClick = (item: any) => {
        listRef?.current?.blur();
        if(props?.onChange) props?.onChange(item);
    }

    const getIcon = (i: any) => {
        let Icon = i;
        return Icon;
    }

    const getItem = (i: any) => {
        let item = props.children.filter((item, index) => props.value === i);
        return item[0];
    }

    return (
        <div style={{width: props.width ? props.width + 'px' : 'auto'}} ref={listRef} tabIndex={props?.tabIndex || 4} className={`mawahib-select-input ${props.error ? 'error-active' : ''} ${props.hasIndent === 'image' ? 'image' : props.hasIndent === 'icon' ? 'icon' : props.hasIndent === 'text' ? 'text' : ''}`}>
            
            {
                props?.hasIndent === 'image' ? 
                props?.value?.image ? <img src={UtilsRequests.loadPhoto(props?.value.iamge)} alt="item img" /> :
                props.value?.photo ? <img src={UtilsRequests.loadPhoto(props?.value.photo)} alt="item img" /> :
                props.value?.thumbnail ? <img src={UtilsRequests.loadPhoto(props?.value.thumbnail)} alt="item img" /> :
                ''
                : ''
            }

            {
                props?.hasIndent === 'icon' && props.value ? getIcon(props.value.icon) : ''
            }

            <p>{<p>{props.value?.name || props.value?.title || props.value?.label || ''}</p> || props?.placeholder || ''}</p>

            <FaChevronCircleDown />

            <ul>
                {
                    props.children.map((item, index) => {
                        return (
                            <li key={`select-input-${index}`} onClick={() => handleItemClick(item)}>
                                {
                                    props?.hasIndent === 'image' ? 
                                    item?.image ? <img src={UtilsRequests.loadPhoto(item.iamge)} alt="item img" /> :
                                    item?.photo ? <img src={UtilsRequests.loadPhoto(item.photo)} alt="item img" /> :
                                    item?.thumbnail ? <img src={UtilsRequests.loadPhoto(item.thumbnail)} alt="item img" /> :
                                    ''
                                    : ''
                                }

                                {
                                    props?.hasIndent === 'icon' ? getIcon(item.icon) : ''
                                }

                                <p>{item?.name || item?.title || item?.label || ''}</p>
                            </li>
                        );
                    })
                }
            </ul>
        </div>
    );
}

export default SelectInputComponent;