import React, { useState } from 'react';
import { Icon, Input } from 'rsuite';

export const RenamableDirectory : React.FC<{name: string, setName: (s:string) => void}> = (props) => {
    const [renaming, setRenaming] = useState<boolean>(false);

    return (
    <div 
        tabIndex={1} 
        onBlur={(e: React.FocusEvent<HTMLDivElement>) => {if (e.target.tagName === "INPUT") setRenaming(false)}}>
        {renaming ? 
            <Input 
                
                value={props.name} 
                onChange={(val) => {props.setName(val)}}/> 
            : 
            <div 
                onDoubleClick={() => setRenaming(true)}>
                    <Icon icon='folder'/> {props.name}
            </div>}
    </div>)
}