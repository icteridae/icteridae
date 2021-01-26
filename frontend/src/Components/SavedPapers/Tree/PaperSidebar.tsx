import * as React from 'react';
import { Button, Icon } from 'rsuite';

const PaperSidebar = (props : any) => {
    let [newName, setNewName] = React.useState("");

    function handleChange(event : React.ChangeEvent<HTMLInputElement>) {
        setNewName(event?.target.value)
    }


    if (!props.paper) return (
        <div/>
    )
    if (props.paper.value.charAt(0) == 'd') return (
        <div>
            <h2>Folder</h2>
            Insert Edit folder name <br/>
            <input type="text" name="newName" onChange={handleChange}></input>
            <Button appearance='primary' onClick= {() => {props.newFolderName(newName, props.paper.value)}}>Rename Folder</Button>
            <Button appearance='primary' onClick= {() => {props.Delete(props.paper.value)}}>Delete Folder</Button>
        </div>);
    return (
        <div>
            <h2>Paper</h2>
            <p>
                This is the paper about something <br/>
                Here is some metadata about the paper <br/>
            </p>
            <Button appearance='primary'>Generate Graph</Button>
            <Button appearance='primary' onClick= {() => {props.Delete(props.paper.value)}}>Delete Paper</Button>
        </div>
    )
};

export default PaperSidebar;