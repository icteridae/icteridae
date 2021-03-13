import React from 'react';

export const Authors : React.FC<{authors: {name: string, id: string}[], maxAuthors: number}> = (props) => {
    return(
        <span className="authors">
            {
                // display a maximum of maxAuthors, if number of authors is higher than maxAuthors display how many other authors contributed
                props.authors
                    .slice(0, props.maxAuthors)
                    .map(author => author.name)
                    .join(', ') + 
                        ((props.authors.length > props.maxAuthors) ? `, + ${props.authors.length - props.maxAuthors} others` : "")
            }
        </span>
    );
}