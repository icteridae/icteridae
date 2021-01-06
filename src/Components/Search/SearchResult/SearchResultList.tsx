import React, {useEffect} from 'react';

import './styles/SearchResultList.css';
import SearchResultCard from "./SearchResultCard";

type data = {
    key: number;
    title: string,
    authors: string[],
    date: string,
    citations: number,
    preview: string
}

type ResultListProps = {
    query: string,
    func: Function,
    data: Array<data>
}

const SearchResultList : React.FC<ResultListProps> = (props) => {
    // Effect hook for dynamically changing the height of the resultList and thus getting a scrollbar BECAUSE SCROLLBARS
    useEffect(() => {
        function setListToRemainingHeight() {
            let windowHeight = window.innerHeight;
            // @ts-ignore
            let navbarHeight = document.getElementById("navbar").offsetHeight;

            let list = document.getElementById("list");

            // @ts-ignore
            list.style.height = (windowHeight - navbarHeight) + "px";
            console.log("test");
        }

        setListToRemainingHeight();
        window.addEventListener('resize', setListToRemainingHeight);
    }, []);

    return (
        <div id="list" className="resultList">
            <h2>Showing search results for <b>"{props.query}"</b>:</h2>
            {props.data.map((entry) => {
                return <SearchResultCard func={props.func} key={entry.key} data={entry}/>
            })
            }
        </div>
    );
}

export default SearchResultList;