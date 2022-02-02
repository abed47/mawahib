import React, { useState } from 'react';
import CancelIcon from '@mui/icons-material/Cancel';

interface TagInputInterface {
    value?: string;
    onChange: (e: string) => void;
}

const TagInput: React.FC<TagInputInterface> = props => {

    const [value, setValue] = useState('');


    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if(e.key === 'Enter' && value) {
            handleAddTag(value);
        }
    }

    const handleAddTag = (s: string) => {
        let v = props.value;
        if(props?.value?.length && props.value.length > 0){
            v += ',' + s.trim();
        }else{
            v += s.trim();
        }
        if(v) props.onChange(v);
        setValue('');
    }

    const handleRemoveTag = (i: number) => {
        let s = props.value;
        let arr = s?.split(',') || [];
        if(arr) {
            arr.splice(i, 1);
            props.onChange(arr.join(','));
        }
    }

    const formatTags = () => {
        let arr: string[] = [];
        if(props?.value) arr = props.value?.split(',');
        return arr;
    }

    return (
        <div className="mawahib-tag-input">
            {
                formatTags().map((item, index) => {
                    return (
                        <div className="tag" key={`tag-input-item-${index}`}>
                            <span>{item}</span>
                            <CancelIcon className="icon" onClick={e => handleRemoveTag(index)} />
                        </div>
                    );
                })
            }

            <input type="text" placeholder='Add more tags' value={value} onChange={e => setValue(e.target.value)} onKeyDown={handleKeyDown} />
        </div>
    );
}

export default TagInput;