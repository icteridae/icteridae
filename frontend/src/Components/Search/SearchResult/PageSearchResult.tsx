import React, {useState} from 'react';
import './styles/PageSearchResult.css'
import SearchResultList from "./SearchResultList";

const query: string = "Dies ist eins query";

const PageSearchResult = () => {
    const [selected, setSelected] = useState<{title: string, paperAbstract: string}>();

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


const AbstractView : React.FC<{selected: {title: string, paperAbstract: string}}> = (props) => {
    return(
        <div className="abstractView">
            {(props.selected != null) && <h1>{props.selected.title}</h1>}
            {(props.selected != null) && props.selected.paperAbstract}
        </div>
    );
}

export default PageSearchResult;