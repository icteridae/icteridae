import React, {useEffect, useState} from 'react';
import {SearchBar} from "../Search/SearchBar/SearchBar";
import {Card, CardProps} from "./Card/Card";
import './FrontPage.css'
import logo from '../../icon.png'
import {getRecentPapers, setRecentPapers} from "../../Utils/Webstorage";



export const FrontPage: React.FC = () => {
    const [RecentPaper, SetRecentPaper] = useState<Array<CardProps>>();
    const [PaperIds, SetPaperIds] = useState<Array<string>>(getRecentPapers());
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

    function OverweriteRecentPapers() {
        let testData : Array<string> = ["fffff7a0aeb935156d1ab28746b271cb1113f364",
            "ffffcd18f22c6a876e361f1eb8283d7a0f6bf74d",
            "ffffc95b7b1e4face20fdc6b1783c46a99681f50",
            "ffffc7ff61c975683e76530d3aec53f2a0443b7e",
            "ffffaad09a2adfde45e259af41dd3e4eab941541",
            "ffff9fbc334a7c05e0d6f0c2b169aa03c822dfe0",
            "ffff9c6a01a1ee28c7be84debd99478261503c45",
            "ffff911f5d5705f9152de1f7701c7c9174f7d552",
            "ffff8a102dd06527f0fed80a7df7b4333595ba90",
            "ffff7933cdb5fe0e75579cd9fad08b6dbe8b56d6"];
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
        <button onClick={() => OverweriteRecentPapers()}>Ich bin nen Knopf </button>
        {(RecentPaper) &&
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

