import React from 'react';

import { Link } from 'react-router-dom';

import {Authors} from '../../General/Authors'
import { Bookmark } from '../../General/Bookmark';
import { DataInterface } from './Types';


import './styles/SearchResultCard.scss';
import { Paper } from '../../../Utils/GeneralTypes';

interface SearchResultCardProps {
    /**function used to raise state, takes DataInterface as argument */
    raiseStateSelected: React.Dispatch<React.SetStateAction<Paper | undefined>>,
    highlightCard: (dataKey:string) => void,
    data: Paper,
    dataKey: string
}

export const SearchResultCard : React.FC<SearchResultCardProps> = (props) => {
    return (
        <div className="search-result-card" data-key={props.dataKey}>
            <div 
                className="content" 
                onMouseEnter={() => {
                    props.raiseStateSelected(props.data);
                    props.highlightCard(props.dataKey);
                }}
                >
                <h3 className="title">
                    <Link to={`/graph/${props.data.id}`}>{props.data.title}</Link>
                    <Bookmark paper_id={props.data.id}/>
                </h3>
                <Authors authors={props.data.authors} maxAuthors={3}/>
                <span>{props.data.fieldsOfStudy.join(", ")}</span>
                <span className="date">{props.data.year}</span>
                <span className="preview-text">{(props.data.paperAbstract === "") ? "no Abstract available" : (props.data.paperAbstract.substr(0, 320) + "...")}</span>
            </div>
        </div>
    );
}