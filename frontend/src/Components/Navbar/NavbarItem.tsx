import React from 'react';
import { NavLink } from 'react-router-dom';
import {Icon, IconProps} from 'rsuite';

export const NavbarItem : React.FC<{icon?: IconProps["icon"], label?: string, path: string, extern?: boolean, className?: string}> = (props) => {
    return (
        <a href={props.path} target={(props.extern) ? "_blank" : undefined} rel={"noreferrer"} className={"navbar-item " + (props.className || '')}>
            {(props.extern) ? 
            (
                <span> 
                    {props.icon && <Icon icon={props.icon} style={{paddingRight: "5px", fontSize: "15px"}}/>}
                    {props.label}
                </span>
            ) : 
            (
                <NavLink exact to={props.path} activeClassName={"navbar-item-active"}>
                    <span> 
                        {props.icon && <Icon icon={props.icon} style={{paddingRight: "5px", fontSize: "15px"}}/>}
                        {props.label}
                    </span>
                </NavLink>
            )} 
        </a>
    )
}