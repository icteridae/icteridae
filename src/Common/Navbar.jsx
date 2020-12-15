
import * as React from "react";
import { Navbar, Nav, Icon, Dropdown, Button } from 'rsuite';

import './styles/Navbar.css'




class NavBarInstance extends React.Component {
    constructor(...props) {
        super(...props);
        this.handleSelect = this.handleSelect.bind(this);
        this.state = {
            activeKey: null,
            props: props
        };
    }

    handleSelect(eventKey) {
        this.setState({
            activeKey: eventKey
        });
    }


    render() {
        return (
            <Navbar {...this.state.props}>
                <Navbar.Header>
                <a href="#" className="navbar-brand logo">
                    Icteridae
                </a>
            </Navbar.Header>
        <Navbar.Body>
            <Nav onSelect={this.handleSelect} activeKey={this.state.activeKey}>
                <Nav.Item eventKey="1" icon={<Icon icon="home" />}>
                    Home
                </Nav.Item>
                <Nav.Item eventKey="2">News</Nav.Item>
                <Nav.Item eventKey="3">Products</Nav.Item>
                <Dropdown title="About" toggleComponentClass={Button} appearance="default">
                    <Dropdown.Item eventKey="4" icon={<Icon icon={"steam"} />} > <a href={"https://github.com/icteridae"} target="_blank">Github</a> </Dropdown.Item>
                    <Dropdown.Item eventKey="5">Team</Dropdown.Item>
                    <Dropdown.Item eventKey="6">Contact</Dropdown.Item>
                </Dropdown>
            </Nav>
            <Nav pullRight>
                <Nav.Item icon={<Icon icon="cog" />}>Settings</Nav.Item>
            </Nav>
        </Navbar.Body>
            </Navbar>
        )
    }
}

export default NavBarInstance;