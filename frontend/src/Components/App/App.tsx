import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import { NavBarInstance } from '../Navbar/Navbar';
import { FrontPage } from '../Front/FrontPage';
import { PageImprint } from '../Privacy/PageImprint';
import { GraphFetch } from '../Graph/GraphHelperfunctions';
import { PageSearchResult } from '../Search/SearchResult/PageSearchResult';
import { SavedPapers } from '../SavedPapers/PageSavedPapersLocalstorage';
import { Description } from '../Description/Description';

import './App.scss';

import logo from '../../icon.png'

 export const App: React.FC = () => (
    <BrowserRouter>
      <NavBarInstance appearance="subtle"/>
      <Switch>
          <Route exact path='/' component={FrontPage}/>
          <Route exact path='/results/:query' component={PageSearchResult}/>
          <Route exact path='/privacy' component={PageImprint}/>
          <Route exact path ='/papers' component={SavedPapers}/>
          <Route exact path='/description' component={Description}/>
          <Route exact path='/graph/:id' component={GraphFetch}/>
          <Route exact path='/results/paper/:id' component={FrontPage}/>
          {/* TODO: insert other routes. See paths in Navbar.tsx */}
      </Switch>
    </BrowserRouter>
  );
