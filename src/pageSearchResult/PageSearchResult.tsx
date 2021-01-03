import React from 'react';
import {PanelGroup, Panel, Placeholder, Grid, Row, Col} from 'rsuite';
import SearchResultCard from './SearchResultCard';
import './styles/PageSearchResult.css'

const data = {
    title: "Lorem ipsum dolor sit amet, consetetur sadipscing elitr",
    authors: ["autor1", "autor2", "autor3"],
    date: "1999",
    citations: 200,
    preview: "Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua."
}

function PageSearchResult () {
    return (
        <div className="resultList">
            <SearchResultCard data={data} />
            <SearchResultCard data={data} />
        </div>
    );
}

export default PageSearchResult;