import React from 'react';
import {NavBarInstance} from '../Navbar/Navbar';
import {Default} from '../Default/Default';
import {Privacy} from '../Privacy/Privacy';
import { HashRouter, Route, Switch } from 'react-router-dom';

 export const App: React.FC = () => (
    <HashRouter>
      <NavBarInstance appearance="subtle"/>
      <Switch>
          <Route exact path='/' component={Default}/>
          <Route exact path='/privacy' component={Privacy}/>
          {/* TODO: insert other routes. See paths in Navbar.tsx */}
      </Switch>
    </HashRouter>
  );
