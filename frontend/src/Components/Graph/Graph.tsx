import React from 'react';

import ForceGraph2D from 'react-force-graph-2d';
import { Button, Drawer, Row, Col, Slider, InputNumber, Loader } from 'rsuite';

import { Paper, PapersAndSimilarities, PaperGraphData, SimilarityLinkObject } from './GraphTypes';
import { GetMinAndMaxFromMatrix, Normalize } from './GraphHelperfunctions';

import './Graph.css'

const totalSliderValue: number = 100;
const squish: number = 0.2;
const logBulk: number = 2;
const nodeBaseSize: number = 4;

/**
 * This method generates the graph for the provided graphsAndSimilarities Object
 * @param data contains all papers, similarities and similarities between papers
 * @returns a GraphData object consisting of nodes[] and links[]
 */
const generateGraph = (data : PapersAndSimilarities) : PaperGraphData =>{
    let similarityMatrix : number[][] = new Array(data.paper.length);

    const normalized_tensor = data.tensor.map(matrix => {
        const bounds = GetMinAndMaxFromMatrix(matrix)
        return Normalize(matrix, bounds[0], bounds[1])
    });

    similarityMatrix = normalized_tensor.reduce((previousValue, currentValue) => 
        previousValue.map((line, index_x) => line.map((value, index_y) => value + currentValue[index_x][index_y])))

    const minMaxTuple = GetMinAndMaxFromMatrix(similarityMatrix);
    similarityMatrix = Normalize(similarityMatrix, minMaxTuple[0], minMaxTuple[1]);

    const links = data.paper.map((paper_l, x) => (data.paper.slice(0, x).map((paper_r, y) => ({
        source: data.paper[x].id,
        target: data.paper[y].id,
        color: `rgba(150,150,150,${similarityMatrix[x][y]})`,
        similarity: data.similarities.map((similiarity, index) => normalized_tensor[index][x][y]),
        label: data.similarities.map((similiarity, index) => normalized_tensor[index][x][y]).toString(),
    })))).flat();

    const nodes = data.paper.map((paper, index) => ({
        ...paper,
        color: '',
        originSim: similarityMatrix[0][index],
        val: Math.log(paper.inCitations.length + logBulk) * nodeBaseSize,
    }));

    return ({    
        nodes: nodes,
        links: links,
    });
}

const changeSlider = (index: number, val: number, oldValues: number[]) => {
    return oldValues.map((x, i) => i === index ? val : oldValues[index] === totalSliderValue ? 0 : (totalSliderValue - val) * x / (totalSliderValue - oldValues[index]));
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

    const sliderCount: number = props.data.tensor.length;

    // reference to the Graph used for TODO: insert Usage  
    const fgRef = React.useRef();

    // slider values
    const [sliders, setSliders] = React.useState(Array(sliderCount).fill(totalSliderValue / sliderCount))
    
    // set whether the drawer is shown or hidden
    const [drawer, setDrawer] = React.useState(true);
    
    // selected Node to display on drawer
    const [selectedNode, setNode] = React.useState(initNode);

    // load an empty Graph until the real Data is fetched
    const [graphData, setGraphData] = React.useState<PaperGraphData>({nodes : [], links : []})

    React.useEffect(() => {
        setSliders(Array(sliderCount).fill(totalSliderValue / sliderCount))
    }, [sliderCount])

    React.useEffect(() => {
        if (props.data.tensor.length > 0)
            setGraphData(generateGraph(props.data));
    }, [props.data])

    // EffectHook for playing with forces
    React.useEffect(() => {
        const fg : any = fgRef.current;
        if (fg) {
            fg.d3Force('charge').strength(-100);
            fg.d3Force('charge').distanceMin(20);
            fg.d3Force('link').distance((link : SimilarityLinkObject) => 50 / (link.similarity.map((element, index) => element * sliders[index] / 100).reduce((x,y) => x+y) + squish));
            fg.d3Force('link').strength((link : SimilarityLinkObject) => (link.similarity.map((element, index) => element * sliders[index] / 100).reduce((x,y) => x+y) + squish));
        }
        }, [sliders]);

    // EffectHook for rerendering upon slider changes
    React.useEffect(() => {
        const fg : any = fgRef.current;
        if (fg) {
            fg.d3ReheatSimulation();
        }
    }, [sliders]);

    return(
        <div>
            {sliders.map((sliderVal, index) => (
                <Row key={index}>
                    <Col md={10}>
                        <Slider 
                            progress
                            style={{ marginTop: 16, marginLeft: 50 }}
                            value={sliderVal}
                            onChange={value => {
                                setSliders(changeSlider(index, value, sliders))
                            }}
                            />
                    </Col>
                    <Col md={4}>
                        <InputNumber
                            min={0}
                            max={totalSliderValue}
                            value={sliderVal}
                            onChange={value => {
                                setSliders(changeSlider(index, value as number, sliders))
                            }}
                        />
                    </Col>
                </Row>)
                )}
            
            {/**
             * Drawer displays paper meta data
             */}
            
            {props.data.tensor.length > 0 ? 
                <>
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
                                graphData={graphData}
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
                                linkLabel={(link) =>((link as SimilarityLinkObject).label)}
                                linkWidth={(link) => ((link as SimilarityLinkObject).similarity.map((element, index) => element * sliders[index] / totalSliderValue).reduce((x,y) => x+y)*3)}
                                linkCurvature='curvature'
                                linkDirectionalArrowLength='arrowLen'
                                linkDirectionalParticles='dirParticles'
                                //Add this line together with the initialising and instantiating of selectedPaper to show only Links connected to the selectetPaper
                                //linkVisibility={(link : SimilarityLinkObject) => ((link as SimilarityLinkObject).similarity.reduce((x, y) => x + y) > 0.2)}
                                d3VelocityDecay={0.95}
                                cooldownTicks={100}
                                //onEngineStop={() => (fgRef.current as any).zoomToFit(400, 100)}
                                />
                </>
            : <Loader content="Loading..." />}
        </div>
    )
}