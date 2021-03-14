import * as React from "react";
import { Link } from "react-router-dom";
import { Navbar, Nav, Icon, NavbarProps } from 'rsuite';
import { Settings } from "./Settings";
import './styles/Navbar.scss'

/**
 * The Navbar holds links to the different sites of the application
 * @param props are the standard NavbarProps from rsuite
 * @returns the navbar with links to the Search-, My Papers-, Graph-, Privacy- and Aboutpages and a link to Github and to the settings
 */
export const NavBarInstance: React.FC<NavbarProps> = (props) => {
    const [activeKey, handleSelect] = React.useState<string | null>(null);
    const [showSettings, setShowSettings] = React.useState<boolean>(false);

    return (
        <div id="navbar">
            <Navbar {...props}>
                <Navbar.Header>
                    <div className="navbar-brand">Icteridae</div>
                </Navbar.Header>
                <Navbar.Body>
                    <Nav onSelect={handleSelect} activeKey={activeKey}>
                        <Nav.Item componentClass={Link} to='/' eventKey="search" icon={<Icon icon="search" />}>Search</Nav.Item>
                        <Nav.Item componentClass={Link} to='/authorsearch' eventKey="author" icon={<Icon icon="user-o" />}>Authors</Nav.Item>
                        <Nav.Item componentClass={Link} to='/papers' eventKey="SavedPaper" icon={<Icon icon="bookmark" /> }>My Papers</Nav.Item>
                        {/*<Nav.Item componentClass={Link} to='/graph' eventKey="graph" icon={<Icon icon="circle-thin" /> }>Graph</Nav.Item>*/}
                        {/*<Nav.Item componentClass={Link} to='/privacy' eventKey="privacy" icon={<Icon icon="circle-thin" />}>Privacy</Nav.Item>*/}
                        <Nav.Item componentClass={Link} to='/description' eventKey="about" icon={<Icon icon="info" /> }>About</Nav.Item>
                        
                    </Nav>
                    <Nav pullRight>
                        <Nav.Item eventKey="github" icon={<Icon icon={"github"} />} href={"https://github.com/icteridae/icteridae"} target="_blank" > Github </Nav.Item>
                        {/*<Nav.Item eventkey="settings" icon={<Icon icon="cog" />} onClick={() => setShowSettings(true)}>Settings</Nav.Item>*/}
                    </Nav>
                </Navbar.Body>
            </Navbar>
            <h1>{showSettings}</h1>
            <Settings showSettings={showSettings} setShowSettings={setShowSettings}/>
        </div>
    )
}
