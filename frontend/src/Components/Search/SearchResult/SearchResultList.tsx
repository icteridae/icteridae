import React, {useEffect, useState} from 'react';
import './styles/SearchResultList.css';
import SearchResultCard from "./SearchResultCard";

type data = {
    id: number;
    title: string,
    authors: {name: string, ids:number[]}[],
    year: number,
    paperAbstract: string
}

type ResultListProps = {
    query: string,
    func: Function
}

const SearchResultList : React.FC<ResultListProps> = (props) => {
    const [searchResults, setSearchResults] = useState<data[]>();

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
        let requestURL = 'http://127.0.0.1:8000/api/search?query=' + props.query;

        fetch(requestURL)
            .then(res => res.json())
            .then(result => setSearchResults(result.data));
    }, [props.query]);

    return (
        <div id="list" className="resultList">
            {
                // short-circuit eval, if searchResults null don't render
                searchResults != null && searchResults.map((entry: data) => {
                    return <SearchResultCard func={props.func} key={entry.id} data={entry}/>
                })
            }
        </div>
    );
}

export default SearchResultList;