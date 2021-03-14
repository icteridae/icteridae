import './styles/AuthorSearchResult.sass'
import React, {useEffect, useState} from "react";
import Config from "../../Utils/Config";
import {Paper} from "../../Utils/GeneralTypes";
import {AuthorInterface} from "./AuthorInterface";
import {SearchResultCard} from "../Search/SearchResult/SearchResultCard";
import {AutoComplete, Icon, InputGroup} from "rsuite";
import { useHistory, useParams} from "react-router-dom";
import { AuthorCard } from './AuthorSearch';
import { SearchResultList } from '../Search/SearchResult/SearchResultList';

interface AuthorResultProps {
    text?: string;
    placeholder?: string;
}

export const AuthorSearchResult: React.FC<AuthorResultProps> = (props) => {
    let {id} = useParams<{id: string}>();
    let history = useHistory();

    // Searchbar input
    const [input, setInput] = useState('');
    // Currently displayed author
    const [selectedAuthor, setSelectedAuthor] = useState<AuthorInterface>()
    // Papers depending on selected author
    const [authorPapers, setAuthorPapers] = useState<Paper[]>();
    // Publication count
    const [publications, setPublications] = useState<number>();
    // Related authors
    const [relatedAuthors, setRelatedAuthors] = useState<AuthorInterface[]>([]);
    // Currently selected page
    const [activePage, setActivePage] = useState<number>(1);
    // Maximum pages
    const [maxPages, setMaxPages] = useState<number>(1);


    // Effect hook for setting author and fetching paper data from search API
    useEffect(() => {
        const requestURLAuthor = Config.base_url + '/api/author/?author_id=' + id;

        fetch(requestURLAuthor)
            .then(res => res.json())
            .then(result => setSelectedAuthor(result.data[0])).catch(() => console.log("Can't access " + requestURLAuthor));

        const requestURLAuthorDetails = Config.base_url + '/api/author_details/?author_id=' + id;

        fetch(requestURLAuthorDetails)
            .then(res => res.json())
            .then(results => {
                setRelatedAuthors(results.data);
            }).catch(() => console.log("Can't access " + requestURLAuthorDetails));

    }, [id]);

    useEffect(() => {
        const requestURLAuthorPapers = Config.base_url + '/api/authorpapers/?author_id=' + id + '&page=' + activePage;

        fetch(requestURLAuthorPapers)
            .then(res => res.json())
            .then(result => {
                setAuthorPapers(result.data);
                setMaxPages(result.max_pages);
                setPublications(result.count);
            }).catch(() => console.log("Can't access " + requestURLAuthorPapers));
    }, [activePage])

    const buttonClick = () => {
        history.push(`/authorsearch/${input}`);
    }


    // Display data only if author is selected
    let authorData
    if (selectedAuthor != null) {
        authorData =
            <div className="author-search-result">
                <div className="author-details">
                    <div className="author-name">{selectedAuthor.name}</div>
                    <div className="author-sub">
                        
                        <div className="author-related">
                            <div className="author-pub">
                                {publications} publications</div>
                            <div className='line'/>
                            <div className='author-rel-title'>Related authors</div>
                            <div className='author-rel-cards'>{relatedAuthors.map(author => 
                                <AuthorCard author={author} key={author.id}/>
                            )}</div>
                        </div>
                    </div>
                </div>
                <div className='author-papers-result-list'>
                    
                {authorPapers !== undefined && 
                    <SearchResultList
                        activePage={activePage}
                        raiseStateActivePage={setActivePage}
                        raiseStateSelected={(x) => {}}
                        results={{data: authorPapers, pages: maxPages}}
                    />}

                </div>
                {/* <div className="paper-list">
                    <div className="publications">Publications</div>
                    {
                        (authorPapers != null) && authorPapers.map((entry, index) => (
                            <SearchResultCard highlightCard={() => null} raiseStateSelected={() => null} key={entry.id} dataKey={index.toString()} data={entry}/>
                        ))
                    }
                </div> */}
            </div>;
    }


    return (
        <div className="author-search-result">
            
            {authorData}
        </div>
    )
}