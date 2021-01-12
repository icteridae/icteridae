import * as React from 'react';
import { FlexboxGrid } from 'rsuite';
import PaperTree from './Tree/PaperTree';
import PaperSidebar from './Tree/PaperSidebar';
import {useState} from "react";


export const Paper: React.FC = () => {
    const [choosen, setChoosen] = useState();

    const choosePaper = (paper : any) => {
        setChoosen(paper);
    }

    return (
        <FlexboxGrid justify='center'>
            <FlexboxGrid.Item colspan={10}>
                <PaperTree choosePaper={choosePaper} height={200}/>
            </FlexboxGrid.Item>
            <FlexboxGrid.Item colspan={4}>
                <PaperSidebar paper={choosen}/>
            </FlexboxGrid.Item>
        </FlexboxGrid>
    );
}

