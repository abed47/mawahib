import React from 'react';
import { Label, Box, DropZone } from '@adminjs/design-system';

const Edit = (props) => {
    const { property, onChange } = props;

    const handleDropZoneChange = (files) => {
        onChange(property.name, files[0]);
    }

    return (
        <Box style={{marginBottom: "25px"}}>
            <Label>Upload Cover</Label>
            <DropZone onChange={handleDropZoneChange} />
        </Box>
    );
}

export default Edit;