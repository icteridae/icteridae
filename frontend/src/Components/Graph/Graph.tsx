import * as React from 'react';
import ForceGraph2D, {GraphData, LinkObject, NodeObject} from 'react-force-graph-2d';
import { forceRadial, forceLink } from "d3-force-3d";
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
    color: string,

    /** Paper Similarity to selected Paper/Graph Origin */
    originSim: number,
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
    similarity: number,
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
const genGraph = (data:papersAndSimilarities):myGraphData =>{
    var i,j,s;
    var links = [];
    var nodes = [];
    var simMat:number[][] = new Array(data.paper.length);
    selectedPaper = data.paper[0].id;
    data.tensor = data.tensor.map((x) => x.map((y) => y.map((z) => (z < 0)? 0 : z)));
    // For now we only use the very first similarity tensor[0] 
    // Iterate over all Papers
    for (i = 0; i < data.paper.length; i++){
        let tempArray = [];
        // Iterate over all other Papers so that every pair will be looked at once.
        for (j = 0; j < data.paper.length; j++){
            // Include only similarities that pass a certain threshhold
            let sim = 0;
            for (s = 0; s < data.tensor.length; s++){
                sim = sim + data.tensor[s][i][j];
            }
            tempArray.push(sim);
        }
        simMat[i] = tempArray;
    }
    console.log(simMat);
    var boundary = find_boundary(simMat);
    console.log(boundary);
    for (i = 0; i < data.paper.length; i++){
        for (j = i+1; j < data.paper.length; j++){
            //if(i == 0){
            if(simMat[i][j] > boundary){ //Threshhold for generating Links
                links.push({
                    source: data.paper[i].id,
                    target: data.paper[j].id,
                    color: "#FFFFFF",
                    similarity: simMat[i][j],
                    label: simMat[i][j].toString(),
            })/*}*/}
        }
        //Create Nodes for every Paper in data.paper
        var id = data.paper[i];
        nodes.push({
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
            color: "",
            originSim: data.tensor[0][0][i],
        })
    }
    // Fix Position of the selected Paper in the center of the canvas
    (nodes[0] as NodeObject).fx = 0;
    (nodes[0] as NodeObject).fy = 0;
    
    return ({    
            nodes: nodes,
            links: links
        }
    );
}

const check_connections = (mat:number[][], thr:number) => {
    var mat_c = JSON.parse(JSON.stringify(mat));
    mat_c = mat_c.map((x:number[]) => x.map(z => z>thr ? z : -1));
    let x:Set<number> = new Set();
    x.add(0);
    for (let i = 0; i<mat_c.length; i++) {
      for (let val of [...Array.from(x)]) {
        for (let k = 0; k < mat_c.length; k++) {
          if (mat_c[val][k] > -1) {
            x.add(k)
            if (x.size == mat_c.length) {
              return true
            }
          }
        }
      }
    }
    return false
 };
 
const  find_boundary = (mat:number[][]) => {
   var mat_c2 = JSON.parse(JSON.stringify(mat));
   var max_m = Math.max(...mat_c2.map((x:number[]) => Math.max(...x)))
 
   let v_top = max_m
   let v_bottom = 0
 
   for (let i = 0; i < 10; i++) {
     let mid = (v_top + v_bottom) / 2
     let bo = check_connections(mat, mid)
     if (bo) {
       v_bottom = mid
     } else {
       v_top = mid
     }
   }
   
   return v_bottom
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
        const response = await fetch(url + "/api/generate_graph/?paper_id=1ae8584e12459279ee915f4cda5c552c14697b07");
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
            //fg.d3Force('link', null);
            //fg.d3Force('charge', null);
            fg.d3Force('center', null);
            //fg.d3Force('radial', forceRadial(30));
            //fg.d3Force('radial').radius((node:paper) => (node.originSim)*10);
            //console.log(props.data.links.filter((link:myLinkObject) => ((link.source as NodeObject).id != props.data.nodes[0].id)));
            //let links = props.data.links.filter((link:myLinkObject) => ((link.source as NodeObject).id != props.data.nodes[0].id));
            //fg.d3Force('link').iterations(1).links(props.data.links.filter((link:myLinkObject) => ((link.source as NodeObject).id != props.data.nodes[0].id)));
            fg.d3Force('link').iterations(1).distance((link:myLinkObject) => link.similarity *5);
            fg.d3Force('link').iterations(1).strength((link:myLinkObject) => 1/ link.similarity);
        },[]);
    React.useEffect(() => {
        const fg:any = fgRef.current;
        //fg.d3Force("link").iterations(1).distance((link:myLinkObject) => (link.similarity[0] * firstSliderValue/10 + link.similarity[1] * secondSliderValue/10 + link.similarity[2] * 5));//link.similarity.reduce(((x,y) => x + y), 0)*sliderValue));
        fg.d3ReheatSimulation();
    },[firstSliderValue, secondSliderValue]);

    console.log(props.data);

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
                          linkWidth={(link:any) =>(link.similarity/5)}
                          linkCurvature="curvature"
                          linkDirectionalArrowLength="arrowLen"
                          linkDirectionalParticles="dirParticles"
                          //Add this line together with the initialising and instantiating of selectedPaper to show only Links connected to the selectetPaper
                          //linkVisibility={(link:LinkObject) => ((link.source as NodeObject).id == selectedPaper)}
                          d3VelocityDecay={0.4}
                          cooldownTicks={100}
                          //onEngineStop={() => (fgRef.current as any).zoomToFit(400, 100)}
                          />
        </div>
    )
}