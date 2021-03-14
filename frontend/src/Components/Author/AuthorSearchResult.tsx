import './styles/AuthorSearchResult.sass'
import React, {useEffect, useState} from "react";
import Config from "../../Utils/Config";
import {ApiAuthorPapersResult, ApiAuthorRelevantResult, ApiAuthorResult, Author, Paper} from "../../Utils/GeneralTypes";
import { useParams} from "react-router-dom";
import { AuthorCard } from './AuthorSearch';
import { SearchResultList } from '../Search/SearchResult/SearchResultList';


export const AuthorSearchResult: React.FC = () => {
    const {id} = useParams<{id: string}>();

    // Currently displayed author
    const [selectedAuthor, setSelectedAuthor] = useState<Author>()
    // Papers depending on selected author
    const [authorPapers, setAuthorPapers] = useState<Paper[]>();
    // Publication count
    const [publications, setPublications] = useState<number>();
    // Related authors
    const [relatedAuthors, setRelatedAuthors] = useState<Author[]>([]);
    // Currently selected page
    const [activePage, setActivePage] = useState<number>(1);
    // Maximum pages
    const [maxPages, setMaxPages] = useState<number>(1);


    // Effect hook for setting author and fetching paper data from search API
    useEffect(() => {
        const requestURLAuthor = Config.base_url + '/api/author/name/?author_id=' + id;

        fetch(requestURLAuthor)
            .then(res => res.json())
            .then((result: ApiAuthorResult) => setSelectedAuthor(result)).catch(() => console.log("Can't access " + requestURLAuthor));

        const requestURLAuthorRelated = Config.base_url + '/api/author/related/?author_id=' + id;

        fetch(requestURLAuthorRelated)
            .then(res => res.json())
            .then((results: ApiAuthorRelevantResult) => {
                setRelatedAuthors(results.data);
            }).catch(() => console.log("Can't access " + requestURLAuthorRelated));

    }, [id]);

    // Effect hook only for reloading papers when pagination element is interacted with
    useEffect(() => {
        const requestURLAuthorPapers = Config.base_url + '/api/author/papers/?author_id=' + id + '&page=' + activePage;

        fetch(requestURLAuthorPapers)
            .then(res => res.json())
            .then((result: ApiAuthorPapersResult) => {
                setAuthorPapers(result.data);
                setMaxPages(result.max_pages);
                setPublications(result.count);
            }).catch(() => console.log("Can't access " + requestURLAuthorPapers));

    }, [activePage, id])


    return (
        <div className="author-search-result">
            
            {selectedAuthor !== undefined && 
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
                </div>
            }
        </div>
    )
}