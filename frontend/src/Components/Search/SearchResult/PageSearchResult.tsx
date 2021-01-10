import React, {useState} from 'react';
import './styles/PageSearchResult.css';
import SearchResultList from "./SearchResultList";
import DataInterface from "./Types";

const query: string = "Dies ist eins query";

export const PageSearchResult : React.FC = () => {
    const [selected, setSelected] = useState<DataInterface>();

    return (
        <div className="pageSearchResult">
            <div id="queryTitle">
                <h2>Showing search results for <b>"{query}"</b>:</h2>
            </div>
            <div className="wrapper">
                <SearchResultList query={query} func={setSelected}/>
                {(selected != null) && <AbstractView selected={selected}/>}
            </div>
        </div>
    );
}


const AbstractView : React.FC<{selected: DataInterface}> = (props) => {
    return(
        <div className="abstractView">
            {(props.selected != null) && <h1>{props.selected.title}</h1>}
            <h3>{props.selected.authors.map(obj => obj.name).join(", ")}</h3>
            <span className="fieldsOfStudy">{props.selected.fieldsOfStudy.join(" ,")}</span>
            <span className="year">{props.selected.year}</span>
            <span className="Citations">{"Citations: " + props.selected.inCitations.length + ", References: " + props.selected.outCitations.length}</span>
            {(props.selected.paperAbstract === "") ? "no Abstract available" : props.selected.paperAbstract}
        </div>
    );
}

