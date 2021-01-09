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
                <div className="abstractView">
                    {(selected != null) && <h1>{selected.title}</h1>}
                    {(selected != null) && selected.paperAbstract}
                </div>
            </div>
        </div>
    );
}

export default PageSearchResult;