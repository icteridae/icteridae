import React from 'react';

import './styles/ResultList.css';
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
    data: Array<data>
}

const ResultList : React.FC<ResultListProps> = (props) => {
    return (
        <div className="resultList">
            <h2>Showing search results for <b>"{props.query}"</b>:</h2>
            {props.data.map((entry) => {
                return <SearchResultCard key={entry.key} data={entry}/>
            })
            }
        </div>
    );
}

export default ResultList;