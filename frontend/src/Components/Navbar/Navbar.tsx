import Nav from "@rsuite/responsive-nav";
import * as React from "react";
import { Link, NavLink, useRouteMatch } from "react-router-dom";
import { Navbar, Icon, Button, NavbarProps, NavProps } from 'rsuite';
import { usePaperGraph, usePaperNameList } from "../../Utils/GraphContext";
import { Settings } from "./Settings";
import './styles/Navbar.css'
import history from '../../Utils/history'

/**
 * The Navbar hold links to the different sites of the application
 * @param props are the standard NabrbarProps from ruite
 * @returns the navbar with links to the Search-, My Papers-, Graph-, Privacy- and Aboutpages and a link to Github and to the settings
 */
export const NavBarInstance: React.FC<NavbarProps> = (props) => {
    const [showSettings, setShowSettings] = React.useState<boolean>(false);
    const activeKey = '5';

    const [paperNameList, setPaperNameList] = usePaperNameList();
    const paperGraphDict = usePaperGraph();

    const SearchMatch = useRouteMatch('/');


    return (
        <div id="navbar">
            {history.location.pathname}
            Hello there: {SearchMatch?.isExact.toString()}
            <Navbar {...props}>
                <Navbar.Header>
                    <div className="navbar-brand">Icteridae</div>
                </Navbar.Header>
                <Navbar.Body>
                    <Nav>
                        <Nav.Item componentClass={NavLink} exact to='/' icon={<Icon icon="search" />}>Search</Nav.Item>
                        <Nav.Item componentClass={NavLink} exact to='/papers/' icon={<Icon icon="bookmark" /> }>My Papers</Nav.Item>
                        <Nav.Item componentClass={NavLink} exact to='/graph/' icon={<Icon icon="circle-thin" /> }>Graph</Nav.Item>
                        <Nav.Item componentClass={NavLink} exact to='/privacy/' eventKey="privacy" icon={<Icon icon="circle-thin" />}>Privacy</Nav.Item>
                        <Nav.Item componentClass={NavLink} exact to='/about/' eventKey="about" icon={<Icon icon="info" />}>About</Nav.Item>
                    </Nav>

                    <Nav
                        removable
                        moreText={<Icon icon="more" />}
                        moreProps={{ noCaret: true }}
                        activeKey={activeKey}
                        
                        onItemRemove={eventKey => {
                            
                            if (eventKey == activeKey) {
                                history.push('/');
                            }

                            const nextItems = [...paperNameList];
                            nextItems.splice(
                                nextItems.map(item => item.id).indexOf(eventKey as string),
                                1
                            );
                            setPaperNameList!(nextItems);
                            //handleSelect(nextItems[0] ? nextItems[0].id : null);
                        }}
                    >
                        {paperNameList.map((element, index) => 
                            <Nav.Item componentClass={NavLink} to={'/graph/' + element.id} key={element.id} icon={<Icon icon={paperGraphDict[element.id] == null ? "circle-thin" : 'circle'} />}>{element.title}: {element.id}</Nav.Item>
                        )}
                    </Nav>

                    <Nav pullRight>
                        <Nav.Item icon={<Icon icon={"github"} />} href={"https://github.com/icteridae/icteridae"} target="_blank" > Github </Nav.Item>
                        <Nav.Item icon={<Icon icon="cog" />} onClick={() => setShowSettings(true)}>Settings</Nav.Item>
                    </Nav>
                </Navbar.Body>
            </Navbar>
            <h1>{showSettings}</h1>
            <Settings showSettings={showSettings} setShowSettings={setShowSettings}/>
        </div>
    )
}
