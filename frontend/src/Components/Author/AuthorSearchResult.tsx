import './AuthorSearchResult.css'
import '../Search/SearchBar/SearchBar.css'
import React, {useEffect, useState} from "react";
import Config from "../../Utils/Config";
import {DataInterface} from "../Search/SearchResult/Types";
import {AuthorInterface} from "./AuthorInterface";
import {SearchResultCard} from "../Search/SearchResult/SearchResultCard";
import {AutoComplete, Icon, InputGroup} from "rsuite";
import {useParams} from "react-router-dom";

interface AuthorResultProps {
    text?: string;
    placeholder?: string;
}

export const AuthorSearchResult: React.FC<AuthorResultProps> = (props) => {
    let {id} = useParams<{id: string}>();

    // Searchbar input
    const [input, setInput] = useState('');
    // Searchbar autocomplete data
    const [authorAutocompleteList, setAuthorAutocompleteList] = useState<AuthorInterface[]>();
    // Currently displayed author
    const [selectedAuthor, setSelectedAuthor] = useState<AuthorInterface>()
    // Papers depending on selected author
    const [authorPapers, setAuthorPapers] = useState<DataInterface[]>();


    // Effect hook for fetching author list from search API
    useEffect(() => {
        let requestURL = Config.base_url + '/api/search_author/?query=' + input;

        fetch(requestURL)
            .then(res => res.json())
            .then(result => setAuthorAutocompleteList(result.data)).catch(() => console.log("Can't access " + requestURL));
    }, [input]);

    // Effect hook for setting author and fetching paper data from search API
    useEffect(() => {
        let requestURLAuthor = Config.base_url + '/api/author/?author_id=' + id;

        fetch(requestURLAuthor)
            .then(res => res.json())
            .then(result => setSelectedAuthor(result.data[0])).catch(() => console.log("Can't access " + requestURLAuthor));

        let requestURLAuthorPapers = Config.base_url + '/api/authorpapers/?author_id=' + id;

        fetch(requestURLAuthorPapers)
            .then(res => res.json())
            .then(result => setAuthorPapers(result.data)).catch(() => console.log("Can't access " + requestURLAuthorPapers));
    }, [id]);


    // Display data only if author is selected
    let authorData
    if (selectedAuthor != null) {
        authorData =
            <div className="author-search-result">
                <div className="author-details">
                    <div className="author-name">{selectedAuthor.name}</div>
                    <div><b>Publications: </b>{authorPapers != null && authorPapers.length}</div>
                </div>
                <div className="paper-list">
                    <div className="publications">Publications</div>
                    {
                        (authorPapers != null) && authorPapers.map((entry, index) => {
                            return <SearchResultCard highlightCard={() => null} raiseStateSelected={() => null} key={entry.id} dataKey={index} data={entry}/>
                        })
                    }
                </div>
            </div>;
    }


    return (
        <div className="wrapper">
            <div className="search-bar">
                {props.text? <><div className='text'>{props.text} </div> <br /></> : null}
                <form>
                    <InputGroup id="search-bar-group">
                        <AutoComplete placeholder={props.placeholder} data={authorAutocompleteList?.map((author) => {return {label: author.name, value: author.id}})} value={input} onChange={(e) => setInput(e)} onSelect={(e) => window.location.href=`/author/${e.value}`}/>
                        <InputGroup.Button type="submit" onClick={() => window.location.href = '/author/' + selectedAuthor?.id}>
                            <Icon icon="search" />
                        </InputGroup.Button>
                    </InputGroup>
                </form>
            </div>
            {authorData}
        </div>
    )
}