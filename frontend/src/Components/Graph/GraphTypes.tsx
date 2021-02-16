import {GraphData, LinkObject, NodeObject} from 'react-force-graph-2d';

/**
 * This interface characterizes a single Paper
 */
export interface Paper extends NodeObject{
    /** The unique ID of the paper */
    id : string,

    /** The name of the paper */
    title : string,

    /** Abstract */
    paperAbstract : string,

    /** The authors of the paper */
    authors : {name: string, ids : string[]}[],

    /** IDs of all the papers this paper was cited in */
    inCitations : string[],

    /** IDs of all the papers this paper cites */
    outCitations : string[],

    /** The year this paper was published */
    year : number,

    /** Semantic Scholar URL */
    s2Url : string,

    /** Identifies papers sourced from DBLP or Medline */
    sources : string[],

    /** pdf URLs */
    pdfUrls : string[],

    /** Extracted publication venue for this paper, TODO: Edit */
    venue : string,

    /** Name of the journal that published this paper */
    journalName : string,

    /** The volume of the journal where this paper was published */
    journalVolume : string,

    /** The pages of the journal where this paper was published */
    journalPages : string,

    /** Digital object identifier */
    doi : string,

    /** Digital object identifier URL */
    doiUrl : string,

    /** Unique identifiers used by PubMed */
    pmid : string,

    /** Fields of study */
    fieldsOfStudy : string[],

    /** Unique identifiers used by Microsoft Academic Graph */
    magId : string,

    /** Semantic Scholar PDF URL */
    s2PdfUrl : string,

    /** Extracted entities (deprecated on 2019-09-17) */
    entities : string[],

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
    paper: Paper[],

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