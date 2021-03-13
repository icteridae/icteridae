import React, {useEffect, useState} from 'react';
import './styles/SearchResultList.scss';
import { SearchResultCard } from "./SearchResultCard";
import { DataInterface } from './Types';
import Config from '../../../Utils/Config';
import { Pagination } from 'rsuite';

interface ResultListProps {
    query: string,
    pageSize: number,

    /**function used to raise state, takes DataInterface as argument */
    raiseStateSelected: React.Dispatch<React.SetStateAction<DataInterface | undefined>>
}

export const SearchResultList : React.FC<ResultListProps> = (props) => {
    const [searchResults, setSearchResults] = useState<DataInterface[]>();
    const [lastHighlighted, setLastHighlighted] = useState<string>();
    const [activePage, setActivePage] = useState<number>(1);
    const [maxPages, setMaxPages] = useState<number>();

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

                setAbstractViewToCorrectHeight();
            }
        }

        setListToRemainingHeight();
        window.addEventListener('resize', setListToRemainingHeight);
        // Cleanup: Remove EventListener when component will unmount
        return () => {
            window.removeEventListener('resize', setListToRemainingHeight);
        }
    }, []);

    // Effect hook for fetching query data from search API
    useEffect(() => {
        let requestURL = Config.base_url + '/api/search/?query=' + props.query + '&page=' + activePage + '&pagesize=' + props.pageSize;

        fetch(requestURL)
            .then(res => res.json())
            .then(result => {
                setSearchResults(result.data);
                setMaxPages(result.max_pages);
            }).catch(() => console.log("Can't access " + requestURL));
    }, [props.query, activePage]);

    
    return (
        <div id="search-result-list" className="result-list">
            {
                // short-circuit eval, if searchResults null don't render
                (searchResults != null) && searchResults.map((entry: DataInterface, index: number) => {
                    return <SearchResultCard highlightCard={highlightCard} raiseStateSelected={props.raiseStateSelected} key={entry.id} dataKey={index.toString()} data={entry}/>
                })
                
            }
            {
                (maxPages != null) && 
                    <Pagination 
                        size='md' 
                        id='test' 
                        activePage={activePage} 
                        pages={maxPages} 
                        maxButtons={3} 
                        ellipsis 
                        boundaryLinks 
                        onSelect={(eventKey) => {
                            setActivePage(eventKey);
                            document.getElementById('search-result-list')?.scrollTo(0, 0)}
                        }/>
            }
        </div>
    );
}

/**
 * Sets the height of the DOM-Element with the id "search-result-abstract-view" to the computed height of the DOM-Element with the id "search-result-list"
 */
export function setAbstractViewToCorrectHeight() {
    const queryTitle = document.getElementById("query-title");
    const list = document.getElementById('search-result-list');
    const wrapper2 = document.getElementById('search-result-wrapper-2');
    const abstractView = document.getElementById('search-result-abstract-view');

    if(queryTitle != null && list != null && wrapper2 != null && abstractView != null) {
        wrapper2.style.height = queryTitle.offsetHeight + list.offsetHeight + "px";
        const abstractViewVerticalMargin : number = parseInt(window.getComputedStyle(abstractView).marginTop) + parseInt(window.getComputedStyle(abstractView).marginBottom)
        abstractView.style.height = parseInt(wrapper2.style.height) - abstractViewVerticalMargin + "px";
    }
}