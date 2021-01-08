import React, {useEffect} from 'react';
import './styles/SearchResultList.css';
import SearchResultCard from "./SearchResultCard";

type data = {
    key: number;
    title: string,
    authors: string[],
    date: string,
    citations: number,
    preview: string
}

type ResultListProps = {
    query: string,
    func: Function,
    data: Array<data>
}

const SearchResultList : React.FC<ResultListProps> = (props) => {
    // Effect hook for dynamically changing the height of the resultList and thus getting a scrollbar BECAUSE SCROLLBARS
    useEffect(() => {
        function setListToRemainingHeight() {
            let windowHeight = window.innerHeight;
            // @ts-ignore
            let navbarHeight = document.getElementById("navbar").offsetHeight;
            // @ts-ignore
            let queryTitleHeight = document.getElementById("queryTitle").offsetHeight;
            let list = document.getElementById("list");

            // @ts-ignore
            list.style.height = (windowHeight - navbarHeight - queryTitleHeight) + "px";
        }

        setListToRemainingHeight();
        window.addEventListener('resize', setListToRemainingHeight);

        // Cleanup: Remove EventListener when component will unmount
        return () => {
            window.removeEventListener('resize', setListToRemainingHeight);
        }
    }, []);

    return (
        <div id="list" className="resultList">
            {props.data.map((entry) => {
                return <SearchResultCard func={props.func} key={entry.key} data={entry}/>
            })
            }
        </div>
    );
}

export default SearchResultList;