import React, { useState, useEffect } from 'react';

interface ComponentProps {
    value?: any;
    onChange?: (e: any) => void
}

const DateInputComponent: React.FC<ComponentProps> = props => {

    return (
        <input type="date" value={props.value} onChange={props.onChange} />
    );
}

export default DateInputComponent;