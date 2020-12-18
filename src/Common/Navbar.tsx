import * as React from "react";
import { Navbar, Nav, Icon, Dropdown, Button, NavbarProps, IconProps } from 'rsuite';
import './styles/Navbar.css'

export const NavBarInstance: React.FC<NavbarProps> = (props) => {
    const [activeKey, handleSelect] = React.useState<string | null>(null);

    return (
        <Navbar {...props}>
            <Navbar.Header>
                <div className="navbar-brand">Icteridae</div>
            </Navbar.Header>
            <Navbar.Body>
                <Nav onSelect={handleSelect} activeKey={activeKey}>
                    <Nav.Item eventKey="search" icon={<Icon icon="search" />}>
                        Search
                    </Nav.Item>
                    <Nav.Item eventKey="mypapers" icon={<Icon icon="bookmark" /> }>My Papers</Nav.Item>
                    <Nav.Item eventKey="graph" icon={<Icon icon="circle-thin" /> }>Graph</Nav.Item>
                    <Dropdown eventKey="dropdown" title="About" icon={<Icon icon="info" />} toggleComponentClass={Button} appearance="default">
                        <Dropdown.Item eventKey="description" icon={<Icon icon="file-text" />} >Description</Dropdown.Item>
                        <Dropdown.Item eventKey="contact" icon={<Icon icon="group" />} >Contact</Dropdown.Item>
                    </Dropdown>
                </Nav>
                <Nav pullRight>
                    <Nav.Item eventKey="github" icon={<Icon icon={"github"} />} href={"https://github.com/icteridae/icteridae"} target="_blank" > Github </Nav.Item>
                    <Nav.Item eventkey="settings" icon={<Icon icon="cog" />}>Settings</Nav.Item>
                </Nav>
            </Navbar.Body>
        </Navbar>
    )
}
