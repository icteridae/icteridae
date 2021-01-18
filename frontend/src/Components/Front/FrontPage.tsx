import React, {useEffect, useState} from 'react';
import {SearchBar} from "../Search/SearchBar/SearchBar";
import {getRecentPapers, setRecentPapers} from "../../Utils/Webstorage";
import Config from '../../Utils/Config'

import './FrontPage.css'
import logo from '../../icon.png'
import SearchResultCard from '../Search/SearchResult/SearchResultCard';
import DataInterface from '../Search/SearchResult/Types';
/**
 * Frontpage is shown when the user the Web-Application. If exists it shows the recently opened papers
 * @returns the front/Search page
 */
export const FrontPage: React.FC = () => {
    const [recentlyOpenedPapers, setRecentlyOpenedPapers] = useState<Array<DataInterface>>([]);
    const [paperIds, setPaperIds] = useState<Array<string>>(getRecentPapers());

    /**
     * Initial effect hook for loading the recently open papers from the localstorage.
     * The loaded ids are send to the backend which returns the metadata from the papers
     */
    useEffect(() => {
        const baseURL : string = Config.base_url;
        const paperIDs = getRecentPapers();
        
        //capped at 10 papers max, if paperIds == null, zero papers will be loaded
        const numberOfPapers : number = (paperIDs == null) ? 0 : Math.min(paperIds.length, 10);
        let papers: Array<DataInterface> = new Array<DataInterface>(numberOfPapers);
        
        // fetch all papers
        let promises = [];
        for (let i = numberOfPapers-1; i > -1; i--) {
            promises.push(fetch(baseURL +"/api/paper/?paper_id=" + paperIDs[i])
                .then(res => res.json())
                .then(res => {
                    papers[i] = {...res, link: "/graph"};
                })
            )
        }
        
        // set paperIds and recentlyOpenedPapers once all promises succeed
        Promise.all(promises).then(() => {
            setPaperIds(paperIDs)
            setRecentlyOpenedPapers(papers);
        });
    }, []);

    /**
     * Temporary function for storing paper_ids
     */
    function overwriteRecentPapers() {
        let testData : Array<string> = ["7303cff26e66f6abcbf65620198f2d368e5d18f1",
            "5d31c8fe61c6210c26b496ed80d8ed2e57967370",
            "a005c55622ab40e0b596c7174b28e3f0738804e7",
            "e9faa7906e35846bfdb78ff813de2e7bc8d3a309"];
        setPaperIds(testData);
        setRecentPapers(testData);
    }

    return (
        <div className="frontpage">
            <div className="frontpage-content">
                <h1>
                    Welcome to Icteridae!
                </h1>
                <SearchBar/>
                {(recentlyOpenedPapers) &&
                    <div className="recent-papers">
                        <h5>Recently opened Papers:</h5>
                        {recentlyOpenedPapers?.map((value, index) => <SearchResultCard dataKey={value.id} key={value.id} data={value} func={()=>null} highlightCard={() => null}/>)}
                    </div>
                }
            </div>
            <footer className="frontpage-footer">
                <img src={logo} alt="Logo"/> &copy; 2021 Icteridae
            </footer>
        </div>
    );
}
