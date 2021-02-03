import * as React from 'react';

import { Button, Input } from 'rsuite';
import { TreeInterface } from './PaperTree';

/**
 * The PaperSideBar Displays options for the choosen Object. If the Object is a folder it can be renamed or deleted
 * If the object is a paper it can be deleted or the graph can be generated
 * @param props 
 */
export const PaperSidebar : React.FC<{paper : TreeInterface | undefined, newFolderName : Function, delete : Function}>= (props) => {
    let [newName, setNewName] = React.useState("");


    if (!props.paper) return (
        <div/>
    )
    if (props.paper.value.charAt(0) == 'd') return (
        <div>
            <h2>{props.paper.name}</h2>
            Insert Edit folder name <br/>
            <form onSubmit={(e) => {e.preventDefault(); props.newFolderName(newName, props.paper?.value);}}>
            <Input id="newName" placeholder={props.paper.name} onChange={(e : string) => setNewName(e)}  /> 
            <Button appearance='primary' type="reset" onClick= {() => {props.newFolderName(newName, props.paper?.value); }}>Rename Folder</Button>
            <Button appearance='primary' onClick= {() => {props.delete(props.paper?.value)}}>Delete Folder</Button>
            </form>
        </div>);
    return (
        <div>
            <h2>Paper</h2>
            <p>
                This is the paper about something <br/>
                Here is some metadata about the paper <br/>
            </p>
            <Button appearance='primary'>Generate Graph</Button>
            <Button appearance='primary' onClick= {() => {props.delete(props.paper?.value)}}>Delete Paper</Button>
        </div>
    )
};
