import React, { useEffect, useState } from 'react';

import { SavedPapersTree } from './SavedPapersTree';

import './SavedPapers.sass'
import { Col, Grid, Row } from 'rsuite';
import { SavedPapersSidebar } from './SavedPapersSidebar';

import { Paper } from '../../Utils/GeneralTypes';
import { AbstractView } from '../General/AbstractView';

export const PageSavedPapers: React.FC = () => {
    const [selectedPaper, setSelectedPaper] = useState<Paper>();

    return(
        <div className="page-saved-papers">
            <SavedPapersTree setSelectedPaper={setSelectedPaper}/>
            {selectedPaper && <AbstractView selected={selectedPaper}/>}
        </div>  
    );
}
      
