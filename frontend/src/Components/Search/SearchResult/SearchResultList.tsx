import React, {useEffect, useState} from 'react';
import './styles/SearchResultList.css';
import SearchResultCard from "./SearchResultCard";

type data = {
    key: number;
    title: string,
    authors: {name: string, ids:number[]}[],
    year: number,
    paperAbstract: string
}

type ResultListProps = {
    query: string,
    func: Function,
}

const SearchResultList : React.FC<ResultListProps> = (props) => {
    // Effect hook for dynamically changing the height of the resultList and thus getting a scrollbar BECAUSE SCROLLBARS
    const [searchResults, setSearchResults] : any = useState();

    useEffect(() => {
        function setListToRemainingHeight() {
            let windowHeight = window.innerHeight;
            // @ts-ignore
            let navbarHeight = document.getElementById("navbar").offsetHeight;
            // @ts-ignore
            let queryTitleHeight = document.getElementById("queryTitle").offsetHeight;
            let list = document.getElementById("list");

            if(list == null)
                return;
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


    if(searchResults == null) {
        return null;
        //TODO: SPINNER
    }

    return (
        <div id="list" className="resultList">
            {
                searchResults.map((entry: any) => {
                    return <SearchResultCard func={props.func} key={entry.id} data={entry}/>
                })
            }
        </div>
    );
}

export default SearchResultList;