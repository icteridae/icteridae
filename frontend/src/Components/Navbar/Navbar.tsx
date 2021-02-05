import * as React from "react";
import {  NavbarProps, Icon} from 'rsuite';
import './styles/Navbar.css'

/**
 * The Navbar hold links to the different sites of the application
 * @param props are the standard NabrbarProps from ruite
 * @returns the navbar with links to the Search-, My Papers-, Graph-, Privacy- and Aboutpages and a link to Github and to the settings
 */
export const NavBarInstance: React.FC<NavbarProps> = (props) => {
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
                <div className="navbar-my-papers navbar-item">
                    <span> 
                        <Icon icon="bookmark" style={{paddingRight: "5px", fontSize: "15px"}}/>
                        My Papers
                    </span>
                </div>
                <div className="navbar-about navbar-item">
                    <span>
                        <Icon icon="info" style={{paddingRight: "5px", fontSize: "15px"}}/>
                        About
                    </span>
                </div>
            </div>
            <div className="navbar-right">

            </div>
            
        </div>
    )
}
