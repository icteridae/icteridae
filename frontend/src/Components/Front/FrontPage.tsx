import React, {useEffect, useState} from 'react';
import {SearchBar} from "../Search/SearchBar/SearchBar";
import {Card, CardProps} from "./Card/Card";
import './FrontPage.css'
import logo from '../../icon.png'
import {getRecentPapers, setRecentPapers} from "../../Utils/Webstorage";

/**
 * Frontpage is shown when the user the Web-Application. If exists it shows the recently opened papers
 * @returns the front/Search page
 */
export const FrontPage: React.FC = () => {

    const [RecentPaper, SetRecentPaper] = useState<Array<CardProps>>();
    const [PaperIds, SetPaperIds] = useState<Array<string>>(getRecentPapers());

    /**
     * Initial effect hook for loading the recently open papers from the localstorage.
     * The loaded ids are send to the backend which returns the metadata from the papers
     */
    React.useEffect(() =>{
        let BaseRequestURL = 'http://127.0.0.1:8000/api/paper/?paper_id='
        const max : number = (PaperIds?.length>10 ? 10 : PaperIds?.length);
        let papers: Array<CardProps> = new Array<CardProps>(max);
        for (let i= max-1; i>-1; i--) {
            fetch(BaseRequestURL + PaperIds[i])
                .then(res => res.json())
                .then(res => {
                    let t = JSON.parse(res.getItem("title")) as string;
                    let y = JSON.parse(res.getItem("year")) as string;
                    let a = JSON.parse(res.getItem("authors")) as Array<string>;
                    let pap : CardProps = {title: t, year:y, authors: a, link:'/graph/'};
                    papers[i] = pap;
                })
        }
        SetRecentPaper(papers);

    } ,[]);

    /**
     * Temporary function for storing paper_ids
     */
    function OverweriteRecentPapers() {
        let testData : Array<string> = ["6f0cde1483ec8317021e67bef2d07d99f3f6af62",
            "a18a66068cf4f6db749293db0aba21a852b0aa56",
            "fa9ad2f5d6fbc88815eb01ee7136cad0a599709a",
            "1d1825e95afae6bdfad17a34d267bf3b09d52195",
            "9801a956fba18683644cd26d9a4b83d6006f7937"];
        SetPaperIds(testData);
        setRecentPapers(testData);
    }

    return (
       <div className="FrontPage">
        <header className="Header">
            Welcome to Icteridae!
        </header>
        <body className="Body">
        <div className="Searching">
            <SearchBar placeholder="Search for your Papers!"/>
        </div>
        {/* Temprorary Button for the temp function*/}
        <button onClick={() => OverweriteRecentPapers()}>Ich bin nen Knopf </button>
        {/* If there couldn't be loaded any recent paper or there aren't recent Paper the Suggestion class is not rendered*/}
        {(RecentPaper && RecentPaper[0]) &&
        <div className="Suggestions">
            <u>
                <div className="Title">Recently opened Papers:</div>
            </u>
            {RecentPaper?.map((value, index) => {
                return <Card title={value.title} year={value.year} authors={value.authors} link={'/graph'}/>
            })}
        </div>
        }
        </body>
        <footer className="Imprint">
            <img src={logo} alt="Logo"/> &copy; 2021 Icteridae
        </footer>
    </div>
    );
}

