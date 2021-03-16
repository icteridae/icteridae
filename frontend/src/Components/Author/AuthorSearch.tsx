import React, {useEffect, useState} from 'react';

import { FlexboxGrid, Pagination } from 'rsuite';
import { Link, useParams } from 'react-router-dom';
import { PulseLoader } from 'react-spinners';

import Config from '../../Utils/Config';
import { Sorry } from '../General/Sorry';
import { Author } from '../../Utils/GeneralTypes';

import './styles/AuthorSearch.sass';

/**
 * Page for displaying the results of searching an author
 */

export const AuthorSearch: React.FC = () => {
    const {query} = useParams<{query: string}>();

    // Author list
    const [authorList, setAuthorList] = useState<Author[] | undefined>(undefined);
    // The currently viewed page using pagination
    const [activePage, setActivePage] = useState<number>(1);
    // Maximum number of possible pages
    const [maxPages, setMaxPages] = useState<number>();
    // Maximum number of results
    const [count, setCount] = useState<number>(0);
    
    const PAGESIZE = 40;

    const updateContent = (query: string, activePage: number): void => {
        if (query===undefined) {return;}
        const requestURL = Config.base_url + '/api/author/search/?query=' + query + '&page=' + activePage + '&pagesize=' + PAGESIZE;

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
        // Rests pagination variables when changing query
        setActivePage(1);
        setMaxPages(0);
        setCount(0);
        setAuthorList(undefined)
        updateContent(query, 1)
    }, [query])

    useEffect(() => {
        updateContent(query, activePage)
    // Only refresh on new active page. useEffect above will handle changed query
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [activePage])

    // Display search results
    let resultList
    if (query != null && authorList !== undefined) {
        resultList =
            <div className='wrapper' id='author-list-wrapper'>
                <div className='query-title'>
                    <h2>Showing {(PAGESIZE <= count) ? PAGESIZE : count} of {count} results</h2>
                    <div className='line'></div>
                </div>
                <div id='author-result-list'>
                    <FlexboxGrid justify='center'>
                        {authorList?.map((author) => (
                                <AuthorCard author={author} key={author.id}/>
                            ))}
                    </FlexboxGrid>
                    
                    {(maxPages != null) &&
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
                                document.getElementById('search-result-list')?.scrollTo(0, 0)
                            }}
                        />
                    }
                </div>
            </div>
            ;
    }

    return (
        <div className='author-search-page'>
            
            {authorList===undefined ? <div className='spinner'><PulseLoader/></div> 
            : authorList.length === 0 ? <Sorry
                message='No matching authors found'
                description="Are you sure you've entered the right name?"
                />
            : resultList}
        </div>
    );
}

export const AuthorCard: React.FC<{author: Author}> = (props) => {

    const getAuthorAbreviation = (author: string): string => {
        const authorAr = author.split(/ +/) // Why are there two spaces in an authors name??? 
        const abrAr = authorAr.slice(0, authorAr.length-1).map(n => n[0] + '.')
        abrAr.push(authorAr[authorAr.length-1])
        return abrAr.join(' ')
    }

    return (
        <Link className='author-card' to={`/author/${props.author.id}`}>
            <div>{getAuthorAbreviation(props.author.name)}</div> 
            <div className='author-full-name'>{props.author.name}</div>
        </Link>
    )
};