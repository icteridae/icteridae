import React from 'react';
import {Icon, IconProps} from 'rsuite';

export const NavbarItem : React.FC<{icon?: IconProps["icon"], label?: string, className?: string}> = (props) => {
    return (
        <div className={"navbar-item " + (props.className || '')}>
            <span> 
                {props.icon && <Icon icon={props.icon} style={{paddingRight: "5px", fontSize: "15px"}}/>}
                {props.label}
            </span>
        </div>
    )
}
