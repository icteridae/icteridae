import React from 'react';

import { NavLink } from 'react-router-dom';
import { Icon, IconProps } from 'rsuite';

export const NavbarItem : React.FC<{icon?: IconProps["icon"], label?: string, path: string, extern?: boolean, className?: string, onClick?: Function}> = (props) => {
    return (
        <>
            {// if the extern flag is set (NavbarItem links to an external link) render the anchor tag with the corresponding link, 
            // otherwise render the NavLink with the corresponding link. This is necessary to make the extern link open in a new tab / allow the user to middle-click the link
            (props.extern) ? (
                <a href={props.path} target={"_blank"} rel={"noreferrer"} className={"navbar-item " + (props.className || '')} onClick={() => props.onClick && props.onClick()}>
                    <span> 
                        {props.icon && <Icon icon={props.icon} style={{paddingRight: "5px", fontSize: "15px"}}/>}
                        {props.label}
                    </span> 
                </a>
            ) : (
                <NavLink exact to={props.path} className={"navbar-item " + (props.className || '')} activeClassName={"navbar-item-active"} onClick={() => props.onClick && props.onClick()}> 
                        <span> 
                            {props.icon && <Icon icon={props.icon} style={{paddingRight: "5px", fontSize: "15px"}}/>}
                            {props.label}
                        </span>
                </NavLink>
            )}
        </>
    )
}