import React from 'react';
import { Sorry } from '../General/Sorry';
import { PageSavedPapers } from './PageSavedPapers';

export const SavedPapers: React.FC = () => (
    localStorage ? <PageSavedPapers/> : 
        <Sorry
            message="Your localstorage seems inaccessible"
            description="To use this functionality, please enable localstorage. Except for saving papers, all functions are still available."
        />
)