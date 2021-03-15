import React from 'react';
import { Link, useHistory } from 'react-router-dom';

import { Drawer, Button } from 'rsuite';

import { Bookmark } from '../General/Bookmark';
import { PaperNode } from './GraphTypes';

import './Graph.sass'

interface GraphDisplayDrawerTypes {
    paperDrawer : boolean,
    selectedNode : PaperNode,
    maxAuthors : number,
    setPaperDrawer : (value: React.SetStateAction<boolean>) => void,
}

export const GraphDisplayDrawer: React.FC<GraphDisplayDrawerTypes> = (props) => {
    let history = useHistory();
    
    return (
        <Drawer
            show={props.paperDrawer}
            backdrop={false}
            onHide={() => {props.setPaperDrawer(false);}}
        >
            <Drawer.Header>
                <Drawer.Title>
                    <Bookmark paper_id={props.selectedNode.id}/>{props.selectedNode.title}
                </Drawer.Title>
            </Drawer.Header>
            <Drawer.Body>
                <div style={{paddingBottom: '1em'}}>
                    <Button appearance='ghost' style={{marginRight: '1em'}} href={props.selectedNode.s2Url} target='_blank'>
                        Open in Semantic Scholar
                    </Button>
                    <Button appearance='ghost' style={{marginRight: '1em'}} onClick={() => {history.push(`/graph/${props.selectedNode.id}`)}}>
                        Generate Graph
                    </Button>
                </div>
                <p style={{color:'grey'}}>{props.selectedNode.year + ', '}{props.selectedNode.authors.length <= props.maxAuthors + 1 ? props.selectedNode.authors.map<React.ReactNode>(obj => (<Link to={`/author/${obj.id}`}>{obj.name}</Link>)).reduce((prev, curr) => [prev, ', ', curr]) : <>{props.selectedNode.authors.slice(0, props.maxAuthors).map<React.ReactNode>(obj => (<Link to={`/author/${obj.id}`}>{obj.name}</Link>)).reduce((prev, curr) => [prev, ', ', curr])}, + {props.selectedNode.authors.length - props.maxAuthors} others</>}
                    {props.selectedNode.doi !== '' && (props.selectedNode.doiUrl !== '' ? (<><br/>Doi: <a href={props.selectedNode.doiUrl}>{props.selectedNode.doi}</a></>) : (<><br/>Doi: {props.selectedNode.doi}</>))}
                    
                    <br/> Citations: {props.selectedNode.inCitations.length}, References: {props.selectedNode.outCitations.length}
                    {props.selectedNode.venue !== '' && <><br/> Venue: {props.selectedNode.venue}</>}
                    <br/><p style={{color:props.selectedNode.color}}>Field: {props.selectedNode.fieldsOfStudy.map(field => field).join(', ')} </p>
                    
                    </p>
                <p>{props.selectedNode.paperAbstract}</p>
            </Drawer.Body>
        </Drawer>
    )
}