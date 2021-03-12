import React, {useEffect, useState} from 'react';
import { Link } from 'react-router-dom';

import { useParams } from 'react-router-dom';

import './styles/AuthorSearch.scss';
import '../Search/SearchBar/SearchBar.scss'
import {AutoComplete, Icon, InputGroup} from "rsuite";
import {AuthorInterface} from "./AuthorInterface";
import Config from "../../Utils/Config";

interface AuthorResultProps {
    text?: string;
    placeholder?: string;
}

export const AuthorSearch: React.FC<AuthorResultProps> = (props) => {
    let {query} = useParams<{query: string}>();

    // Searchbar input
    const [input, setInput] = useState('');
    // Searchbar autocomplete data
    const [authorAutocompleteList, setAuthorAutocompleteList] = useState<AuthorInterface[]>();


    // Effect hook for fetching author list from search API
    useEffect(() => {
        let requestURL = Config.base_url + '/api/search_author/?query=' + query;

        fetch(requestURL)
            .then(res => res.json())
            .then(result => setAuthorAutocompleteList(result.data)).catch(() => console.log("Can't access " + requestURL));
    }, [query]);


    // Display search results
    let resultList
    if (query != null) {
        resultList =
            <div className='wrapper' id='search-result-wrapper'>
                <div id='query-title'>
                    <h2>Showing search results for <b>"{query}"</b>:</h2>
                    <div className='line'></div>
                </div>
                <div className="result-list">
                    {authorAutocompleteList?.map((author) => (<Link to={`/author/${author.id}`}>{author.name}</Link>))}
                </div>
            </div>
            ;
    }

    return (
        <div className='page-search-result'>
            <div className="search-bar">
                {props.text? <><div className='text'>{props.text} </div> <br /></> : null}
                <form>
                    <InputGroup id="search-bar-group">
                        <AutoComplete placeholder={props.placeholder} value={input} onChange={(e) => setInput(e)} onSelect={(e) => window.location.href=`/author/${e.value}`}/>
                        <InputGroup.Button type="submit" onClick={() => window.location.href = '/authorsearch/' + input}>
                            <Icon icon="search" />
                        </InputGroup.Button>
                    </InputGroup>
                </form>
            </div>
            {resultList}
        </div>
    );
}