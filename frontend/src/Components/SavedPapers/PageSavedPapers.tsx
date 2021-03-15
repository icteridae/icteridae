import React, { useState } from 'react';

import { AbstractView } from '../General/AbstractView';
import { SavedPapersTree } from './SavedPapersTree';
import { Paper } from '../../Utils/GeneralTypes';

import './SavedPapers.sass'

export const PageSavedPapers: React.FC = () => {
    const [selectedPaper, setSelectedPaper] = useState<Paper>();

    return(
        <div className="page-saved-papers">
            <SavedPapersTree setSelectedPaper={setSelectedPaper}/>
            {selectedPaper && <AbstractView selected={selectedPaper}/>}
        </div>  
    );
}
      
