import React, { useEffect, useState } from 'react';

import { Pagination } from 'rsuite';

import { SearchResultCard } from "./SearchResultCard";
import { Paper } from '../../../Utils/GeneralTypes';

import './styles/SearchResultList.scss';

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

    // Effect hook for dynamically changing the height of the resultList and thus getting a scrollbar BECAUSE SCROLLBARS
    useEffect(() => {
        /**
         * Sets the height of a DOM-ELement with the id "search-result-list" to the remaining height on the page 
         * (which is calculated using the height of elements above search-result-list)
         */
        function setListToRemainingHeight() {
            const windowHeight = window.innerHeight;
            
            const navbarHeight : number | undefined = document.getElementById("navbar")?.offsetHeight;
            const queryTitleHeight : number | undefined = document.getElementById("query-title")?.offsetHeight;
            const list : HTMLElement | null = document.getElementById("search-result-list");

            // only set height if none of these is null or undefined
            if(navbarHeight != null && queryTitleHeight != null && list != null) {
                list.style.height = (windowHeight - navbarHeight - queryTitleHeight) + "px";
            }
        }

        setListToRemainingHeight();
        window.addEventListener('resize', setListToRemainingHeight);
        // Cleanup: Remove EventListener when component will unmount
        return () => {
            window.removeEventListener('resize', setListToRemainingHeight);
        }
    }, []);
    
    return (
        <div id="search-result-list" className="result-list">
            {props.results.data.map((entry: Paper, index: number) => {
                return <SearchResultCard highlightCard={highlightCard} raiseStateSelected={props.raiseStateSelected} key={entry.id} dataKey={index.toString()} data={entry}/>
            })}

            <Pagination 
                size='md' id='test' 
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