
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
                    <div className="navbar-brand">Icteridae</div>
            </Navbar.Header>
        <Navbar.Body>
            <Nav onSelect={this.handleSelect} activeKey={this.state.activeKey}>
                <Nav.Item eventKey="1" icon={<Icon icon="search" />}>
                    Search
                </Nav.Item>
                <Nav.Item eventKey="2" icon={<Icon icon="bookmark" /> }>My Papers</Nav.Item>
                <Nav.Item eventKey="3" icon={<Icon icon="circle-thin" /> }>Graph</Nav.Item>
                <Dropdown title="About" icon={<Icon icon="info" />} toggleComponentClass={Button} appearance="default">
                    <Dropdown.Item eventKey="4" icon={<Icon icon="file-text" />} >Description</Dropdown.Item>
                    <Dropdown.Item eventKey="5" icon={<Icon icon="group" />} >Contact</Dropdown.Item>
                </Dropdown>
            </Nav>
            <Nav pullRight>
                <Nav.Item eventKey="6" icon={<Icon icon={"github"} />} href={"https://github.com/icteridae/icteridae"} target="_blank" > Github </Nav.Item>
                <Nav.Item eventkey="7" icon={<Icon icon="cog" />}>Settings</Nav.Item>
            </Nav>
        </Navbar.Body>
            </Navbar>
        )
    }
}

export default NavBarInstance;