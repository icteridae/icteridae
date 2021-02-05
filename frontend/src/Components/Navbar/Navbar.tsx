import * as React from "react";
import {Icon} from 'rsuite';
import { NavbarItem } from './NavbarItem';
import './styles/Navbar.css'

/**
 * The Navbar hold links to the different sites of the application
 * @param props are the standard NabrbarProps from ruite
 * @returns the navbar with links to the Search-, My Papers-, Graph-, Privacy- and Aboutpages and a link to Github and to the settings
 */
export const NavBar: React.FC = (props) => {
    return (
        <div id="navbar">
            <div className="navbar-left">
                <div className="navbar-home">
                    <span>Icteridae</span>
                    <div className='navbar-current'></div>
                </div>
                <div className="navbar-search navbar-item">
                    <form id="navbar-search-form">
                        <Icon icon='search'/>
                        <input type="search" placeholder="Search"></input>
                    </form>
                </div>
                <NavbarItem icon="bookmark" label="My Papers" className="navbar-my-papers"/>
                <NavbarItem icon="info" label="About" className="navbar-about"/>
            </div>
            <div className="navbar-right">

            </div>
            
        </div>
    )
}
