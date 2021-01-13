import React from 'react';
import { Link } from 'react-router-dom';
import './styles/SearchResultCard.css';
import { DataInterface } from './Types';

type SearchResultCardProps = {
    func: Function,
    highlightCard: Function,
    data: DataInterface,
    dataKey: number
}

export const SearchResultCard : React.FC<SearchResultCardProps> = (props) => {
    return (
        <div className={"searchResultCard"} data-key={props.dataKey}>
            <div 
                className="content" 
                onMouseEnter={() => {
                    props.func(props.data);
                    props.highlightCard(props.dataKey);
                }}
                >
                <h3 className="title">
                    <Link to={`paper/${props.data.id}`}>{props.data.title}</Link>
                </h3>
                <span className="author">{props.data.authors.map(obj => obj.name).join(", ")}</span>
                <span>{props.data.fieldsOfStudy.join(" ,")}</span>
                <span className="date">{props.data.year}</span>
                <span className="previewText">{(props.data.paperAbstract === "") ? "no Abstract available" : (props.data.paperAbstract.substr(0, 283) + "...")}</span>
            </div>
        </div>
    );
}