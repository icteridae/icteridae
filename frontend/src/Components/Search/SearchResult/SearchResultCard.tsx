import React from 'react';
import './styles/SearchResultCard.css';

type SearchResultCardProps = {
    func: Function,
    data: {
        key: number;
        title: string,
        authors: string[],
        date: string,
        citations: number,
        preview: string
    }
}

const SearchResultCard : React.FC<SearchResultCardProps> = (props) => {
    return (
        <div className="searchResultCard">
            <div className="content" onMouseOver={() => props.func(props.data)}>
                <h3 className="title">{props.data.title}</h3>
                <span className="author">{props.data.authors.join(", ")}</span>
                <span className="date">{props.data.date}</span>
                <span className="previewText">{props.data.preview.substr(0, 283) + "..."}</span>
            </div>
        </div>
    );
}

export default SearchResultCard;