import React from 'react';
import './styles/SearchResultCard.css';

type SearchResultCardProps = {
    func: Function,
    highlightCard: Function,
    data: {
        id: number;
        title: string,
        authors: {name: string, ids:Array<Number>}[],
        year: number,
        paperAbstract: string
    },
    dataKey: number
}

const SearchResultCard : React.FC<SearchResultCardProps> = (props) => {
    return (
        <div className={"searchResultCard"} data-key={props.dataKey}>
            <div 
                className="content" 
                onMouseEnter={() => {
                    props.func(props.data);
                    props.highlightCard(props.dataKey);
                }}
                >
                <h3 className="title"><a href="/">{props.data.title}</a></h3>
                <span className="author">{props.data.authors.map(obj => obj.name).join(", ")}</span>
                <span className="date">{props.data.year}</span>
                <span className="previewText">{(props.data.paperAbstract === "") ? "no Abstract available" : (props.data.paperAbstract.substr(0, 283) + "...")}</span>
            </div>
        </div>
    );
}

export default SearchResultCard;