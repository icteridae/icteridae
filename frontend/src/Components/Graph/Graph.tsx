import * as React from 'react';
import ForceGraph2D, {GraphData, NodeObject, LinkObject} from 'react-force-graph-2d';
import {Button} from "rsuite";

/**
 * This interface characterizes a single Paper
 */
interface paper {
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
    entities : string[]
}

/**
 * This interface describes a similarity
 */
interface similarity{
    /** The Name of the Similarity */
    name: string,

    /** A Description for the Similarity */
    description: string
}

/** 
 * Json structure of the Response from /api/generate_graph/
 */
interface papersAndSimilarities{
    /** Tensor of all similarities for every pair of papers */
    tensor: number[][][],

    /** List of all papers that are relevant for the graph including the requested paper*/
    paper: paper[],

    /** List of all similarities used in this tensor */
    similarities: similarity[]
}

/**
 * TODO: Remove together with +1 Button
 */
const getCategories = () =>{
    let cat = [];
    cat[0] = "author";
    cat[1] = "category";
    cat[2] = "citations";
    return cat;
}

/**
 * This method generates the graph for the provided graphsAndSimilarities Object
 * @param data contains all papers, similarities and similarities between papers
 * @returns a GraphData object consisting of nodes[] and links[]
 */
const genGraph = (data:papersAndSimilarities) =>{
    return ({
            nodes: [({
                id: "0",
                name: "Origin",
                color: "#00FF00",
            })].concat(data.paper.map(id => ({
                id: id.id,
                name: id.title,
                color: "#FF0000"
            }))),
            links: data.paper.map(id => ({
                source: "0",
                target: id.id,
                color: "#FFFFFF"
            }))
        }
    )

}

/**
 * main Method for generating the Graph
 * @returns everything that is displayed under the Graph Tab
 */
export const Graph: React.FC = () => {
    {/**
    ** Reference to the Graph used for TODO: insert Usage
    */}
    const fgRef = React.useRef();
    {/*
    ** useState Hook to save the graphData 
    */}
    const [graph, setGraph] = React.useState<GraphData>({nodes:[], links:[]});
    {/*
    ** EffectHook for the initial Load of the graph
    */}
    React.useEffect(() => {
            loadData();
            const fg:any = fgRef.current;

            fg.d3Force('center', null);
        },[]);
    {/*
    ** loadData fetches the graph_Data from the backend and saves the generated Graph in the State Hook graph
    */}
    const loadData = async () => {
        const response = await fetch("http://127.0.0.1:8000/api/generate_graph/?paper_id=d3ff20bc1a3bb222099ef652c65d494901620908");
        const data = await response.json();
        setGraph(genGraph(data));
    }

    return(
        <div>
            {/**
             * TODO: Delete
             */}
            <Button onClick={() => setGraph(({nodes, links}) : GraphData =>
                {const id = nodes.length;
                    return ({
                        nodes: [...nodes, ({ id: id.toString(), name: id.toString(), color: "#FF0000" } as NodeObject)],
                        links: [...links, ({ source: id.toString(), target: getCategories()[Math.floor(Math.random()*3)], color: "#FFFFFF"} as LinkObject)]
                    });
                })}>+1</Button>
            {/**
             * TODO: Delete
             */}
            <Button onClick={() => setGraph(({nodes, links}) => ({
                nodes: nodes.slice(0,4),
                links: links.slice(0,3)
            }))}>Reset</Button>
            {/**
             * ForceGraph2D renders the actual graph
             * For information on the attributes, pls visit: https://github.com/vasturiano/react-force-graph
             */}
            <ForceGraph2D ref = {fgRef}
                          graphData={graph}
                          onNodeClick={(node, e) => {
                              e.preventDefault();
                              if (node.id === "1") {
                                  window.location.href = 'http://lenny.codes/'
                              } else {
                                  alert(node.id)
                              }
                          }}
                          linkWidth="width"
                          linkCurvature="curvature"
                          linkDirectionalArrowLength="arrowLen"
                          linkDirectionalParticles="dirParticles"
                          d3VelocityDecay={0.04}/>
        </div>
                          )
}
