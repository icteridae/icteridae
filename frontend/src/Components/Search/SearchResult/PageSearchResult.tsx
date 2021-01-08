import React, {useState} from 'react';
import './styles/PageSearchResult.css'
import SearchResultList from "./SearchResultList";

const query:string = "Dies ist eins query";


const initialState = {
    key: 1,
    title: "Lorem ipsum dolor sit amet, consetetur sadipscing elitr",
    authors: ["autor1", "autor2", "autor3"],
    date: "1999",
    citations: 200,
    paperAbstract: "Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua."
}

const PageSearchResult = () => {
    const [selected, setSelected] = useState(initialState);

    return (
        <div className="pageSearchResult">
            <div id="queryTitle">
                <h2>Showing search results for <b>"{query}"</b>:</h2>
            </div>
            <div className="wrapper">
                <SearchResultList query={query} func={setSelected}/>
                <div className="abstractView">
                    <h1>{selected.title}</h1>
                    {selected.paperAbstract}
                </div>
            </div>
        </div>
    );
}

export default PageSearchResult;