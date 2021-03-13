import React, { useState } from 'react';

import { SavedPapersTree } from './SavedPapersTree';

import './SavedPapers.sass'
import { Col, Grid, Row } from 'rsuite';
import { SavedPapersSidebar } from './SavedPapersSidebar';
import { Paper } from '../../Utils/GeneralTypes';
import { DirectoryNode, PaperOrDirectoryNode } from './TreeTypes';

export const PageSavedPapers: React.FC = () => {

    const [selectedElement, setSelectedElement] = useState<PaperOrDirectoryNode>();
    const [loadedPapers, setLoadedPapers] = useState<{ [id: string] : Paper}>({})

    return (
        <Grid>
            <Row>
                <Col lg={14}>
                    <SavedPapersTree 
                        setSelectedPaper={setSelectedElement}
                        loadedPapers={loadedPapers}
                        setLoadedPapers={setLoadedPapers} /> 
                </Col>
                <Col lg={10}>
                    <SavedPapersSidebar selectedElement={selectedElement} loadedPapers={loadedPapers}/>    
                </Col>
            </Row>
        </Grid>
)};