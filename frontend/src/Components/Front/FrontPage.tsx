import React, { useEffect, useState } from 'react';
import './FrontPage.scss'
import logo from '../../icon.png'

import { DataInterface } from '../Search/SearchResult/Types';
import { getRecentPapers} from "../../Utils/Webstorage";
import { SearchBar } from "../Search/SearchBar/SearchBar";
import { SearchResultCard } from '../Search/SearchResult/SearchResultCard';
import Config from '../../Utils/Config'

import { css } from "@emotion/core";
import SyncLoader from "react-spinners/SyncLoader";
import { Paper } from '../../Utils/GeneralTypes';

/**
 * Frontpage is shown when the user the Web-Application. If exists it shows the recently opened papers
 * @returns the front/Search page
 */
export const FrontPage: React.FC = () => {
    const [recentlyOpenedPapers, setRecentlyOpenedPapers] = useState<Array<Paper> | null>([]);
    const [recentPaperIds, setPaperIds] = useState<Array<string>>(getRecentPapers());

    /**
     * Initial effect hook for loading the recently open papers from the localstorage.
     * The loaded ids are send to the backend which returns the metadata from the papers
     */
    useEffect(() => {
        const baseURL : string = Config.base_url;
        const paperIds = getRecentPapers();

        //if there are no papers to fetch, set recentlyOpenedPapers to null to stop the loading animation
        if(paperIds == null) {
            setRecentlyOpenedPapers(null);
            return;
        }
        
        //capped at 10 papers max
        const numberOfPapers : number = Math.min(recentPaperIds.length, 10);
        let papers: Array<Paper> = new Array<Paper>(numberOfPapers);
        
        // fetch all papers
        let promises = [];
        for (let i = numberOfPapers-1; i > -1; i--) {
            promises.push(fetch(baseURL +"/api/paper/?paper_id=" + paperIds[i])
                .then(res => res.json())
                .then(res => {
                    papers[i] = {...res, link: "/graph"};
                })
            )
        }
        
        // set paperIds and recentlyOpenedPapers once all promises succeed
        Promise.all(promises).then(() => {
            console.log(papers);
            setPaperIds(paperIds);
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

    console.log(recentlyOpenedPapers);
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
        </div>
    );
}
