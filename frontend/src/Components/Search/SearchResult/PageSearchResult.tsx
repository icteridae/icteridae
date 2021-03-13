import React, {useEffect, useState} from 'react';

import { useParams } from 'react-router-dom';

import { Authors } from '../../General/Authors';
import { SearchResultList, setAbstractViewToCorrectHeight } from './SearchResultList';
import Config from '../../../Utils/Config'
import {Paper} from '../../../Utils/GeneralTypes'

import './styles/PageSearchResult.scss';


export const PageSearchResult : React.FC = () => {
    let {query} = useParams<{query: string}>();
    const [activePage, setActivePage] = useState<number>(1);
    const [selected, setSelected] = useState<Paper>();
    const [searchResults, setSearchResults] = useState<{data: Paper[], pages: number}>();
    const PAGESIZE = 10;

    useEffect(() => {
        let requestURL = Config.base_url + '/api/search/?query=' + query + '&page=' + activePage + '&pagesize=' + PAGESIZE;

        fetch(requestURL)
            .then(res => res.json())
            .then(result => {
                setSearchResults({data: result.data, pages: result.max_pages});
            }).catch(() => console.log("Can't access " + requestURL));
    }, [query, activePage]);


    return (
        <div className='page-search-result'>
            <div className='wrapper' id='search-result-wrapper'>
                <div id='query-title'>
                    <h2>Showing {PAGESIZE} of 1000 results for <b>"{query}"</b>:</h2>
                    <div className='line'></div>
                </div>
                {searchResults  && <SearchResultList results={searchResults} activePage={activePage} raiseStateSelected={setSelected} raiseStateActivePage={setActivePage}/>}
            </div>
            {(selected != null) && <AbstractView selected={selected}/>}
        </div>
    );
}

const AbstractView : React.FC<{selected: Paper}> = (props) => {
    // Effect hook for setting the height of AbstractView when it's rendered for the first time
    useEffect(() => {
        setAbstractViewToCorrectHeight();
    }, [])

    return(
        <div className='wrapper-2' id='search-result-wrapper-2'>
            <div id='search-result-abstract-view' className='abstract-view'>
                {(props.selected != null) && <h1>{props.selected.title}</h1>}
                <Authors authors={props.selected.authors} maxAuthors={5}/>
                <span className='fields-of-study'>{props.selected.fieldsOfStudy.join(' ,')}</span>
                <span className='year'>{props.selected.year}</span>
                <span className='citations'>{'Citations: ' + props.selected.inCitations.length + ', References: ' + props.selected.outCitations.length}</span>
                {(props.selected.paperAbstract === "") ? 'no Abstract available' : props.selected.paperAbstract}
            </div>
        </div>
    );
}

