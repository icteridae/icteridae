import React, { useEffect, useState } from 'react';

import { Pagination } from 'rsuite';

import { SearchResultCard } from "./SearchResultCard";
import { Paper } from '../../../Utils/GeneralTypes';

import './styles/SearchResultList.sass';
import '../../General/style/Pagination.sass'

interface ResultListProps {
    activePage: number,
    results: {data: Paper[], pages: number},
    
    /**function used to raise state, takes Paper as argument */
    raiseStateSelected: React.Dispatch<React.SetStateAction<Paper | undefined>>,
    raiseStateActivePage: React.Dispatch<React.SetStateAction<number>>
}

export const SearchResultList : React.FC<ResultListProps> = (props) => {
    const [lastHighlighted, setLastHighlighted] = useState<string>();

    /**
     * Highlight a card with the given key and unhighlight the card that was last highlighted
     * @param {number} key The data-key value of the card to be highlighted
     */
    function highlightCard(key: string) {
        document.querySelector(`[data-key="${lastHighlighted}"]`)?.classList.remove("card-selected");
        document.querySelector(`[data-key="${key}"]`)?.classList.add("card-selected");
        setLastHighlighted(key);
    }
    
    return (
        <div id="search-result-list" className="result-list">
            {props.results.data.map((entry: Paper, index: number) => {
                return <SearchResultCard highlightCard={highlightCard} raiseStateSelected={props.raiseStateSelected} key={entry.id} dataKey={index.toString()} data={entry}/>
            })}

            <Pagination 
                size='md' id='pagination' 
                activePage={props.activePage} 
                pages={props.results.pages} 
                maxButtons={3} 
                ellipsis 
                boundaryLinks 
                onSelect={(eventKey) => {
                    props.raiseStateActivePage(eventKey);
                    document.getElementById('search-result-list')?.scrollTo(0, 0)}
                }/>
        </div>
    );
}