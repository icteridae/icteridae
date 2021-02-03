import * as React from "react";
import {  NavbarProps } from 'rsuite';
import './styles/Navbar.css'

/**
 * The Navbar hold links to the different sites of the application
 * @param props are the standard NabrbarProps from ruite
 * @returns the navbar with links to the Search-, My Papers-, Graph-, Privacy- and Aboutpages and a link to Github and to the settings
 */
export const NavBarInstance: React.FC<NavbarProps> = (props) => {
    return (
        <div id="navbar">
            <div className="navbar-frontpage">
                <span>Icteridae</span>
            </div>
        </div>
    )
}
