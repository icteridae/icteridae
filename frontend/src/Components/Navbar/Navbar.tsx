import React, { useEffect, useState } from 'react';

import { useRouteMatch } from 'react-router-dom';

import { NavbarItem } from './NavbarItem';
import { NavbarSearch } from './NavbarSearch';

import './styles/Navbar.sass';

/**
 * The Navbar holds links to the different sites of the application
 * @returns the navbar with links to the Search-, My Papers-, Graph-, Privacy- and About-pages and a link to Github
 */
export const NavBar: React.FC = () => {
    const [searchInput, setSearchInput] = useState<string>('');
    let match = useRouteMatch('/results/:query')
    
    // This hooks fills NavbarSearch with the correct query if the user managed to get to the results page without using the NavbarSearch itself
    useEffect(() => {
        (searchInput === '') && (match && setSearchInput((match.params as {query: string}).query));
    })

    const resetInput = () => setSearchInput('');
    return (
        <div id='navbar'>
            <div className='navbar-left'>
                <NavbarItem label='Icteridae' path='/' className='navbar-home' onClick={resetInput}/>
                <NavbarSearch value={searchInput} raiseStateInput={setSearchInput}/>
                <NavbarItem icon='bookmark' label='My Papers' path='/papers' className='navbar-my-papers' onClick={resetInput}/>
                <NavbarItem icon='info' label='About' path='/privacy' className='navbar-about' onClick={resetInput}/>
            </div>
            <div className='navbar-right'>
                <NavbarItem extern icon='github' label='Github' path='https://github.com/icteridae/icteridae/' className='navbar-github'/>
            </div>
        </div>
    )
}
