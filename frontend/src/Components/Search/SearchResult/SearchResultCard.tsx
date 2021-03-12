import React from 'react';
import { Link } from 'react-router-dom';
import { Icon, IconButton } from 'rsuite';
import { addSavedPaper, getSavedPapersList } from '../../../Utils/Webstorage';
import { Bookmark } from '../../General/Bookmark';
import './styles/SearchResultCard.scss';
import { DataInterface } from './Types';

interface SearchResultCardProps {
    /**function used to raise state, takes DataInterface as argument */
    raiseStateSelected: React.Dispatch<React.SetStateAction<DataInterface | undefined>>,
    highlightCard: (dataKey:string) => void,
    data: DataInterface,
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
                <span className="author">{props.data.authors.map<React.ReactNode>(obj => (<Link to={`/author/${obj.id}`}>{obj.name}</Link>)).reduce((prev, curr) => [prev, ', ', curr])}</span>
                <span>{props.data.fieldsOfStudy.join(", ")}</span>
                <span className="date">{props.data.year}</span>
                <span className="preview-text">{(props.data.paperAbstract === "") ? "no Abstract available" : (props.data.paperAbstract.substr(0, 320) + "...")}</span>
            </div>
        </div>
    );
}