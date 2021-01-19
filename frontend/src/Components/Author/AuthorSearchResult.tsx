import './AuthorSearchResult.css'
import {useParams} from "react-router-dom";
import React, {useEffect, useState} from "react";
import Config from "../../Utils/Config";
import {DataInterface} from "../Search/SearchResult/Types";

interface ResultListProps {
    query: string,
}

export const AuthorSearchResult: React.FC<ResultListProps> = (props) => {
    let {query} = useParams<{query: string}>();
    const [selected, setSelected] = useState<DataInterface>();
    const [searchResults, setSearchResults] = useState<DataInterface[]>();

    // Effect hook for fetching query data from search API
    useEffect(() => {
        let requestURL = Config.base_url + '/api/search/?query=' + props.query;

        fetch(requestURL)
            .then(res => res.json())
            .then(result => setSearchResults(result.data)).catch(() => console.log("Can't access " + requestURL));
    }, [props.query]);

    return (
        <div className="author-search-result">
            <div id="query-title">
                <h2>{query}</h2>
            </div>
            <div className="wrapper">
                {}
            </div>
        </div>
    )
}