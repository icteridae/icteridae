import React, {useState} from 'react';
import './styles/PageSearchResult.css';
import { SearchResultList } from "./SearchResultList";
import { DataInterface } from "./Types";
import { useParams } from 'react-router-dom';

export const PageSearchResult : React.FC = () => {
    let {query} = useParams<{query: string}>(); 
    const [selected, setSelected] = useState<DataInterface>();
    
    return (
        <div className="page-search-result">
            <div id="query-title">
                <h2>Showing search results for <b>"{query}"</b>:</h2>
            </div>
            <div className="wrapper">
                <SearchResultList query={query} raiseStateSelected={setSelected}/>
                {(selected != null) && <AbstractView selected={selected}/>}
            </div>
        </div>
    );
}


const AbstractView : React.FC<{selected: DataInterface}> = (props) => {
    return(
        <div className="abstract-view">
            {(props.selected != null) && <h1>{props.selected.title}</h1>}
            <h3>{props.selected.authors.map(obj => obj.name).join(", ")}</h3>
            <span className="fields-of-study">{props.selected.fieldsOfStudy.join(" ,")}</span>
            <span className="year">{props.selected.year}</span>
            <span className="citations">{"Citations: " + props.selected.inCitations.length + ", References: " + props.selected.outCitations.length}</span>
            {(props.selected.paperAbstract === "") ? "no Abstract available" : props.selected.paperAbstract}
        </div>
    );
}

