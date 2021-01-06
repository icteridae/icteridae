import React from 'react';
import {SearchBar} from "../Search/SearchBar/SearchBar";
import './FrontPage.css'


export const FrontPage: React.FC = () => (
      <div className="FrontPage">
          <header className="Header">
              Welcome to Icteridae!
          </header>
          <body className="Searching">
              <SearchBar placeholder="Search for your Papers!" />
          </body>
          <footer className="Imprint">
              Ich bin ein Test!
          </footer>
      </div>
)

