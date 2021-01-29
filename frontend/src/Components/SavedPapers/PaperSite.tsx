import * as React from 'react';

import { PaperTree, TreeInterface } from './Tree/PaperTree';
import { PaperSidebar } from './Tree/PaperSidebar';

import { FlexboxGrid } from 'rsuite';
import {useState} from "react";

/**
 * The Site which actually displays the Papertree and the Sidebar 
 */
export const Paper : React.FC = () => {
    const [choosen , setChoosen]  = useState<TreeInterface>();
    const [name, setName] = useState("");
    const [id, setId] = useState("");
    const [toDelete, setToDelete] = useState("");

    /**
     * a function to be given to the PaperTree
     * @param paper the choosen one
     */
    const choosePaper = (paper : TreeInterface) => {
        console.log(typeof paper);
        setChoosen(paper);
    }

    /**
     * a function to be given to the PaperSidebar 
     * @param name, the new name of the folder
     * @param id of the folder
     */
    function renameFolder (name : string, id: string){
        setName(name);
        setId(id);
    }

    /**
     * a function to be given to the PaperSidebar
     * @param id of the paper or folder
     */
    function deleteFunction (id: string){
        setToDelete(id);
    }

    return (
        <FlexboxGrid justify='center'>
            <FlexboxGrid.Item colspan={10}>
                <PaperTree choosePaper={choosePaper} height={600} name={name} id={id} toDelete={toDelete}/>
            </FlexboxGrid.Item>
            <FlexboxGrid.Item colspan={4}>
                <PaperSidebar paper={choosen} newFolderName={renameFolder} delete={deleteFunction}/>
            </FlexboxGrid.Item>
        </FlexboxGrid>
    );
}


