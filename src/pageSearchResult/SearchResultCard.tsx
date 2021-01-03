import React from 'react';
import {Panel} from 'rsuite';

import './styles/SearchResultCard.css';

type SearchResultCardProps = {
    data: {
        title: string,
        authors: string[],
        date: string,
        citations: number,
        preview: string
    }
}

const SearchResultCard : React.FC<SearchResultCardProps> = (props) => {
    return (
        <Panel className="searchResultCard">
            <div className="card">
                <h5 className="title">{props.data.title}</h5>
                <span className="author">{props.data.authors.join(", ")}</span>
                <span className="date">{props.data.date}</span>
                <span className="citations">{props.data.citations + " Citations"}</span>
                <span className="previewText">{props.data.preview.substr(0, 200) + "..."}</span>
            </div>
        </Panel>
    );
}

export default SearchResultCard;