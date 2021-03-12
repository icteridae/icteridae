import React, { useEffect, useState } from 'react';
import './FrontPage.sass'
import logo from '../../icon.png'

import { DataInterface } from '../Search/SearchResult/Types';
import { getRecentPapers} from "../../Utils/Webstorage";
import { SearchBar } from "../Search/SearchBar/SearchBar";
import { SearchResultCard } from '../Search/SearchResult/SearchResultCard';
import Config from '../../Utils/Config'

import SyncLoader from "react-spinners/SyncLoader";

/**
 * Frontpage is shown when the user the Web-Application. If exists it shows the recently opened papers
 * @returns the front/Search page
 */
export const FrontPage: React.FC = () => {
    const [recentlyOpenedPapers, setRecentlyOpenedPapers] = useState<Array<DataInterface> | null>([]);
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
        let papers: Array<DataInterface> = new Array<DataInterface>(Math.min(recentPaperIds.length, 10));
        
        // fetch all papers
        const promises = recentPaperIds.map((id, i) => fetch(baseURL +"/api/paper/?paper_id=" + id)
            .then(res => res.json())
            .then(res => {
                papers[i] = res;
            }))
        
        // set paperIds and recentlyOpenedPapers once all promises succeed
        Promise.all(promises).then(() => {
            setPaperIds(paperIds);
            setRecentlyOpenedPapers(papers);
        }).catch(() => {
            console.log("Papers couldn't be loaded");
            setRecentlyOpenedPapers(null);
        });
    }, []);

    return (
        <div className="frontpage">
            <div className="frontpage-content">
                <h1>
                    Welcome to Icteridae!
                </h1>
                <SearchBar/>
                <div>  
                    {recentlyOpenedPapers !== null && 
                        (recentlyOpenedPapers.length === 0 ? 
                            <div className="sync-loader">
                                <SyncLoader/> 
                            </div>
                        : 
                            (<>
                                <div className="recent-papers">
                                    <h3>Recently opened papers:</h3>
                                    {
                                    recentlyOpenedPapers.map(
                                        (value) => <SearchResultCard 
                                            dataKey={value.id} 
                                            key={value.id} 
                                            data={value} 
                                            raiseStateSelected={()=>null} 
                                            highlightCard={() => null}/>)
                                        }
                                </div>
                            </>)
                        )
                    }
                </div>
            </div>
        </div>
    );
}
