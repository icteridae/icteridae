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

    const [authorPapers, setAuthorsPapers] = useState<DataInterface[]>();
    const [authorList, setAuthorList] = useState<AuthorInterface[]>();
    const [selectedAuthor, setSelectedAuthor] = useState<AuthorInterface>()
    const [input, setInput] = useState('');


    // Effect hook for fetching author list from search API
    useEffect(() => {
        let requestURL = Config.base_url + '/api/search_author/?query=' + input;
        //requestURL = 'http://192.168.0.174:8000/api/search_author/?query=josep m su'

        fetch(requestURL)
            .then(res => res.json())
            .then(result => setAuthorList(result.data)).catch(() => console.log("Can't access " + requestURL));
    }, [input]);

    // Effect hook for setting author and fetching paper data from search API
    useEffect(() => {
        let requestURLAuthor = Config.base_url + '/api/author/?author_id=' + id;

        fetch(requestURLAuthor)
            .then(res => res.json())
            .then(result => setSelectedAuthor(result.data)).catch(() => console.log("Can't access " + requestURLAuthor));

        let requestURLAuthorPapers = Config.base_url + '/api/paper/?author_id=' + id;

        fetch(requestURLAuthorPapers)
            .then(res => res.json())
            .then(result => setAuthorsPapers(result.data)).catch(() => console.log("Can't access " + requestURLAuthorPapers));
    }, [id]);

    return (

        <div className="wrapper">
            <div className="search-bar">
                {props.text? <><div className='text'>{props.text} </div> <br /></> : null}
                <form>
                    <InputGroup id="search-bar-group">
                        <AutoComplete placeholder={props.placeholder} data={authorList?.map((author) => author.name)} value={input} onChange={(e) => setInput(e)}/>
                        <InputGroup.Button type="submit" onClick={() => window.location.href = '/author/' + selectedAuthor?.id}>
                            <Icon icon="search" />
                        </InputGroup.Button>
                    </InputGroup>
                </form>
            </div>
            <div className="author-search-result">
                <div className="author-details">
                    <div className="author-name">{selectedAuthor != null && selectedAuthor.name}</div>
                    <div><b>Publications: </b>{authorPapers != null && authorPapers.length}</div>
                    <div><b>Citations:</b> TODO</div>
                </div>
                <div className="paper-list">
                    <div className="publications">Publications</div>
                    {
                        (authorPapers != null) && authorPapers.map((entry, index) => {
                            return <SearchResultCard highlightCard={() => null} raiseStateSelected={() => null} key={entry.id} dataKey={index} data={entry}/>
                        })
                    }
                </div>
            </div>
        </div>
    )
}