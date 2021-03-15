import React from 'react';

import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { Helmet } from "react-helmet";

import { NavBar } from '../Navbar/Navbar';
import { FrontPage } from '../Front/FrontPage';
import { GraphFetch } from '../Graph/GraphHelperfunctions';
import { PageSearchResult } from '../Search/SearchResult/PageSearchResult';
import { SavedPapers } from '../SavedPapers/PageSavedPapersLocalstorage';
import { Description } from '../Description/Description';
import { AuthorSearchResult } from "../Author/AuthorSearchResult";
import { AuthorSearch } from "../Author/AuthorSearch";

import './App.scss';

 export const App: React.FC = () => (
    <BrowserRouter>
      <Helmet>
        <title>Icteridae</title>
      </Helmet>
      <NavBar/>
      <Switch>
          <Route exact path='/' component={FrontPage}/>
          <Route exact path='/results/:query' component={PageSearchResult}/>
          <Route exact path='/papers' component={SavedPapers}/>
          <Route exact path='/description' component={Description}/>
          <Route exact path='/graph/:id' component={GraphFetch}/>
          <Route exact path='/results/paper/:id' component={FrontPage}/>
          <Route exact path='/author/:id' component={AuthorSearchResult}/>
          <Route exact path='/authorsearch/:query' component={AuthorSearch}/>
      </Switch>
    </BrowserRouter>
  );
