import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Icon } from 'rsuite';


export const NavbarSearch : React.FC = () => {
    let history = useHistory();
    const [input, setInput] = useState('');

    return (
        <div className="navbar-search navbar-item" onClick={(e) => {(document.querySelector(".navbar-search input[type=search]") as HTMLInputElement).focus()}}>
            <form id="navbar-search-form" onSubmit={() => history.push(`/results/${input}`)}>
                <Icon icon='search'/>
                <input type="search" placeholder="Search" onChange={(e) => setInput(e.target.value)}></input>
            </form>
        </div>
    );
}
