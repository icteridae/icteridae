import React from 'react';
import {NavBarInstance} from '../Navbar/Navbar';
import {FrontPage} from '../Front/FrontPage';
import {Privacy} from '../Privacy/Privacy';
import {Graph} from '../Graph/Graph';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import {PageSearchResult} from '../Search/SearchResult/PageSearchResult'; 

 export const App: React.FC = () => (
    <BrowserRouter>
      <NavBarInstance appearance="subtle"/>
      <Switch>
          <Route exact path='/' component={FrontPage}/>
          <Route exact path='/results' component={PageSearchResult}/>
          <Route exact path='/privacy' component={Privacy}/>
          <Route exact path='/Graph' component={Graph}/>
          {/* TODO: insert other routes. See paths in Navbar.tsx */}
      </Switch>
    </BrowserRouter>
  );
