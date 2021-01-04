import React from 'react';
import logo from './logo.svg';
import './App.css';
import {NavBarInstance} from './Common/Navbar';
import PageSearchResult from "./Components/Search/SearchResult/PageSearchResult";

function App() {
  return (
    <div>
      <NavBarInstance appearance="subtle"/>
    
    <div className="App" style={{width:"100%"}}>
      <PageSearchResult/>
    </div>
    </div>
  );
}

export default App;
