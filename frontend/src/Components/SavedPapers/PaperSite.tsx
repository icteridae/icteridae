import * as React from 'react';

import { Button, FlexboxGrid } from 'rsuite';
import { useState } from "react";

import { PaperTree, TreeInterface, saveTree } from './Tree/PaperTree';
import { PaperSidebar } from './Tree/PaperSidebar';
import { getSavedPapers } from '../../Utils/Webstorage';

/**
 * The Site which actually displays the Papertree and the Sidebar 
 */
export const Paper : React.FC = () => {
    const [choosen , setChoosen]  = useState<TreeInterface>();
    const [name, setName] = useState("");
    const [id, setId] = useState("");
    const [toDelete, setToDelete] = useState("");
    const [treeHeight, setTreeHeight] = useState<number>(calculateTreeHeight(getSavedPapers()));

    /**
     * Stores all ids from folder to an array
     * @param tree to search for ids
     * @param folderIds Array to store ids in
     */
    function getFolderIds(tree: Array<TreeInterface>, folderIds : Array<number>) {
        for(let item in tree) {
            if(tree[item].value.charAt(0) == 'd') {
                folderIds.push(parseInt(tree[item].value.substr(1)));
                getFolderIds(tree[item].children!, folderIds);
            }
        }
    }

    /**
     * calculates the height of the tree for rendering
     * @param tree to get the height from
     */
    function calculateTreeHeight(tree : Array<TreeInterface>) : number {
        let size : number = 0;
        for(let item of tree) {
            if ( item.value.charAt(0) == "d") {
                size += calculateTreeHeight(item.children!);
            }
            size++; 
        }
        return size;
    }

  
    /**
    * A function the add Folder to the Tree
    * @param name is the name of the folder
    */
   const AddFolder = (name: string) => {
    let tree = getSavedPapers();
    let id = Math.floor(Math.random() * 10000);
    let folderIds : Array<number> = [] ;
    getFolderIds(tree, folderIds);
    while (folderIds.includes(id)) id = Math.floor(Math.random() * 10000);
    tree.push({ value: 'd' + id.toString(), name: name, children: [] });
    saveTree(tree);
    setTreeHeight(calculateTreeHeight(tree));
    
};


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
                <PaperTree choosePaper={choosePaper} height={45*treeHeight} name={name} id={id} toDelete={toDelete} tree={getSavedPapers()}/>
            </FlexboxGrid.Item>
            <FlexboxGrid.Item colspan={4}>
                <PaperSidebar paper={choosen} newFolderName={renameFolder} delete={deleteFunction}/>
                <Button
                appearance = 'primary'
                onClick={() => {
                    AddFolder('New Folder');
                }}
            >
                Create new Folder
            </Button>
            </FlexboxGrid.Item>
        </FlexboxGrid>
    );
}


