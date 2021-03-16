import React from 'react';

import { ApiGraphResult } from '../../Utils/GeneralTypes'
import { hexToRGB, hash } from './GraphHelperfunctions'

import './Graph.sass'

export const Legend: React.FC<{'data' : ApiGraphResult, 'defaultFieldOfStudy' : string, 'pallette' :  [string, string[]], 'leastCitations' : number, 'mostCitations' : number, 'paperOppacityYearRange' : number}> = (props) => {
    return (
        <div className='legend'>
            <div className='legend-description'>
                <span className='legend-description-child2'>Fields of Study</span>
            </div>
            {Array.from(new Set(props.data.paper.map((paper) => paper.fieldsOfStudy.slice().sort().join(', ')))).map((field, index) =>(
                <div key={index} className='legend-fieldsofstudy' style={{color: 'lightgray', backgroundColor: (field === props.defaultFieldOfStudy) ? ('rgba(231, 156, 69, 0.6)') : (hexToRGB(props.pallette[1][hash(field) % props.pallette[1].length], '0.6'))}}>{field}</div>
            ))}
            <div className='legend-description'>
                <span className='legend-description-child1'>Unsaved</span>
                <span className='legend-description-child2'>Paper</span>
                <span className='legend-description-child3'>Saved</span>
            </div>
            <div className='legend-saved-paper-container'>
                <div className='legend-unsaved-paper-color-bar'></div>
                <div className='legend-saved-paper-color-bar'></div>
            </div>
            <div className='legend-description'>
                <span className='legend-description-child1'>Low</span>
                <span className='legend-description-child2'>Link Similarity</span>
                <span className='legend-description-child3'>High</span>
            </div>
            <div className='legend-link-width-container'>
                <div className='legend-link-width'></div>
            </div>
            <div className='legend-description'>
                <span className='legend-description-child1'>{props.leastCitations}</span>
                <span className='legend-description-child2'>Citations</span>
                <span className='legend-description-child3'>{props.mostCitations}</span>
            </div>
            <div className='legend-circles'>
                <div className='circle--1'></div>
                <div className='circle--2'></div>
                <div className='circle--3'></div>
                <div className='circle--4'></div>
                <div className='circle--5'></div>
            </div>
            <div className='legend-description'>
                <span className='legend-description-child1'>{new Date().getFullYear() - props.paperOppacityYearRange}</span>
                <span className='legend-description-child2'>Year</span>
                <span className='legend-description-child3'>{new Date().getFullYear()}</span>
            </div>
            <div className='legend-year-color-bar'></div>
        </div>
    )
}