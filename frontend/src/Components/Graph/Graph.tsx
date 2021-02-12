import React from 'react';

import ForceGraph2D from 'react-force-graph-2d';
import { Button, Drawer, Row, Col, Slider, InputNumber, Loader, IconButton, Icon } from 'rsuite';

import { Paper, PapersAndSimilarities, PaperGraphData, SimilarityLinkObject } from './GraphTypes';
import { GetMinAndMaxFromMatrix, Normalize } from './GraphHelperfunctions';

import './Graph.css'

const totalSliderValue: number = 100;
const squish: number = 0.2;
const logBulk: number = 2;
const nodeBaseSize: number = 4;
const linkOnHoverWidth: number = 4;

/**
 * This method generates the graph for the provided graphsAndSimilarities Object
 * @param data contains all papers, similarities and similarities between papers
 * @returns a GraphData object consisting of nodes[] and links[]
 */
const generateGraph = (data : PapersAndSimilarities) : PaperGraphData =>{
    let similarityMatrix : number[][] = new Array(data.paper.length);

    const normalized_tensor = data.tensor.map(matrix => {
        const bounds = GetMinAndMaxFromMatrix(matrix);
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
        isHovered: false,
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
    if (oldValues.filter((x, i) => x === 0.1 || i === index).length === oldValues.length ) {
        return oldValues.map((x,i) => i===index ? val : (totalSliderValue-val)/(oldValues.length-1))
    }
    return oldValues.map((x, i) => i === index ? val : oldValues[index] === totalSliderValue ? 1 : (totalSliderValue - val) * x / (totalSliderValue - oldValues[index]));
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
    const [paperDrawer, setPaperDrawer] = React.useState(false);

    // set whether the drawer is shown or hidden
    const [sliderDrawer, setSliderDrawer] = React.useState(false);
    
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
            fg.d3Force('charge').distanceMin(10);
            fg.d3Force('link').distance((link : SimilarityLinkObject) => 100 / (link.similarity.map((element, index) => element * sliders[index] / 100).reduce((x,y) => x+y) + squish));
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
        <div className='graph'>         
            <div className='show-slider-icon'>
                <Icon 
                    size='4x'
                    icon='angle-right'
                    onMouseEnter={() => setSliderDrawer(true)}
                    />
            </div>
            {/**
             * Drawer displays the Sliders
             */}
            {props.data.tensor.length > 0 ? 
                <>
                    <Drawer
                        className='rs-drawer-left'
                        show={sliderDrawer}
                        placement='left'
                        backdrop={false}
                        onMouseLeave={() => setSliderDrawer(false)}
                        onHide={() => setSliderDrawer(false)}
                    >
                        <Drawer.Header>
                            <Drawer.Title>
                                {'Slider'}
                            </Drawer.Title>
                        </Drawer.Header>
                        <Drawer.Body>
                            <div className='slider-popup'>
                                {sliders.map((sliderVal, index) => (
                                    <div className='slider-with-input-number' key={index}>
                                            <Slider
                                                step= {0.1}
                                                progress
                                                style={{ marginTop: 16, marginLeft: 20, marginRight: 10 }}
                                                value={sliderVal}
                                                onChange={value => {
                                                    setSliders(changeSlider(index, value, sliders))
                                                }}
                                                />
                                            <InputNumber
                                                min={0}
                                                max={totalSliderValue}
                                                value={sliderVal}
                                                onChange={value => {
                                                    setSliders(changeSlider(index, value as number, sliders))
                                                }}
                                            />
                                    </div>)
                                )}
                            </div>
                        </Drawer.Body>
                        <Drawer.Footer>

                        </Drawer.Footer>
                    </Drawer>
                    <Drawer
                        show={paperDrawer}
                        backdrop={false}
                        onHide={() => {setPaperDrawer(false);}}
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
                    <ForceGraph2D 
                                ref = {fgRef}
                                graphData={graphData}
                                onNodeClick={(node, e) => {
                                    e.preventDefault();
                                    if (node.id === selectedNode.id) {
                                        setPaperDrawer(!paperDrawer);
                                    } else {
                                        setNode((node as Paper));
                                        setPaperDrawer(true);
                                    };
                                }}
                                onBackgroundClick={(e) => {
                                    e.preventDefault()
                                    setPaperDrawer(false)
                                    setSliderDrawer(false)
                                }}
                                onLinkHover={(link, prevlink) => {
                                    if(!(prevlink === null)){
                                        (prevlink as SimilarityLinkObject).color = `rgba(150,150,150,${(prevlink as SimilarityLinkObject).similarity.reduce((x, y) => x + y)})`;
                                        (prevlink as SimilarityLinkObject).isHovered = false;
                                    }
                                    if(!(link === null)){
                                        (link as SimilarityLinkObject).color = 'rgba(150,150,150,1)';
                                        (link as SimilarityLinkObject).isHovered = true;
                                    }
                                }}
                                nodeAutoColorBy='fieldsOfStudy'
                                nodeLabel='title'
                                linkLabel={(link) => (link as SimilarityLinkObject).label}
                                linkWidth={(link) => {
                                    if((link as SimilarityLinkObject).isHovered){
                                        return linkOnHoverWidth;
                                    }else{
                                        return ((link as SimilarityLinkObject).similarity.map((element, index) => element * sliders[index] / totalSliderValue).reduce((x,y) => x+y)*6)
                                    }}}
                                linkCurvature='curvature'
                                linkDirectionalArrowLength='arrowLen'
                                linkDirectionalParticles='dirParticles'
                                //Add this line together with the initialising and instantiating of selectedPaper to show only Links connected to the selectetPaper
                                //linkVisibility={(link : LinkObject) => ((link as SimilarityLinkObject).similarity.reduce((x, y) => x + y) >= 0)}
                                d3VelocityDecay={0.95}
                                cooldownTicks={100}
                                //onEngineStop={() => (fgRef.current as any).zoomToFit(400, 100)}
                                />
                </>
            : <Loader className='loader' content="Loading..." />}
        </div>
    )
}