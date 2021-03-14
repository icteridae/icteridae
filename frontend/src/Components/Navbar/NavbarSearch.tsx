import React, { useState } from 'react';

import { Icon } from 'rsuite';
import { useHistory } from 'react-router-dom';


export const NavbarSearch : React.FC<{value: string, raiseStateInput: Function}> = (props) => {
    let history = useHistory();
    const [focused, setFocused] = useState(false);

    // focus input if user clicks anywhere on the element
    return (
        <div className='navbar-search navbar-item' onClick={() => {(document.querySelector('.navbar-search input[type=text]') as HTMLInputElement).focus()}}>
            <form id="navbar-search-form" onSubmit={(e) => {e.preventDefault(); history.push(`/results/${props.value}`)}}>
                <Icon icon='search'/>
                <input type='text' placeholder='Search' value={props.value} className={(props.value && 'has-text')} onChange={(e) => props.raiseStateInput(e.target.value)} onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}></input>
                {(focused || props.value) && <button className="reset-search" type="reset" onClick={() => props.raiseStateInput("")}>X</button>}
            </form>
        </div>
    );
}
