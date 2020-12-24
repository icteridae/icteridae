import React from 'react';
import logo from './../logo.svg';
import './Default.css';

/**
 * This file preserves the default React main page. 
 * It will be deleted at a later time
 * TODO: remove file when not needed anymore
 */

export const Default: React.FC = () => (    
    <div className="App">
      <header className="App-header">
        
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );

