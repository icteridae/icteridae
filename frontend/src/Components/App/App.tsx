import React from 'react';
import {NavBarInstance} from '../Navbar/Navbar';
import {FrontPage} from '../Front/FrontPage';
import {Privacy} from '../Privacy/Privacy';
import {GraphFetch} from '../Graph/Graph';
import { HashRouter, Route, Switch } from 'react-router-dom';

 export const App: React.FC = () => (
    <HashRouter>
      <NavBarInstance appearance="subtle"/>
      <Switch>
          <Route exact path='/' component={FrontPage}/>
          <Route exact path='/privacy' component={Privacy}/>
          <Route exact path='/Graph' component={GraphFetch}/>
          {/* TODO: insert other routes. See paths in Navbar.tsx */}
      </Switch>
    </HashRouter>
  );
