import React, { useEffect, useState } from 'react';

import { SavedPapersTree } from './SavedPapersTree';

import './SavedPapers.sass'
import { Col, Grid, Row } from 'rsuite';
import { SavedPapersSidebar } from './SavedPapersSidebar';

import { Paper } from '../../Utils/GeneralTypes';
import { AbstractView } from '../General/AbstractView';

export const PageSavedPapers: React.FC = () => {
    const [selectedPaper, setSelectedPaper] = useState<Paper>();

    useEffect(() => {
        console.log(selectedPaper);
    }, [selectedPaper])
    return(
        <Grid>
            <Row>
                <Col lg={13}>
                    <SavedPapersTree setSelectedPaper={setSelectedPaper}/>
                </Col>
                <Col lg={11}>
                    {selectedPaper && <AbstractView selected={selectedPaper}/>}
                </Col>
            </Row>
        </Grid>  
    );
}
      
