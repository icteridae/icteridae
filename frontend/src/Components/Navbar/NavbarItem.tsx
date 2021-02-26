import React from 'react';
import { NavLink } from 'react-router-dom';
import {Icon, IconProps} from 'rsuite';

export const NavbarItem : React.FC<{icon?: IconProps["icon"], label?: string, path: string, extern?: boolean, className?: string}> = (props) => {
    return (
        <>
            {(props.extern) ? (
                <a href={props.path} target={"_blank"} rel={"noreferrer"} className={"navbar-item " + (props.className || '')}>
                    <span> 
                        {props.icon && <Icon icon={props.icon} style={{paddingRight: "5px", fontSize: "15px"}}/>}
                        {props.label}
                    </span> 
                </a>
            ) : (
                <NavLink exact to={props.path} className={"navbar-item " + (props.className || '')} activeClassName={"navbar-item-active"}> 
                        <span> 
                            {props.icon && <Icon icon={props.icon} style={{paddingRight: "5px", fontSize: "15px"}}/>}
                            {props.label}
                        </span>
                </NavLink>
            )}
        </>
    )
}