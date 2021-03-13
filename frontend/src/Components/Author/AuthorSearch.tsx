import React, {useEffect, useState} from 'react';
import { Link } from 'react-router-dom';

import { useHistory, useParams } from 'react-router-dom';

import './styles/AuthorSearch.sass';
import '../Search/SearchBar/SearchBar.scss'
import {AutoComplete, Icon, InputGroup, Pagination} from "rsuite";
import {AuthorInterface} from "./AuthorInterface";
import Config from "../../Utils/Config";

interface AuthorResultProps {
    text?: string;
    placeholder?: string;
}

export const AuthorSearch: React.FC<AuthorResultProps> = (props) => {
    let {query} = useParams<{query: string}>();
    let history = useHistory();

    // Searchbar input
    const [input, setInput] = useState('');
    // Author list
    const [authorList, setAuthorList] = useState<AuthorInterface[]>();

    const [activePage, setActivePage] = useState<number>(1);
    const [maxPages, setMaxPages] = useState<number>();
    const [count, setCount] = useState<number>();


    // Effect hook for fetching author list from search API
    useEffect(() => {
        let requestURL = Config.base_url + '/api/search_author/?query=' + query + '&page=' + activePage;

        fetch(requestURL)
            .then(res => res.json())
            .then(result => {
                setAuthorList(result.data);
                setMaxPages(result.max_pages);
                setCount(result.count);
            }).catch(() => console.log("Can't access " + requestURL));
    }, [query, activePage]);

    const buttonClick = () => {
        history.push(`/authorsearch/${input}`);
    }


    // Display search results
    let resultList
    if (query != null) {
        resultList =
            <div className='wrapper' id='author-list-wrapper'>
                <div id='query-title'>
                    <h2>Showing search results for <b>"{query}"</b>:</h2>
                    <div className='line'></div>
                </div>
                <div className="result-list" id="author-result-list">
                    {authorList?.map((author) => (<Link to={`/author/${author.id}`}>{author.name}</Link>))}
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
            </div>
            ;
    }

    return (
        <div className='author-search-page'>
            <div className="search-bar">
                {props.text? <><div className='text'>{props.text} </div> <br /></> : null}
                <form onSubmit={buttonClick}>
                <InputGroup id="search-bar-group">
                        <AutoComplete placeholder='Search for authors...' value={input} onChange={(e) => setInput(e)} />
                        <InputGroup.Button type="submit" onClick={buttonClick}>
                            <Icon icon="search" />
                        </InputGroup.Button>
                    </InputGroup>
                </form>
            </div>
            {resultList}
        </div>
    );
}