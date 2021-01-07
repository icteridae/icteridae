import React from 'react';
import {SearchBar} from "../Search/SearchBar/SearchBar";
import {Card} from "./Card/Card";
import './FrontPage.css'
import logo from '../../icon.png'
import {PanelGroup} from "rsuite";

export const FrontPage: React.FC = () => (
      <div className="FrontPage">
          <header className="Header">
              Welcome to Icteridae!
          </header>
          <body className="Body">
            <div className="Searching">
              <SearchBar placeholder="Search for your Papers!" />
            </div>
                Recently opened Papers: <br />
            <div className="Suggestions">
                <Card title={"Attention is all you need"} year={"2017"} author={"Dennis Hoebelt"} link={'/papers/'} ></Card>
                <Card title={"Was du heute kannst besorgen"} year={"1929"} author={"So nen Typ"} link={'/graph/'}></Card>
                <Card title={"das verschiebe stets auf Morgen"} year={"1930"} author={"so nen Typ"} link={'/privacy/'} ></Card>
            </div>
          </body>
          <footer className="Imprint">
              <img src={logo} alt="Logo"/> &copy; 2021 Icteridae
          </footer>
      </div>
)

