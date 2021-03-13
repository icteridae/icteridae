import React from 'react';
import { Divider } from 'rsuite';

import './style/Sorry.sass'

interface SorryProps {
    message: string,
    description: string,
}

export const Sorry: React.FC<SorryProps> = (props) => (
    <div className='sorry'>
        <div className='sorry-title'>Sorry!</div>
        <div className='line'/>
        <div className='sorry-message'>{props.message}</div>
        <div className='sorry-description'>{props.description}</div>
    </div>
)