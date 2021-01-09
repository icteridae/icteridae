import React, {useState} from 'react';
import './styles/PageSearchResult.css'
import SearchResultList from "./SearchResultList";
import { parentPort } from 'worker_threads';

const query: string = "Dies ist eins query";

const PageSearchResult = () => {
    const [selected, setSelected] = useState<data>();

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

type data = {
    id: number;
    title: string,
    authors: {name: string, ids:number[]}[],
    year: number,
    paperAbstract: string
}


const AbstractView : React.FC<{selected: data}> = (props) => {
    return(
        <div className="abstractView">
            {(props.selected != null) && <h1>{props.selected.title}</h1>}
            <h3>{props.selected.authors.map(obj => obj.name).join(", ")}</h3>
            {(props.selected.paperAbstract === "") ? "no Abstract available" : props.selected.paperAbstract}
        </div>
    );
}

export default PageSearchResult;