import React, { useEffect, useState } from 'react';
import './FrontPage.css'
import logo from '../../icon.png'

import { DataInterface } from '../Search/SearchResult/Types';
import { getRecentPapers, setRecentPapers } from "../../Utils/Webstorage";
import { SearchBar } from "../Search/SearchBar/SearchBar";
import { SearchResultCard } from '../Search/SearchResult/SearchResultCard';
import Config from '../../Utils/Config'

import { css } from "@emotion/core";
import SyncLoader from "react-spinners/SyncLoader";

/**
 * Frontpage is shown when the user the Web-Application. If exists it shows the recently opened papers
 * @returns the front/Search page
 */
export const FrontPage: React.FC = () => {
    const [recentlyOpenedPapers, setRecentlyOpenedPapers] = useState<Array<DataInterface> | null>([]);
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
            console.log(papers);
            setPaperIds(paperIDs);
            setRecentlyOpenedPapers(papers);
        }).catch(() => {
            console.log("Papers couldn't be loaded");
            setRecentlyOpenedPapers(null);
        });
    }, []);

    const override = css`
        display: block;
        margin: 32vh 0 0 2vw;
        
    `;

    let loaderOrRecentPapers;
    if(recentlyOpenedPapers != null) {
        if(recentlyOpenedPapers.length === 0) {
            loaderOrRecentPapers = <SyncLoader color="#36D7B7" css={override}/>;
        } else {
            
            loaderOrRecentPapers = 
            <>
                <h3>Recently opened papers:</h3>
                {recentlyOpenedPapers?.map((value) => <SearchResultCard dataKey={value.id} key={value.id} data={value} raiseStateSelected={()=>null} highlightCard={() => null}/>)}
            </>;    
        }
    }
    //loaderOrRecentPapers = <SyncLoader color="#36D7B7" css={override}/>;

    return (
        <div className="frontpage">
            <div className="frontpage-content">
                <h1>
                    Welcome to Icteridae!
                </h1>
                <SearchBar/>
                <div className="recent-papers">
                    
                    {loaderOrRecentPapers}
                </div>
            </div>
            <footer className="frontpage-footer">
                <img src={logo} alt="Logo"/> &copy; {new Date().getFullYear()} Icteridae
            </footer>
        </div>
    );
}
