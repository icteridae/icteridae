import React from 'react';
import {NavBarInstance} from '../Navbar/Navbar';
import {Default} from '../Default/Default';
import { HashRouter, Route, Switch } from 'react-router-dom';

function App() {
  return (
    <div>
      <HashRouter>
        <NavBarInstance appearance="subtle"/>
        <Switch>
            <Route exact path='/' component={Default}/> 
            {/* TODO: insert other routes */}
        </Switch>
      </HashRouter>
    </div>
  );
}

export default App;
