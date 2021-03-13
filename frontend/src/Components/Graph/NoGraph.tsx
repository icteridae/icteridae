import React from 'react'
import { Sorry } from '../General/Sorry';

export const NoGraph: React.FC = () => (
    <Sorry 
        message='No graph could be generated' 
        description='We do not have enough information regarding this paper to generate a graph. Try a paper with more information.'
    />
);