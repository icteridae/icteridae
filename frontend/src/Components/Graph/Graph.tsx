import * as React from 'react';
import ForceGraph2D, {GraphData, LinkObject, NodeObject} from 'react-force-graph-2d';
import {Button, Drawer, Row, Col, Slider, InputNumber} from "rsuite";
import Config from '../../Utils/Config';
import './Graph.css'

/**
 * This interface characterizes a single Paper
 */
interface paper extends NodeObject{
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
    color: string
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
 * This interface adds the similarity attribute to LinkObjects. Is only used if we include our own Link Force
 */
interface myLinkObject extends LinkObject{
    similarity: number[],
    label: string,
}

/**
 * This interface adjust the nodes and links of the graph to contain enough information
 */
interface myGraphData extends GraphData{
    nodes: paper[],
    links: myLinkObject[],
}

// Variable used to identify the ID of the selected Paper
let selectedPaper = "0";

/**
 * This method generates the graph for the provided graphsAndSimilarities Object
 * @param data contains all papers, similarities and similarities between papers
 * @returns a GraphData object consisting of nodes[] and links[]
 */
const genGraph = (data:papersAndSimilarities) =>{
    var i,j,s;
    var links = [];
    var paper1:paper;
    selectedPaper = data.paper[0].id;
    // For now we only use the very first similarity tensor[0] 
    // Iterate over all Papers
    for (i = 0; i < data.paper.length-1; i++){
        paper1 = data.paper[i];
        // Iterate over all other Papers so that every pair will be looked at once.
        for (j = i+1; j < data.paper.length; j++){
            // Include only similarities that pass a certain threshhold
            let sim = [];
            for (s = 0; s < data.tensor.length; s++){
                sim.push(data.tensor[s][i][j]);
            }
            //if(sim.reduce((x, y) => x + y) > 10){ //Threshhold for generating Links
                links.push({
                    source: paper1.id,
                    target: data.paper[j].id,
                    color: "#FFFFFF",
                    similarity: sim,
                    label: sim.toString(),
            })/*}*/
        }
    }
    var nodes = data.paper.map(id => ({
        id: id.id,
        title: id.title,//"Number of o´s in Name: " + (id.title.split("o").length-1) + "\nNumber of s in Name: " + (id.title.split("s").length-1),
        paperAbstract: id.paperAbstract,
        authors: id.authors,
        inCitations: id.inCitations,
        outCitations: id.outCitations,
        year: id.year,
        s2Url: id.s2Url,
        sources: id.sources,
        pdfUrls: id.pdfUrls,
        venue:id.venue,
        journalName: id.journalName,
        journalVolume: id.journalVolume,
        journalPages: id.journalPages,
        doi: id.doi,
        doiUrl: id.doiUrl,
        pmid: id.pmid,
        fieldsOfStudy: id.fieldsOfStudy,
        magId:id.magId,
        s2PdfUrl: id.s2PdfUrl,
        entities: id.entities,
        //name: "Number of o´s in Name: " + (id.title.split("o").length-1),

        color: ""
    }));
    // Fix Position of the selected Paper in the center of the canvas
    (nodes[0] as NodeObject).fx = 0;
    (nodes[0] as NodeObject).fy = 0;
    
    return ({    
            nodes: nodes,
            links: links
        }
    );
}

export const GraphFetch: React.FC = () => {
    /*
    ** useState Hook to save the graphData 
    */
    const [graph, setGraph] = React.useState<myGraphData>({nodes:[], links:[]});

    /*
    ** EffectHook for the initial Load of the graph
    */
    React.useEffect(() => {
        loadData();
    },[]);

    /*
    ** loadData fetches the graph_Data from the backend and saves the generated Graph in the State Hook graph
    */
    const loadData = async () => {
        const url = Config.base_url
        const response = await fetch(url + "/api/generate_graph/?paper_id=9257779eed46107bcdce9f4dc86298572ff466ce");
        const data = await response.json();
        setGraph(genGraph(data));
    }

    return (
        <Graph data={graph}/>
    )
}
/**
 * TODO: delete + set correct origin node
 */
const initNode = {
    id: "0",
    title: "Origin",
    paperAbstract: "",
    authors: [{name: "John Glanz", "ids":["321534234"]}],
    inCitations: ["asdasd", "aisdingk"],
    outCitations: ["fadg"],
    year: 2021,
    s2Url: "",
    sources: [""],
    pdfUrls: [""],
    venue: "",
    journalName: "",
    journalVolume: "",
    journalPages: "",
    doi: "",
    doiUrl: "",
    pmid: "",
    fieldsOfStudy: ["Materials Science"],
    magId: "",
    s2PdfUrl: "",
    entities: [""],

    color: "",
}

/**
 * main Method for generating the Graph
 * @returns everything that is displayed under the Graph Tab
 */
export const Graph: React.FC<{"data": myGraphData}> = (props) => {
    /**
    ** Reference to the Graph used for TODO: insert Usage
    */
    const fgRef = React.useRef();
    /*
    ** useState Hook to save influence of the first slider (O-Similarity);
    */
    const [firstSliderValue, setFirstSliderValue] = React.useState(50);
    /**
     * useState Hook to save influence of the second slider (S-Similarity);
     */
    const [secondSliderValue, setSecondSliderValue] = React.useState(50);
    /*
    ** set whether the drawer is shown or hidden
    */
    const[drawer, setDrawer] = React.useState(true);
    /*
    ** selected Node to display on drawer
    */
    const[selectedNode, setNode] = React.useState(initNode);
    /*
    ** EffectHook for the initial Load of the graph
    */
    React.useEffect(() => {
            const fg:any = fgRef.current;
            //Playing with the forces on the graph
            //fg.d3Force('center', null);
            //fg.d3Force("link").iterations(1).distance((link:myLinkObject) => link.similarity[0]*5);
            fg.d3Force("link").iterations(1).distance((link:myLinkObject) => link.similarity.reduce(((x,y) => x + y), 2));
        },[]);
    React.useEffect(() => {
        const fg:any = fgRef.current;
        fg.d3Force("link").iterations(1).distance((link:myLinkObject) => (link.similarity[0] * firstSliderValue/10 + link.similarity[1] * secondSliderValue/10 + link.similarity[2] * 5));//link.similarity.reduce(((x,y) => x + y), 0)*sliderValue));
        fg.d3ReheatSimulation();
    },[firstSliderValue, secondSliderValue]);

    return(
        <div>
            <Row>
                <Col md={10}>
                    <Slider 
                        progress
                        style={{ marginTop: 16, marginLeft: 50 }}
                        value={firstSliderValue}
                        onChange={value => {
                            setFirstSliderValue(value);
                        }}
                        />
                </Col>
                <Col md={4}>
                    <InputNumber
                        min={0}
                        max={100}
                        value={firstSliderValue}
                        onChange={value => {
                            setFirstSliderValue((value as any));
                        }}
                    />
                </Col>
            </Row>
            <Row>
                <Col md={10}>
                    <Slider
                        progress
                        style={{ marginTop: 16, marginLeft: 50 }}
                        value={secondSliderValue}
                        onChange={value => {
                            setSecondSliderValue(value);
                        }}
                        />
                </Col>
                <Col md={4}>
                    <InputNumber
                        min={0}
                        max={100}
                        value={secondSliderValue}
                        onChange={value => {
                            setSecondSliderValue((value as any));
                        }}
                    />
                </Col>
            </Row>
            {/**
             * Drawer displays paper meta data
             */}
            <Drawer
                show={drawer}
                backdrop={false}
                onHide={() => {setDrawer(false)}}
            >
                <Drawer.Header>
                    <Drawer.Title>
                        {selectedNode.title}
                    </Drawer.Title>
                </Drawer.Header>
                <Drawer.Body>
                    <p>
                        <Button color="cyan" appearance="ghost" href={selectedNode.s2Url} target="_blank">
                            Open in Semantic Scholar
                        </Button>
                    </p>
                    <p style={{color:"grey"}}>{selectedNode.year}{selectedNode.authors.map(author => <>, {author.name}</>)}
                        <br/> Citations: {selectedNode.inCitations.length}, References: {selectedNode.outCitations.length}
                        <br/><p style={{color:selectedNode.color}}>Field: {selectedNode.fieldsOfStudy.map(field => <> {field}</>)} </p>
                    </p>
                    <p>{selectedNode.paperAbstract}</p>
                </Drawer.Body>
                <Drawer.Footer>

                </Drawer.Footer>
            </Drawer>
            {/**
             * ForceGraph2D renders the actual graph
             * For information on the attributes, pls visit: https://github.com/vasturiano/react-force-graph
             */}
            <ForceGraph2D ref = {fgRef}
                          graphData={props.data}
                          onNodeClick={(node, e) => {
                              e.preventDefault();
                              if (node.id === selectedNode.id) {
                                  setDrawer(!drawer)
                              } else {
                                  setNode((node as paper))
                                  setDrawer(true)
                              }
                          }}
                          onBackgroundClick={(e) => {
                              e.preventDefault()
                              setDrawer(false)
                          }}
                          nodeAutoColorBy="fieldsOfStudy"
                          nodeLabel="title"
                          linkLabel={(link:any) =>(link.label)}
                          linkWidth="width"
                          linkCurvature="curvature"
                          linkDirectionalArrowLength="arrowLen"
                          linkDirectionalParticles="dirParticles"
                          //Add this line together with the initialising and instantiating of selectedPaper to show only Links connected to the selectetPaper
                          linkVisibility={(link:LinkObject) => ((link.source as NodeObject).id == selectedPaper)}
                          d3VelocityDecay={0.4}
                          cooldownTicks={100}
                          onEngineStop={() => (fgRef.current as any).zoomToFit(400, 100)}
                          />
        </div>
    )
}