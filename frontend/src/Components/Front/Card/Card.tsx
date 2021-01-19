import React from "react";
import {Panel} from "rsuite";
import {Link} from 'react-router-dom';

import './Card.css';

/**
 * This Interface represents a subset of the metadata. This subset is shown in the recent paper cards
 */
export interface CardProps {
    key: string,
    title: string;
    year: string;
    authors: Array<{id: string, name: string}>;
    link: string;
}

/**
 * Represent a recent paper Card which shows basic information of a paper
 * @param props are the properties of the card specified by the CardProps
 * @returns a card with a link to the given paper
 */
export const Card: React.FC<CardProps> = (props) => (
    <div className={"Card"}>
        <Link to={props.link}>
            <div>
                <Panel {...props} bordered header={props.title}>
                    <p>{props.year}<br/>
                        {props.authors.map((value, index) => {return <><br />{value.name}</> })}
                    </p>
                </Panel>
            </div>
        </Link>
    </div>
)