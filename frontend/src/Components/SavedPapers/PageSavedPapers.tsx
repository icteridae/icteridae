import React from 'react';

import { SavedPapersTree } from './SavedPapersTree';

import './SavedPapers.sass'
import { Col, Container, Content, FlexboxGrid, Grid, Row, Sidebar } from 'rsuite';
import { SavedPapersSidebar } from './SavedPapersSidebar';
import FlexboxGridItem from 'rsuite/lib/FlexboxGrid/FlexboxGridItem';

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