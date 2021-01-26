import * as React from 'react';
import { FlexboxGrid } from 'rsuite';
import PaperTree from './Tree/PaperTree';
import PaperSidebar from './Tree/PaperSidebar';
import {useState} from "react";


export const Paper = () => {
    const [choosen, setChoosen] = useState();
    const [name, setName] = useState("");
    const [id, setId] = useState("");
    const [toDelete, setToDelete] = useState("");

    const choosePaper = (paper : any) => {
        setChoosen(paper);
    }

    function RenameFolder (name : string, id: string){
        setName(name);
        setId(id);
    }

    function DeleteFunction (id: string){
        setToDelete(id);
    }

    return (
        <FlexboxGrid justify='center'>
            <FlexboxGrid.Item colspan={10}>
                <PaperTree choosePaper={choosePaper} height={600} name={name} id={id} toDelete={toDelete}/>
            </FlexboxGrid.Item>
            <FlexboxGrid.Item colspan={4}>
                <PaperSidebar paper={choosen} newFolderName={RenameFolder} Delete={DeleteFunction}/>
            </FlexboxGrid.Item>
        </FlexboxGrid>
    );
}


