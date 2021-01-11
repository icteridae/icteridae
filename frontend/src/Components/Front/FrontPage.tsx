import React, {useState} from 'react';
import {SearchBar} from "../Search/SearchBar/SearchBar";
import {Card, CardProps} from "./Card/Card";
import './FrontPage.css'
import logo from '../../icon.png'
import {getRecentPapers, setRecentPapers} from "../../Utils/Webstorage";



export const FrontPage: React.FC = () => {
    const [RecentPaper, SetRecentPaper] = useState<Array<CardProps>>();
    const [PaperIds, SetPaperIds] = useState<Array<string>>(getRecentPapers());
    React.useEffect(() => getPapersById() ,[]);

    function getPapersById() {
        const max : number = (PaperIds?.length>10 ? 10 : PaperIds?.length);
        let papers: Array<CardProps> = new Array<CardProps>(max);
        for (let i= max-1; i>-1; i--) {
            //TO-DO: API query for the paper ids
            let pap : CardProps = {title:"Test", year:"2020", authors:["Dennis Hoebelt", "Lenny"], link:"/graph/"};
            papers[i] = pap;
        }
        SetRecentPaper(papers);
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

