import React from 'react';

import { Link } from 'react-router-dom'

import { Authors } from './Authors'
import { Bookmark } from './Bookmark'
import { Paper } from '../../Utils/GeneralTypes'

import './style/AbstractView.sass'

export const AbstractView : React.FC<{selected: Paper}> = (props) => {
    return(
            <div id='search-result-abstract-view' className='abstract-view'>
                <h1 className='title'>
                    <Link to={`/graph/${props.selected.id}`}>{props.selected.title}</Link>
                    <Bookmark paper_id={props.selected.id} size='md'/>
                </h1>

                <Authors authors={props.selected.authors} maxAuthors={5}/>
                <span className='fields-of-study'>{props.selected.fieldsOfStudy.join(', ')}</span>
                <span className='year'>{props.selected.year}</span>
                <span className='citations'>{'Citations: ' + props.selected.inCitations.length + ', References: ' + props.selected.outCitations.length}</span>
                {
                    (props.selected.paperAbstract === "") ? 'no Abstract available' : 
                        (<div className='paper-abstract'>
                            <h3>Abstract:</h3>
                            {props.selected.paperAbstract}
                        </div>)
                }
            </div>
    );
}