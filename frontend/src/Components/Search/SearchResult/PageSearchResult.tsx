import React, {useEffect, useState} from 'react';

import { DataInterface } from './Types';
import { SearchResultList, setAbstractViewToListHeight } from './SearchResultList';

import { useParams } from 'react-router-dom';

import './styles/PageSearchResult.css';


export const PageSearchResult : React.FC = () => {
    let {query} = useParams<{query: string}>(); 
    const [selected, setSelected] = useState<DataInterface>();
    
    return (
        <div className='page-search-result'>
            <div className='wrapper'>
                <div id='query-title'>
                    <h2>Showing search results for <b>"{query}"</b>:</h2>
                    <div className='line'></div>
                </div>
                <SearchResultList query={query} raiseStateSelected={setSelected}/>
            </div>
            {(selected != null) && <AbstractView selected={selected}/>}
        </div>
    );
}

const AbstractView : React.FC<{selected: DataInterface}> = (props) => {
    // Effect hook for setting the height of AbstractView when it's rendered for the first time
    useEffect(() => {
        setAbstractViewToListHeight();
    }, [])

    return(
        <div id='search-result-abstract-view' className='abstract-view'>
            {(props.selected != null) && <h1>{props.selected.title}</h1>}
            <h3>{props.selected.authors.map(obj => obj.name).join(", ")}</h3>
            <span className='fields-of-study'>{props.selected.fieldsOfStudy.join(' ,')}</span>
            <span className='year'>{props.selected.year}</span>
            <span className='citations'>{'Citations: ' + props.selected.inCitations.length + ', References: ' + props.selected.outCitations.length}</span>
            {(props.selected.paperAbstract === "") ? 'no Abstract available' : props.selected.paperAbstract}
        </div>
    );
}

