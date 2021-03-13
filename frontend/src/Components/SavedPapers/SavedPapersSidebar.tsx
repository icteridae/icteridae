import React from 'react';

import { SavedPapersTree } from './SavedPapersTree';

import './SavedPapers.sass'
import { Container, Content, Sidebar } from 'rsuite';
import { Paper } from '../../Utils/GeneralTypes';
import { DirectoryNode, isPaperNode, PaperNode, PaperOrDirectoryNode } from './TreeTypes';

interface SavedPapersSidebarProps {
    selectedElement: PaperOrDirectoryNode | undefined,
    loadedPapers: { [id: string] : Paper},
}

export const SavedPapersSidebar: React.FC<SavedPapersSidebarProps> = (props) => (
    <>{props.selectedElement !== undefined && isPaperNode(props.selectedElement) ? <div className='saved-papers-sidebar'>
        <h4>{props.loadedPapers[props.selectedElement.paperId].title}</h4>
        <p>Some info or something</p>
        <p>Lorem Ipsum Dolor Sit Amet Lorem Ipsum Dolor Sit Amet Lorem Ipsum Dolor Sit Amet Lorem Ipsum Dolor Sit Amet Lorem Ipsum Dolor Sit Amet Lorem Ipsum Dolor Sit Amet Lorem Ipsum Dolor Sit AmetLorem Ipsum Dolor Sit AmetLorem Ipsum Dolor Sit AmetLorem Ipsum Dolor Sit AmetLorem Ipsum Dolor Sit AmetLorem Ipsum Dolor Sit Amet</p>
        <div className='circle'/>
    </div> : <div></div>}</>
);
