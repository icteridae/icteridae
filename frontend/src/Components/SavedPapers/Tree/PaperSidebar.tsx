import * as React from 'react';
import { Button } from 'rsuite';

const PaperSidebar = (props : any) => {
    if (!props.paper) return (
        <div/>
    )
    if (props.paper.isFolder) return (
        <div>
            <h2>Folder</h2>
            Insert Edit folder name <br/>
            <Button appearance='primary'>Rename Folder</Button>
        </div>);
    return (
        <div>
            <h2>Paper</h2>
            <p>
                This is the paper about something <br/>
                Here is some metadata about the paper <br/>
            </p>
            <Button appearance='primary'>Generate Graph</Button>
        </div>
    )
};

export default PaperSidebar;