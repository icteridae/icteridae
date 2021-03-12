import React, {useEffect, useState} from 'react';
import { Link } from 'react-router-dom';

import { useParams } from 'react-router-dom';

import './styles/AuthorSearch.css';
import '../Search/SearchBar/SearchBar.css'
import {AutoComplete, Icon, InputGroup} from "rsuite";
import {AuthorInterface} from "./AuthorInterface";
import {DataInterface} from "../Search/SearchResult/Types";
import Config from "../../Utils/Config";

interface AuthorResultProps {
    text?: string;
    placeholder?: string;
}

export const AuthorSearch: React.FC<AuthorResultProps> = (props) => {
    let {query} = useParams<{query: string}>();

    let {id} = useParams<{id: string}>();

    // Searchbar input
    const [input, setInput] = useState('');
    // Searchbar autocomplete data
    const [authorAutocompleteList, setAuthorAutocompleteList] = useState<AuthorInterface[]>();
    // Currently displayed author
    const [selectedAuthor, setSelectedAuthor] = useState<AuthorInterface>()
    // Papers depending on selected author
    const [authorPapers, setAuthorPapers] = useState<DataInterface[]>();


    // Effect hook for fetching author list from search API
    useEffect(() => {
        let requestURL = Config.base_url + '/api/search_author/?query=' + input;

        fetch(requestURL)
            .then(res => res.json())
            .then(result => setAuthorAutocompleteList(result.data)).catch(() => console.log("Can't access " + requestURL));
    }, [input]);

    // Effect hook for setting author and fetching paper data from search API
    useEffect(() => {
        let requestURLAuthor = Config.base_url + '/api/author/?author_id=' + id;

        fetch(requestURLAuthor)
            .then(res => res.json())
            .then(result => setSelectedAuthor(result.data[0])).catch(() => console.log("Can't access " + requestURLAuthor));
    }, [id]);

    return (
        <div className='page-search-result'>
            <div className="search-bar">
                {props.text? <><div className='text'>{props.text} </div> <br /></> : null}
                <form>
                    <InputGroup id="search-bar-group">
                        <AutoComplete placeholder={props.placeholder} data={authorAutocompleteList?.map((author) => {return {label: author.name, value: author.id}})} value={input} onChange={(e) => setInput(e)} onSelect={(e) => window.location.href=`/author/${e.value}`}/>
                        <InputGroup.Button type="submit" onClick={() => window.location.href = '/authorsearch/' + query}>
                            <Icon icon="search" />
                        </InputGroup.Button>
                    </InputGroup>
                </form>
            </div>
            <div className='wrapper' id='search-result-wrapper'>
                <div id='query-title'>
                    <h2>Showing search results for <b>"{query}"</b>:</h2>
                    <div className='line'></div>
                </div>
                <div className='result-list'>

                </div>
            </div>
        </div>
    );
}