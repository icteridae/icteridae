import React from 'react';
import {NavBarInstance} from '../Navbar/Navbar';
import {Default} from '../Default/Default';

function App() {
  return (
    <div>
      <NavBarInstance appearance="subtle"/>
      <Default/>
    </div>
  );
}

export default App;
