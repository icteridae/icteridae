import React from 'react';
import { PageSavedPapers } from './PageSavedPapers';

export const SavedPapers: React.FC = () => (
    localStorage ? <PageSavedPapers/> : <p style={{textAlign: 'center'}}><br/><br/> It seems that you have disabled the use of localStorage in your browser. <br/> To use this functionality, please enable localstorage. <br/> Except for saving papers, all functions are still available.</p>
)