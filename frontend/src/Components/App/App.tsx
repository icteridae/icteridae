import React from 'react';
import { Footer } from 'rsuite';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import { NavBarInstance } from '../Navbar/Navbar';
import { FrontPage } from '../Front/FrontPage';
import { PageImprint } from '../Privacy/PageImprint';
import { GraphFetch } from '../Graph/GraphHelperfunctions';
import { PageSavedPapers } from '../SavedPapers/PageSavedPapers';
import { PageSearchResult } from '../Search/SearchResult/PageSearchResult';

import './App.css';

import logo from '../../icon.png'

 export const App: React.FC = () => (
    <BrowserRouter>
      <NavBarInstance appearance="subtle"/>
      <Switch>
          <Route exact path='/' component={FrontPage}/>
          <Route exact path='/results/:query' component={PageSearchResult}/>
          <Route exact path='/privacy' component={PageImprint}/>
          <Route exact path='/graph/:id' component={GraphFetch}/>
          <Route exact path ='/papers' component={PageSavedPapers}/>
          <Route exact path='/results/paper/:id' component={FrontPage}/>
          {/* TODO: insert other routes. See paths in Navbar.tsx */}
      </Switch>
      
      <Footer className='footer'>
                <img src={logo} alt="Logo"/> &copy; {new Date().getFullYear()} Icteridae
      </Footer>
    </BrowserRouter>
  );
