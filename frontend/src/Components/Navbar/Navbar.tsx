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
    const [paperSearchInput, setPaperSearchInput] = useState<string>('');
    const [authorSearchInput, setAuthorSearchInput] = useState<string>('')
    let matchPaper = useRouteMatch('/results/:query')
    let matchAuthor = useRouteMatch('/authorsearch/:query')
    // This hooks fills NavbarSearch with the correct query if the user managed to get to the results page without using the NavbarSearch itself
    useEffect(() => {
        (paperSearchInput === '') && (matchPaper && setPaperSearchInput((matchPaper.params as {query: string}).query));
        (authorSearchInput === '') && (matchAuthor && setAuthorSearchInput((matchAuthor.params as {query: string}).query));
    }, [])

    const resetInput = () => {
        setPaperSearchInput('');
        setAuthorSearchInput('');
    }
    return (
        <div id='navbar'>
            <div className='navbar-left'>
                <NavbarItem label='Icteridae' path='/' className='navbar-home' onClick={resetInput}/>
                <NavbarSearch label='Papers' path='results' value={paperSearchInput} raiseStateInput={setPaperSearchInput} className='navbar-paper-search'/>
                <NavbarSearch label='Authors' path='authorsearch' icon='user-o' value={authorSearchInput} raiseStateInput={setAuthorSearchInput} className='navbar-author-search'/>
                <NavbarItem icon='bookmark' label='My Papers' path='/papers' className='navbar-my-papers' onClick={resetInput}/>
                <NavbarItem icon='info' label='About' path='/description' className='navbar-about' onClick={resetInput}/>
            </div>
            <div className='navbar-right'>
                <NavbarItem extern icon='github' label='Github' path='https://github.com/icteridae/icteridae/' className='navbar-github'/>
            </div>
        </div>
    )
}
