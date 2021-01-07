import React from "react";
import {Panel} from "rsuite";
import {Link} from 'react-router-dom';

import './Card.css';

interface CardProps {
    title: string;
    year: string;
    author: string;
    link: string;
}


export const Card: React.FC<CardProps> = (props) => (
    <div className={"Card"}>
        <Link to={props.link}>
            <div>
                <Panel {...props} bordered header={props.title}>
                    <p>{props.year}<br/>{props.author}</p>
                </Panel>
            </div>
        </Link>
    </div>
)