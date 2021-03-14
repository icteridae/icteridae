import React, { useEffect, useState } from 'react';
import './FrontPage.sass'
import logo from '../../icon.png'

import { getRecentPapers} from "../../Utils/Webstorage";
import { SearchBar } from "../Search/SearchBar/SearchBar";
import { SearchResultCard } from '../Search/SearchResult/SearchResultCard';
import Config from '../../Utils/Config'

import { Paper } from '../../Utils/GeneralTypes';

import { Alert, Button, Divider, Footer } from 'rsuite';
import { PulseLoader } from 'react-spinners';


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
        const paperIds = getRecentPapers();

        //if there are no papers to fetch, set recentlyOpenedPapers to null to stop the loading animation
        if(paperIds == null) {
            setRecentlyOpenedPapers(null);
            return;
        } 
        
        fetch(Config.base_url + '/api/paper_bulk/',
            {
                method: 'POST',
                body: JSON.stringify({paper_ids: recentPaperIds.slice(0, 10)})
            })
            .then(res => res.json())
            .then(res => {
                setPaperIds(res.map((e: Paper) => e.id));
                setRecentlyOpenedPapers(res);
            }).catch(() => {
                console.log("Papers couldn't be loaded");
                setRecentlyOpenedPapers(null)
            })

    // dependencies have to be non-exhaustive here
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div className="frontpage">
            <div className="frontpage-content">
                <div className='full-view'>
                    <h1>
                        Icteridae
                    </h1>
                    <div className='line'/>
                    <SearchBar placeholder='Begin exploring research...'/>
                </div>
                <div id='recent-papers-superscript'>scroll to see recent papers</div>
                <Divider/>
                <div>  
                    {recentlyOpenedPapers !== null && 
                        (recentlyOpenedPapers.length === 0 ? 
                            <div className="spinner"><PulseLoader/></div> 
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
            <Footer className='footer'>
                <img src={logo} alt="Logo"/> &copy; {new Date().getFullYear()} Icteridae
                <Button className='impressum' onClick={() => Alert.info('There is no impressum yet', 5000)} appearance='link'>Impressum</Button>
            </Footer>
        </div>
    );
}
