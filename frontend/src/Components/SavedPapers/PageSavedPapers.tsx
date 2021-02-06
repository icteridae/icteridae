import React, {useState} from 'react';

import { Button, FlexboxGrid } from 'rsuite';

import { PaperTree, TreeInterface, saveTree } from './Tree/PaperTree';
import { PaperSidebar } from './Tree/PaperSidebar';
import { getSavedPapers } from '../../Utils/Webstorage';

/**
 * The Page displaying the Papertree and the Sidebar 
 */
export const PageSavedPapers : React.FC = () => {
    const [selectedElement , setSelectedElement]  = useState<TreeInterface>();
    const [renameFolderTo, setRenameFolderTo] = useState({folderId: '', newName: ''});
    const [elementToDelete, setElementToDelete] = useState('');
    const [treeHeight, setTreeHeight] = useState<number>(calculateTreeHeight(getSavedPapers()));

    /**
     * Copy all ids of folders in tree to array folderIds
     * @param tree to search for folderIds
     * @param folderIds Array to store folderIds in
     */
    function getFolderIds(tree: Array<TreeInterface>, folderIds : Array<number>) {
        for(let item in tree) {
            if(tree[item].value.charAt(0) === 'd') {
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
            if (item.value.charAt(0) === 'd') {
                size += calculateTreeHeight(item.children!);
            }
            size++; 
        }
        return size;
    }
  
    /**
    * Adds a folder to the tree
    * @param folderName name of the folder to add
    */
    function addFolder(folderName: string) {
        let tree = getSavedPapers();
        let id = Math.floor(Math.random() * 10000);
        let folderIds : Array<number> = [];

        getFolderIds(tree, folderIds);
        while (folderIds.includes(id)) id = Math.floor(Math.random() * 10000);

        tree.push({value: 'd' + id.toString(), name: folderName, children: []});
        
        saveTree(tree);
        setTreeHeight(calculateTreeHeight(tree));   
    }

    /**
     * a function to be given to the PaperSidebar 
     * @param name, the new name of the folder
     * @param id of the folder
     */
    function renameFolder (name : string, id: string){
        setRenameFolderTo({folderId: id, newName: name});
    }

    return (
        <FlexboxGrid justify='center'>
            <FlexboxGrid.Item colspan={10}>
                <PaperTree 
                    choosePaper={setSelectedElement} 
                    height={45*treeHeight} 
                    name={renameFolderTo.newName} 
                    id={renameFolderTo.folderId} 
                    toDelete={elementToDelete} 
                    tree={getSavedPapers()}
                />
            </FlexboxGrid.Item>
            <FlexboxGrid.Item colspan={4}>
                <PaperSidebar paper={selectedElement} newFolderName={renameFolder} delete={setElementToDelete}/>
                <Button appearance = 'primary' onClick={() => addFolder('New Folder')}>
                    Create new Folder
                </Button>
            </FlexboxGrid.Item>
        </FlexboxGrid>
    );
}