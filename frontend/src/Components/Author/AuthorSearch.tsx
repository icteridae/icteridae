import React, {useEffect, useState} from 'react';
import { Link } from 'react-router-dom';

import { useHistory, useParams } from 'react-router-dom';

import './styles/AuthorSearch.sass';
import {AutoComplete, FlexboxGrid, Icon, InputGroup, Pagination} from "rsuite";
import {AuthorInterface} from "./AuthorInterface";
import Config from "../../Utils/Config";
import { Sorry } from '../General/Sorry';
import { PulseLoader } from 'react-spinners';

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
    // undefined: inital value
    // null: api request sent
    const [authorList, setAuthorList] = useState<AuthorInterface[] | undefined | null>(undefined);

    const [activePage, setActivePage] = useState<number>(1);
    const [maxPages, setMaxPages] = useState<number>();
    const [count, setCount] = useState<number>();


    const updateContent = (query: string, activePage: number): void => {
        if (query===undefined) {return;}
        const requestURL = Config.base_url + '/api/search_author/?query=' + query + '&page=' + activePage;
        setAuthorList(null)
        fetch(requestURL)
            .then(res => res.json())
            .then(result => {
                setAuthorList(result.data);
                setMaxPages(result.max_pages);
                setCount(result.count);
            }).catch(() => console.log("Can't access " + requestURL));
    }

    // Effect hook for fetching author list from search API
    useEffect(() => {
        setActivePage(1);
        setMaxPages(0);
        setCount(0);
        setAuthorList(undefined)
        updateContent(query, 1)
    }, [query])

    useEffect(() => {
        updateContent(query, activePage)
    }, [activePage])

    const getAuthorAbreviation = (author: string): string => {
        const authorAr = author.split(/ +/) // Why are there two spaces in an authors name??? 
        const abrAr = authorAr.slice(0, authorAr.length-1).map(n => n[0] + '.')
        abrAr.push(authorAr[authorAr.length-1])
        return abrAr.join(' ')
    }

    // Display search results
    let resultList
    if (query != null && authorList !== undefined) {
        resultList =
            <div className='wrapper' id='author-list-wrapper'>
                <div id='query-title'>
                    <h2>Showing search results for <b>"{query}"</b>:</h2>
                    <div className='line'></div>
                </div>
                <div id="author-result-list">
                    <FlexboxGrid justify='center'>
                        {authorList?.map((author) => (
                                <Link className='author-card' to={`/author/${author.id}`}>
                                    <div>{getAuthorAbreviation(author.name)}</div> 
                                    <div className='author-full-name'>{author.name}</div>
                                    
                                    </Link>
                            ))}
                    </FlexboxGrid>
                    
                    
                    {
                        (maxPages != null) &&
                        <Pagination
                            size='md'
                            id='pagination'
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
                <form onSubmit={(e) => {e.preventDefault(); history.push(`/authorsearch/${input}`);}}>
                <InputGroup id="search-bar-group">
                        <AutoComplete placeholder='Search for authors...' value={input} onChange={(e) => setInput(e)} />
                        <InputGroup.Button type="submit" onClick={() => {history.push(`/authorsearch/${input}`);}}>
                            <Icon icon="search" />
                        </InputGroup.Button>
                    </InputGroup>
                </form>
            </div>
            {authorList===undefined ? <></> :
             authorList===null ? <div className="spinner"><PulseLoader/></div> 
            : authorList.length === 0 ? <Sorry
                message="No matching authors found"
                description="Are you sure you've entered the right name?"
                />
            : resultList}
        </div>
    );
}