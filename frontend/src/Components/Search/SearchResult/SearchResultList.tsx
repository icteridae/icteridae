import React, {useEffect, useState} from 'react';
import './styles/SearchResultList.css';
import SearchResultCard from "./SearchResultCard";
import DataInterface from './Types'
import Config from '../../../Utils/Config'

type ResultListProps = {
    query: string,
    func: Function
}

const SearchResultList : React.FC<ResultListProps> = (props) => {
    const [searchResults, setSearchResults] = useState<DataInterface[]>();
    const [lastHighlighted, setLastHighlighted] = useState<number>();

    /**
     * Highlight a card with the given key and unhighlight the card that was last highlighted
     * @param {number} key The data-key value of the card to be highlighted
     */
    function highlightCard(key: number) {
        document.querySelector(`[data-key="${lastHighlighted}"]`)?.classList.remove("card-selected");
        document.querySelector(`[data-key="${key}"]`)?.classList.add("card-selected");
        setLastHighlighted(key);
    }

    // Effect hook for dynamically changing the height of the resultList and thus getting a scrollbar BECAUSE SCROLLBARS
    useEffect(() => {
        function setListToRemainingHeight() {
            let windowHeight = window.innerHeight;
            // @ts-ignore
            let navbarHeight = document.getElementById("navbar").offsetHeight;
            // @ts-ignore
            let queryTitleHeight = document.getElementById("queryTitle").offsetHeight;
            let list = document.getElementById("list");

            // @ts-ignore
            list.style.height = (windowHeight - navbarHeight - queryTitleHeight) + "px";
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
        let requestURL = Config.base_url + '/api/search/?query=' + props.query;

        fetch(requestURL)
            .then(res => res.json())
            .then(result => setSearchResults(result.data)).catch(() => console.log("Can't access " + requestURL));
    }, [props.query]);

    
    return (
        <div id="list" className="resultList">
            {
                // short-circuit eval, if searchResults null don't render
                searchResults != null && searchResults.map((entry: DataInterface, index: number) => {
                    return <SearchResultCard highlightCard={highlightCard} func={props.func} key={entry.id} dataKey={index} data={entry}/>
                })
            }
        </div>
    );
}

export default SearchResultList;