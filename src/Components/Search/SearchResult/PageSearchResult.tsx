import React from 'react';
import SearchResultCard from './SearchResultCard';
import './styles/PageSearchResult.css'
import SearchResultList from "./SearchResultList";


const query:string = "Dies ist eins query";
const data = [
    {
        key: 1,
        title: "Lorem ipsum dolor sit amet, consetetur sadipscing elitr",
        authors: ["autor1", "autor2", "autor3"],
        date: "1999",
        citations: 200,
        preview: "Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua."
    },
    {
        key: 2,
        title: "Sed diam nonumy eirmod tempor invidunt ut labore",
        authors: ["Author 1", "Author 2", "Author 3", "Author 4"],
        date: "2000",
        citations: 2000,
        preview: "Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua."
    },
    {
        key: 3,
        title: "Sed diam nonumy eirmod tempor invidunt ut labore",
        authors: ["Author 1", "Author 2", "Author 3", "Author 4"],
        date: "2000",
        citations: 2000,
        preview: "Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua."
    },
    {
        key: 4,
        title: "Sed diam nonumy eirmod tempor invidunt ut labore",
        authors: ["Author 1", "Author 2", "Author 3", "Author 4"],
        date: "2000",
        citations: 2000,
        preview: "Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua."
    },
    {
        key: 5,
        title: "Sed diam nonumy eirmod tempor invidunt ut labore",
        authors: ["Author 1", "Author 2", "Author 3", "Author 4"],
        date: "2000",
        citations: 2000,
        preview: "Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua."
    },
    {
        key: 6,
        title: "Sed diam nonumy eirmod tempor invidunt ut labore",
        authors: ["Author 1", "Author 2", "Author 3", "Author 4"],
        date: "2000",
        citations: 2000,
        preview: "Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua."
    }
]

function PageSearchResult () {
    return (
        <div className="pageSearchResult">
            <SearchResultList query={query} data={data}/>
        </div>
    );
}

export default PageSearchResult;