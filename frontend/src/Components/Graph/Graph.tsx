import React from 'react';

import ForceGraph2D from 'react-force-graph-2d';
import { forceRadial, forceLink } from 'd3-force-3d';
import { Button, Drawer, Row, Col, Slider, InputNumber } from 'rsuite';

import Config from '../../Utils/Config';
import { Paper, PapersAndSimilarities, MyGraphData, MyLinkObject } from './GraphTypes';
import { GetMinAndMaxFromMatrix, Normalize, CheckConnections, FindBoundary } from './GraphHelperfunctions';

import './Graph.css'

// Variable used to identify the ID of the selected Paper
let selectedPaper = '0';

/**
 * This method generates the graph for the provided graphsAndSimilarities Object
 * @param data contains all papers, similarities and similarities between papers
 * @returns a GraphData object consisting of nodes[] and links[]
 */
const generateGraph = (data : PapersAndSimilarities) : MyGraphData =>{
    let i,j,s;
    let links = [];
    let nodes = [];
    let similarityMatrix : number[][] = new Array(data.paper.length);
    selectedPaper = data.paper[0].id;
    // data.tensor = data.tensor.map((x) => x.map((y) => y.map((z) => (z < 0)? 0 : z))); 
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
        similarityMatrix[i] = tempArray;
    }
    let minMaxTuple = GetMinAndMaxFromMatrix(similarityMatrix);
    console.log(minMaxTuple)
    similarityMatrix = Normalize(similarityMatrix, minMaxTuple[0], minMaxTuple[1]);
    console.log(similarityMatrix);
    const boundary = FindBoundary(similarityMatrix);
    //console.log(boundary);
    for (i = 0; i < data.paper.length; i++){
        for (j = i+1; j < data.paper.length; j++){
            //if(i == 0){
            //if(similarityMatrix[i][j] > boundary){ //Threshhold for generating Links
                links.push({
                    source: data.paper[i].id,
                    target: data.paper[j].id,
                    color: `rgba(150,150,150,${similarityMatrix[i][j]})`,
                    similarity: similarityMatrix[i][j],
                    label: similarityMatrix[i][j].toString(),//(50 / (similarityMatrix[i][j] + 0.01)).toString(),
            //})/*}*/}
            /*else{
                if(similarityMatrix[i][j] > 27.5){
                    links.push({
                        source: data.paper[i].id,
                        target: data.paper[j].id,
                        color: '#FFFFFF',
                        similarity: similarityMatrix[i][j],
                        label: similarityMatrix[i][j].toString(),
                    })
                }*/
            })
        }
        //Create Nodes for every Paper in data.paper
        const id = data.paper[i];
        nodes.push({
            id: id.id,
            title: id.title,
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
            color: '',
            originSim: similarityMatrix[0][i],
        });
    }
    // Fix Position of the selected Paper in the center of the canvas
    //(nodes[0] as Paper).fx = 0;
    //(nodes[0] as Paper).fy = 0;
    
    return ({    
            nodes: nodes,
            links: links,
        }
    );
}

/**
 * TODO: delete + set correct origin node
 */
const initNode = {
    id: '0',
    title: 'Origin',
    paperAbstract: '',
    authors: [{name: 'John Glanz', 'ids':['321534234']}],
    inCitations: ['asdasd', 'aisdingk'],
    outCitations: ['fadg'],
    year: 2021,
    s2Url: '',
    sources: [''],
    pdfUrls: [''],
    venue: '',
    journalName: '',
    journalVolume: '',
    journalPages: '',
    doi: '',
    doiUrl: '',
    pmid: '',
    fieldsOfStudy: ['Materials Science'],
    magId: '',
    s2PdfUrl: '',
    entities: [''],

    color: '',
};

/**
 * main Method for generating the Graph
 * @returns everything that is displayed under the Graph Tab
 */
export const Graph: React.FC<{'data' : PapersAndSimilarities}> = (props) => {
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

    //Load an empty Graph until the real Data is fetched
    const myGraphData = (props.data.paper.length == 0)? ({nodes : [], links : []}) : generateGraph(props.data);

    /*
    ** EffectHook for playing with forces
    */
    React.useEffect(() => {
            const fg : any = fgRef.current;
            //Playing with the forces on the graph
            //fg.d3Force('link', null);
            //fg.d3Force('charge', null);
            //fg.d3Force('center', null);
            //fg.d3Force('charge').strength((node : NodeObject) => -3);
            //fg.d3Force('radial', forceRadial(30));
            //fg.d3Force('radial').radius((node : Paper) => 1000/(node.originSim));
            //console.log(props.data.links.filter((link : myLinkObject) => ((link.source as NodeObject).id != props.data.nodes[0].id)));
            //let links = myGraphData.links.filter((link : myLinkObject) => (link.source != myGraphData.nodes[0].id));
            //fg.d3Force('link').links(links);
            //{console.log(link.source);
              //  console.log(myGraphData.nodes[0].id);
                //return (link.source != myGraphData.nodes[0].id)}));
            fg.d3Force('link').distance((link : MyLinkObject) => 50 / (link.similarity + 0.01));
            fg.d3Force('link').strength((link : MyLinkObject) => link.similarity);
        },[]);

    /**
     * EffectHook for rerendering upon slider changes
     */
    React.useEffect(() => {
        const fg : any = fgRef.current;
        //fg.d3Force("link").distance((link : MyLinkObject) => (link.similarity[0] * firstSliderValue/10 + link.similarity[1] * secondSliderValue/10 + link.similarity[2] * 5));//link.similarity.reduce(((x,y) => x + y), 0)*sliderValue));
        fg.d3ReheatSimulation();
    },[firstSliderValue, secondSliderValue]);

    //console.log(props.data);

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
                onHide={() => {setDrawer(false);}}
            >
                <Drawer.Header>
                    <Drawer.Title>
                        {selectedNode.title}
                    </Drawer.Title>
                </Drawer.Header>
                <Drawer.Body>
                    <p>
                        <Button color='cyan' appearance='ghost' href={selectedNode.s2Url} target='_blank'>
                            Open in Semantic Scholar
                        </Button>
                    </p>
                    <p style={{color:'grey'}}>{selectedNode.year}{selectedNode.authors.map(author => <>, {author.name}</>)}
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
                          graphData={myGraphData}
                          onNodeClick={(node, e) => {
                              e.preventDefault();
                              if (node.id === selectedNode.id) {
                                  setDrawer(!drawer);
                              } else {
                                  setNode((node as Paper));
                                  setDrawer(true);
                              };
                          }}
                          onBackgroundClick={(e) => {
                              e.preventDefault()
                              setDrawer(false)
                          }}
                          nodeAutoColorBy='fieldsOfStudy'
                          nodeLabel='title'
                          linkLabel={(link) =>((link as MyLinkObject).label)}
                          linkWidth={(link) =>((link as MyLinkObject).similarity)*3}
                          linkCurvature='curvature'
                          linkDirectionalArrowLength='arrowLen'
                          linkDirectionalParticles='dirParticles'
                          //Add this line together with the initialising and instantiating of selectedPaper to show only Links connected to the selectetPaper
                          //linkVisibility={(link:LinkObject) => ((link.source as NodeObject).id == selectedPaper)}
                          d3VelocityDecay={0.9}
                          cooldownTicks={100}
                          //onEngineStop={() => (fgRef.current as any).zoomToFit(400, 100)}
                          />
        </div>
    )
}