import React from 'react';
import {SearchBar} from "../Search/SearchBar/SearchBar";
import './FrontPage.css'
import logo from '../../icon.png'

export const FrontPage: React.FC = () => (
      <div className="FrontPage">
          <header className="Header">
              Welcome to Icteridae!
          </header>
          <body className="Searching">
              <SearchBar placeholder="Search for your Papers!" />
          </body>
          <footer className="Imprint">
              <img src={logo} alt="Logo"/> &copy; 2021 Icteridae
          </footer>
      </div>
)

