import React from 'react';
import './Default.css';
import {SearchBar} from "../Search/SearchBar/SearchBar";

/**
 * This file preserves the default React main page. 
 * It will be deleted at a later time
 * TODO: remove file when not needed anymore
 */

export const Default: React.FC = () => (
    <div className="App">
        <div className="SearchBar">
            <SearchBar text = "Ich bin eine Biene!"></SearchBar>
        </div>
    </div>
);

