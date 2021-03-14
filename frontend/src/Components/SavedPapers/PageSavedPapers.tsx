import React from 'react';

import { SavedPapersTree } from './SavedPapersTree';

import './SavedPapers.sass'
import { Col, Grid, Row } from 'rsuite';
import { SavedPapersSidebar } from './SavedPapersSidebar';

export const PageSavedPapers: React.FC = () => (
    
    <Grid>
        <Row>
            <Col lg={14}>
                <SavedPapersTree/>
            </Col>
            <Col lg={10}>
                <SavedPapersSidebar/>    
            </Col>
        </Row>
    </Grid>
      
);