import React, {useState} from 'react';
import {SearchBar} from "../Search/SearchBar/SearchBar";
import {Card, CardProps} from "./Card/Card";
import './FrontPage.css'
import logo from '../../icon.png'


export const FrontPage: React.FC = () => {
    const [RecentPaper, SetRecentPaper] = useState<CardProps>();

    return (
    <div className="FrontPage">
        <header className="Header">
            Welcome to Icteridae!
        </header>
        <body className="Body">
        <div className="Searching">
            <SearchBar placeholder="Search for your Papers!"/>
        </div>

        <div className="Suggestions">
            <u><div className="Title">Recently opened Papers:</div></u>
            <Card title={"Attention is all you need"} year={"2017"} authors={["Dennis Hoebelt", "Lennart Mischnaewski", "Nico Kunz", "Alexander Sinkovic", "Leon Petri"]} link={'/papers/'} />
            <Card
                title={"Was du heute kannst besorgen, das verschiebe stets auf Morgen und Außerdem ist Attention all you need, right? "}
                year={"1929"} authors={["So nen Typ"]} link={'/graph/'} />
            <Card title={"das verschiebe stets auf Morgen"} year={"1930"} authors={["so nen Typ"]}
                  link={'/privacy/'} />
            <Card title={"Attention is all you need"} year={"2017"} authors={["Dennis Hoebelt"]}
                  link={'/papers/'} />
            <Card title={"Was du heute kannst besorgen"} year={"1929"} authors={["So nen Typ"]} link={'/graph/'} />
            <Card title={"das verschiebe stets auf Morgen"} year={"1930"} authors={["so nen Typ"]}
                  link={'/privacy/'} />
            <Card title={"Attention is all you need"} year={"2017"} authors={["Dennis Hoebelt"]}
                  link={'/papers/'} />
        </div>
        </body>
        <footer className="Imprint">
            <img src={logo} alt="Logo"/> &copy; 2021 Icteridae
        </footer>
    </div>
    );
}

