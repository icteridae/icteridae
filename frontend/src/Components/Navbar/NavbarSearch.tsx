import React, { useState } from 'react';

import { Icon, IconProps } from 'rsuite';
import { useHistory } from 'react-router-dom';


export const NavbarSearch : React.FC<{label: string, value: string, raiseStateInput: Function, className: string, path: string, icon?: IconProps['icon']}> = (props) => {
    let history = useHistory();
    const [focused, setFocused] = useState(false);

    // focus input if user clicks anywhere on the element
    return (
        <div className={`navbar-search navbar-item ${props.className}`} onClick={() => {(document.querySelector(`.navbar-search.${props.className} input[type=text]`) as HTMLInputElement).focus()}}>
            <form onSubmit={(e) => {e.preventDefault(); if (props.value !== '') {history.push(`/${props.path}/${props.value}`)}}}>
                <Icon icon={(props.icon != null) ? props.icon : 'search'}/>
                <input type='text' placeholder={props.label} value={props.value} className={(props.value && 'has-text')} onChange={(e) => props.raiseStateInput(e.target.value)} onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}></input>
                {(focused || props.value) && <button className='reset-search' type='reset' onClick={() => props.raiseStateInput('')}>X</button>}
            </form>
        </div>
    );
}
