import {GraphData, LinkObject, NodeObject} from 'react-force-graph-2d';

import { Paper } from './../../Utils/GeneralTypes'

/**
 * This interface characterizes a single Paper
 */
export interface PaperNode extends NodeObject, Paper {
    
    /** id of the paper. Needed as both NodeObject and Paper have an id type */
    id: string,

    /** The color of the node */
    color?: string,

    /** Boolean if the node is hovered */
    isHovered?: boolean,
}

/**
 * This interface adds the similarity attribute to LinkObjects. Is only used if we include our own Link Force
 */
export interface SimilarityLinkObject extends LinkObject{
    similarity: number[],
    label: string,
    color: string,
    isHovered: boolean,
}

/**
 * This interface adjust the nodes and links of the graph to contain enough information
 */
export interface PaperGraphData extends GraphData{
    nodes: Paper[],
    links: SimilarityLinkObject[],
}