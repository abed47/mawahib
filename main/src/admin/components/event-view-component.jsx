import React from 'react';
import { Label, Box, DropZone } from '@adminjs/design-system';

const ViewPage = (props) => {
    
    React.useEffect(() => {
        loadData();
    }, [])

    const loadData = () => {
        console.log('props: ', props)
    }

    return (
        <Box style={{marginBottom: "25px"}}>
            <Label>Upload Photo</Label>
            <DropZone onChange={handleDropZoneChange} />
        </Box>
    );
}

export default ViewPage;