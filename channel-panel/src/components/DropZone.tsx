import React, { ChangeEvent, useEffect, useRef, useState } from 'react';
import PhotoSizeSelectActualIcon from '@mui/icons-material/PhotoSizeSelectActual';
import { imageToBase64 } from '../utils/helpers';

interface DropZoneInterface {
    onChange?: (e: any) => void;
    value?: string;
    type: 'photo' | 'video';
    onError?: (e: any) => void;
}

const DropZone: React.FC<DropZoneInterface> = props => {

    const [ file, setFile ] = useState<File | null>(null);
    const [ fileDataUrl, setFileDataUrl ] = useState<string | null>(null);

    useEffect(() => {
        if(props?.value) setFileDataUrl(props.value)
    }, [props.value])

    const inputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        let f = e?.target?.files?.[0];
        if(f){
            setFile(f);
            imageToBase64(f).then((r: any) => setFileDataUrl(r)).catch(props.onError);
            if(props?.onChange) props.onChange(f);
        }
    }

    const handleChangeClick = () => {
        inputRef?.current?.click();
    }

    return (
        <div className="mawahib-input-drop-zone">
            <input type="file" ref={inputRef} onChange={handleFileChange} />
            

            {
                file && fileDataUrl ? 
                <div className="image" onClick={handleChangeClick}> <img src={fileDataUrl} alt='placeholder' /></div> :
                <div className="placeholder" onClick={handleChangeClick}>
                    <PhotoSizeSelectActualIcon />
                </div>
            }
        </div>
    );
}

export default DropZone;