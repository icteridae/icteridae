import React from 'react';

import { Button, Input } from 'rsuite';

import { TreeNode } from './PaperTree';

/**
 * The PaperSideBar Displays options for the choosen Object. If the Object is a folder it can be renamed or deleted
 * If the object is a paper it can be deleted or the graph can be generated
 * @param treeNode The tree node to display options on, if paper display generate Graph and delete option, if folder display rename and delete option
 * @param renameFolder Function for renaming a folder
 * @param deleteTreeNode Function for deleting a TreeNode
 */
export const PaperSidebar : React.FC<{treeNode : TreeNode | undefined, renameFolder : Function, deleteTreeNode : Function}> = (props) => {
    const [newFolderNameInput, setNewFolderNameInput] = React.useState('');

    if (!props.treeNode)
        return <div/>;
    else if (props.treeNode.value.charAt(0) === 'd') {
        return (
            <div>
                <h2>{props.treeNode.folderName}</h2>
                Insert Edit folder name <br/>
                <form onSubmit={(e) => {e.preventDefault(); props.renameFolder(newFolderNameInput, props.treeNode?.value);}}>
                    <Input id='new-folder-name' placeholder={props.treeNode.folderName} onChange={(e : string) => setNewFolderNameInput(e)}/> 
                    <Button appearance='primary' type='reset' onClick= {() => {props.renameFolder(newFolderNameInput, props.treeNode?.value);}}>Rename Folder</Button>
                    <Button appearance='primary' onClick= {() => props.deleteTreeNode(props.treeNode?.value)}>Delete Folder</Button>
                </form>
            </div>
        );
    } else {
        return (
            <div>
                <h2>Paper</h2>
                <p>
                    This is the paper about something <br/>
                    Here is some metadata about the paper <br/>
                </p>
                <Button appearance='primary'>Generate Graph</Button>
                <Button appearance='primary' onClick= {() => props.deleteTreeNode(props.treeNode?.value)}>Delete Paper</Button>
            </div>
        );
    }
};
