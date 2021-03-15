import React from 'react';

import { Link } from 'react-router-dom';

export const Authors : React.FC<{authors: {name: string, id: string}[], maxAuthors: number}> = (props) => {
    return(
        <span className="authors">
            {
                // display a maximum of maxAuthors, if number of authors is higher than maxAuthors display how many other authors contributed
                props.authors
                    .slice(0, props.maxAuthors)
                    .map<React.ReactNode>(author => (<Link to={`/author/${author.id}`} key={author.id}>{author.name}</Link>))
                    .reduce((prev, curr) => [prev, ', ', curr])
            }
            {((props.authors.length > props.maxAuthors) ? `, + ${props.authors.length - props.maxAuthors} others` : "")}
        </span>
    );
}