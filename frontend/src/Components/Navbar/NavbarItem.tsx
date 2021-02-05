import React from 'react';
import { useHistory } from 'react-router-dom';
import {Icon, IconProps} from 'rsuite';

export const NavbarItem : React.FC<{icon?: IconProps["icon"], label?: string, path: string, extern?: boolean, className?: string}> = (props) => {
    let history = useHistory();
    return (
        <div onClick={(props.extern) ? () => {window.open(props.path)} : () => {history.push(props.path)}} className={"navbar-item " + (props.className || '')}>
            <span> 
                {props.icon && <Icon icon={props.icon} style={{paddingRight: "5px", fontSize: "15px"}}/>}
                {props.label}
            </span>
        </div>
    )
}