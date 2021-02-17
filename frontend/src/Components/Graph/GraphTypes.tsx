import {GraphData, LinkObject, NodeObject} from 'react-force-graph-2d';

import { Paper } from './../../Utils/GeneralTypes'

/**
 * This interface characterizes a single Paper
 */
export interface PaperNode extends NodeObject, Paper {
    
    /** id of the paper. Needed as both NodeObject and Paper have an id type */
    id: string,

    /** The color of the node */
    color: string,

    /** Paper Similarity to selected Paper/Graph Origin */
    originSim: number,
}

/**
 * This interface describes a similarity
 */
export interface Similarity{
    /** The Name of the Similarity */
    name: string,

    /** A Description for the Similarity */
    description: string,
}

/**
 * Json structure of the Response from /api/generate_graph/
 */
export interface PapersAndSimilarities{
    /** Tensor of all similarities for every pair of papers */
    tensor: number[][][],

    /** List of all papers that are relevant for the graph including the requested paper*/
    paper: PaperNode[],

    /** List of all similarities used in this tensor */
    similarities: Similarity[]
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