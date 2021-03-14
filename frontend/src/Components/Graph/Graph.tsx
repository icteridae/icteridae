import React from 'react';
import { Link } from 'react-router-dom';

import ForceGraph2D from 'react-force-graph-2d';
import { Button, Drawer, Slider, InputNumber, Loader, Icon, Popover, Whisper, ButtonGroup, Divider, SelectPicker, FlexboxGrid } from 'rsuite';
import sizeMe from 'react-sizeme'
import Linkify from 'react-linkify';

import { PaperNode, PapersAndSimilarities, PaperGraphData, SimilarityLinkObject } from './GraphTypes';
import { getMinAndMaxFromMatrix, normalize, choosingSliderValues, changeSlider, hash, hexToRGB } from './GraphHelperfunctions';
import { Legend } from './Legend'

import './Graph.sass'
import { addSavedPaper, setSavedSliders } from '../../Utils/Webstorage';
import { useHistory } from 'react-router-dom';
import { Bookmark } from '../General/Bookmark';
import { pallettes } from './Colors';
import { Helmet } from 'react-helmet';

// Node Parameters
// Added inside log(citations) to shift the logarithm. Can not be less than 1!
const logBulk: number = 2;
// Lowest node oppacity for all nodes.
const lowerBoundForNodeOppacity: number = 0.25;
// How many years backwards will have their oppacity scaled. Any paper older than currentYear - paperOppacityYearRange will get the lowerBound value
const paperOppacityYearRange: number = 20;
// Use our standard accent color for all papers that only have the Computer Science field of study
const defaultFieldOfStudy: string = 'Computer Science';
// Size of the node with the least citations
const smallestNodeSize: number = 10;
// Size of the node with the most citations
const largestNodeSize: number = 100;

// Link Parameters
// Size of link that the cursor hovers over
const linkOnHoverWidth: number = 4;
// squish can be between 0 and 1. Adjusts how strong the link force pulls the nodes together where 0 is no LinkForce at all
const squish: number = 0.25;

// Slider Parameters
// Maximum number that can be selected on a slider
const totalSliderValue: number = 100;

// Display Parameters
// Max number of authors shown for selected paper
const maxAuthors: number = 3;

/**
 * This method generates the graph for the provided PapersAndSimilarities object
 * @param data contains all papers, similarities and similarities between papers
 * @returns a graphData object consisting of nodes[] and links[] aswell as the number of least and most citations that are used in the graph
 */
const generateGraph = (data : PapersAndSimilarities) : [PaperGraphData, number, number] =>{
    let similarityMatrix : number[][] = new Array(data.paper.length);

    // Normalize all values in the tensor to [0, 1] (1 included)
    const normalized_tensor = data.tensor.map(matrix => {
        const bounds = getMinAndMaxFromMatrix(matrix);
        return normalize(matrix, bounds[0], bounds[1])
    });

    // Add the different similarities to get a total similarity. We can't add them first and normalize afterwards because then the similarity sliders can't affect only 1 similarity
    similarityMatrix = normalized_tensor.reduce((previousValue, currentValue) => 
        previousValue.map((line, index_x) => line.map((value, index_y) => value + currentValue[index_x][index_y])))

    // Determine the smallest and highest similarity in the graph and normalize the similarityMatrix to [0,1]
    const minMaxTuple = getMinAndMaxFromMatrix(similarityMatrix);
    similarityMatrix = normalize(similarityMatrix, minMaxTuple[0], minMaxTuple[1]);

    // Create the links for the graph
    const links = data.paper.map((paper_l, x) => (data.paper.slice(0, x).map((paper_r, y) => ({
        source: data.paper[x].id,
        target: data.paper[y].id,
        color: `rgba(150,150,150,${similarityMatrix[x][y]})`,
        similarity: data.similarities.map((similiarity, index) => normalized_tensor[index][x][y]),
        label: '',
        isHovered: false,
    })))).flat();

    // Determine the least and most citations out of all papers in the graph and return them. They will later be used for the Legend
    let leastCitations = data.paper.reduce((paper, smallest) => (paper.citations < smallest.citations) ? paper : smallest ).citations;
    let mostCitations = data.paper.reduce((paper, largest) => (paper.citations > largest.citations) ? paper : largest).citations;

    // Create the nodes for the graph. val decides the size of the Nodes. We normalized it between smallest- and largestNodeSize so that every graph looks appealing
    const nodes = data.paper.map((paper, index) => ({
        ...paper,
        val: (((Math.log(paper.citations + logBulk) - Math.log(leastCitations + logBulk)) / (Math.log(mostCitations + logBulk) - Math.log(leastCitations + logBulk))) * (largestNodeSize - smallestNodeSize)) + smallestNodeSize,
        isHovered: false,
    }));

    return ([{    
        nodes: nodes,
        links: links,
    },
    leastCitations,
    mostCitations]);
}

/**
 * main method for generating the graph
 * @returns everything that is displayed in the graph view
 */
const Graph: React.FC<{'data' : PapersAndSimilarities, 'size' : {'width' : number, 'height' : number}}> = (props) => {

    // total number of sliders needed base on the number of similarity metrics applied
    const sliderCount: number = props.data.tensor.length;

    // reference to the graph
    const fgRef = React.useRef();

    // slider values
    const [sliders, setSliders] = React.useState(Array(sliderCount).fill(totalSliderValue / sliderCount))
    
    // set whether the drawer is shown or hidden
    const [paperDrawer, setPaperDrawer] = React.useState(false);

    // set whether the drawer is shown or hidden
    const [controllerDrawer, setControllerDrawer] = React.useState(true);
    
    // selected Node to display on drawer
    const [selectedNode, setNode] = React.useState(props.data.paper[0]);

    // load an empty graph until the real data is fetched
    const [graphData, setGraphData] = React.useState<PaperGraphData>({nodes : [], links : []})

    // boolean to decide wheter the title or the author and year should be displayed on the nodes
    const [showTitle, setShowTitle] = React.useState<Boolean>(true);

    // weak link filter slider value
    const [weakLinkFilter, setweakLinkFilter] = React.useState<number>(0);

    // selected pallette
    const [pallette, setPallette] = React.useState<[string, string[]]>(pallettes[0]);

    // used to increase/decrease the node repelling force (ManyBodyForce)
    const [nodeRepelling, setNodeRepelling] = React.useState<number>(0);

    // least citations of a paper in the generated graph
    const [leastCitations, setLeastCitations] = React.useState<number>(0);

    // most citations of a paper in the generated graph
    const [mostCitations, setMostCitations] = React.useState<number>(0);

    // boolean to decide wheter the legend should be displayed or not
    const [showLegend, setShowLegend] = React.useState<boolean>(true);

    // boolean to decide wheter the nodes will be colored by their field of study or their year
    const [nodeColoring, setNodeColoring] = React.useState<boolean>(true);

    let history = useHistory()

    // EffectHook for inital values of all sliders
    React.useEffect(() => {
        setSliders(choosingSliderValues(sliderCount, totalSliderValue))
    }, [sliderCount])

    // EffectHook for inital load of the graph after fetching the data from the backend
    React.useEffect(() => {
        if (props.data.paper.length > 0){
            let graphData = generateGraph(props.data);
            setGraphData(graphData[0]);
            setLeastCitations(graphData[1]);
            setMostCitations(graphData[2]);
        }
    }, [props.data])

    // EffectHook for playing with forces
    React.useEffect(() => {
        const fg : any = fgRef.current;
        if (fg) {
            fg.d3Force('charge').strength(-100);
            fg.d3Force('charge').distanceMin(10);
            fg.d3Force('link').distance((link : SimilarityLinkObject) => 100 / (link.similarity.map((element, index) => element * sliders[index] / 100).reduce((x,y) => x+y) + squish)+nodeRepelling*2);
            fg.d3Force('link').strength((link : SimilarityLinkObject) => (link.similarity.map((element, index) => element * sliders[index] / 100).reduce((x,y) => x+y) + squish));
        }
        }, [sliders, nodeRepelling]);

    // EffectHook for rerendering upon slider changes
    React.useEffect(() => {
        const fg : any = fgRef.current;
        if (fg) {
            fg.d3ReheatSimulation();
        }
    }, [sliders, nodeRepelling]);

    return(
        <div>
            <Helmet>
                <title>
                    {props.data.paper[0].title}
                </title>
            </Helmet>
            <div className='graph-container'>
                {/**
                 * Graph controller popup button
                 */}        
                <div className='show-slider-icon'>
                    <div className='show-slider-text' onMouseEnter={() => setControllerDrawer(true)}>
                        Slider
                    </div>
                </div>
                {/**
                  * Legend
                  */}
                {showLegend && <Legend data={props.data} defaultFieldOfStudy={defaultFieldOfStudy} pallette={pallette} leastCitations={leastCitations} mostCitations={mostCitations} paperOppacityYearRange={paperOppacityYearRange}/>}
                {/**
                 * Render the graph and both drawers only if data exists (Successful fetch)
                 */}
                {props.data.tensor.length > 0 ? 
                    <>
                        {/**
                         * Drawer displays the sliders
                        */}
                        <Drawer
                            className='rs-drawer'
                            show={controllerDrawer}
                            placement='left'
                            backdrop={false}
                            onMouseLeave={() => setControllerDrawer(false)}
                            onHide={() => setControllerDrawer(false)}
                        >
                            <Drawer.Header>
                                <Drawer.Title>
                                    Graph Controller
                                </Drawer.Title>
                            </Drawer.Header>
                            <Drawer.Body>
                                <div className='slider-popup'>
                                    <span className='graph-settings-title'>Similarites</span>
                                    {sliders.map((sliderVal : number, index) => (
                                        <div className='slider'>
                                            <div>{props.data.similarities[index].name + ':  '}
                                                <Whisper placement="right" trigger="hover" speaker={<Popover title={props.data.similarities[index].name}>
                                                        <Linkify><p>{props.data.similarities[index].description}</p></Linkify>
                                                    </Popover>} enterable>
                                                    <Icon icon="info"/>
                                                </Whisper></div>
                                            <div className='slider-with-input-number' key={index}>
                                                    <Slider
                                                        step= {0.1}
                                                        progress
                                                        style={{ marginTop: 16, marginRight: 10 }}
                                                        handleStyle={{ paddingTop: 7 }}
                                                        value={Number(Number(sliderVal).toFixed(2))}
                                                        onChange={value => {
                                                            const newSliders = changeSlider(index, value, sliders, totalSliderValue);
                                                            setSliders(newSliders);
                                                            setSavedSliders(newSliders);
                                                        }}
                                                        />
                                                    <InputNumber
                                                        min={0}
                                                        max={totalSliderValue}
                                                        value={Number(Number(sliderVal).toFixed(1))}
                                                        onChange={value => {
                                                            if (0 <= value && 100 >= value){
                                                                let newSliders = changeSlider(index, (value as number), sliders, totalSliderValue);
                                                                setSliders(newSliders);
                                                                setSavedSliders(newSliders);
                                                            }
                                                        }}
                                                    />
                                                </div>
                                        </div>)
                                    )}
                                    <Divider />
                                    <div className='graph-settings'>
                                        <span className='graph-settings-title'>Settings</span>
                                        <span className='graph-settings-subtitle-first'>Node Label</span>
                                        <ButtonGroup>
                                            <Button className='switch-button-2' appearance={showTitle ? 'primary' : 'ghost'} onClick={() => setShowTitle(true)}>Title</Button>
                                            <Button className='switch-button-2' appearance={showTitle ? 'ghost' : 'primary'} onClick={() => setShowTitle(false)}>Author, Year</Button>
                                        </ButtonGroup>
                                        <span className='graph-settings-subtitle'>Legend</span>
                                        <ButtonGroup>
                                            <Button className='switch-button-2' appearance={showLegend ? 'primary' : 'ghost'} onClick={() => setShowLegend(true)}>On</Button>
                                            <Button className='switch-button-2' appearance={showLegend ? 'ghost' : 'primary'} onClick={() => setShowLegend(false)}>Off</Button>
                                        </ButtonGroup>
                                        <span className='graph-settings-subtitle'>Node Coloring</span>
                                        <ButtonGroup>
                                            <Button className='switch-button-2' appearance={nodeColoring ? 'primary' : 'ghost'} onClick={() => setNodeColoring(true)}>Field of Study</Button>
                                            <Button className='switch-button-2' appearance={nodeColoring ? 'ghost' : 'primary'} onClick={() => setNodeColoring(false)}>Year</Button>
                                        </ButtonGroup>
                                        <span className='graph-settings-subtitle'>Colorblindness Pallettes for Field Of Study</span>
                                        <SelectPicker 
                                            data={pallettes.map(x => ({value: x, label: x[0]}))}
                                            searchable={false}
                                            cleanable={false}
                                            value={pallette}
                                            onSelect={setPallette}/>
                                        <span className='graph-settings-subtitle'>Weak Link Filter</span>
                                        <Slider className='graph-settings-slider'
                                            progress
                                            defaultValue={0}
                                            onChange={value => {
                                                setweakLinkFilter(value/100);
                                            }}
                                        />
                                        <span className='graph-settings-subtitle'>Node Repelling Force</span>
                                        <Slider className='graph-settings-slider'
                                            progress
                                            defaultValue={0}
                                            onChange={value => {
                                                setNodeRepelling(value);
                                            }}
                                        />
                                    </div>
                                </div>
                            </Drawer.Body>
                        </Drawer>
                        {/**
                         * Drawer displays the selected paper
                         */}
                        <Drawer
                            show={paperDrawer}
                            backdrop={false}
                            onHide={() => {setPaperDrawer(false);}}
                        >
                            <Drawer.Header>
                                <Drawer.Title>
                                    <Bookmark paper_id={selectedNode.id}/>{selectedNode.title}
                                </Drawer.Title>
                            </Drawer.Header>
                            <Drawer.Body>
                                <FlexboxGrid justify='space-between'>
                                    <Button appearance='ghost' href={selectedNode.s2Url} target='_blank'>
                                        Open in Semantic Scholar
                                    </Button>
                                    <Button appearance='ghost' onClick={() => addSavedPaper(selectedNode.id)}>
                                        Save Paper
                                    </Button>
                                    <Button appearance='ghost' onClick={() => {history.push(`/graph/${selectedNode.id}`)}}>
                                        Generate Graph
                                    </Button>
                                </FlexboxGrid>
                                <p style={{color:'grey'}}>{selectedNode.year + ', '}{selectedNode.authors.length <= maxAuthors + 1 ? selectedNode.authors.map<React.ReactNode>(obj => (<Link to={`/author/${obj.id}`}>{obj.name}</Link>)).reduce((prev, curr) => [prev, ', ', curr]) : <>{selectedNode.authors.slice(0, maxAuthors).map<React.ReactNode>(obj => (<Link to={`/author/${obj.id}`}>{obj.name}</Link>)).reduce((prev, curr) => [prev, ', ', curr])}, +{selectedNode.authors.length - maxAuthors} others</>}
                                    <br/> Citations: {selectedNode.inCitations.length}, References: {selectedNode.outCitations.length}
                                    <br/><p style={{color:selectedNode.color}}>Field: {selectedNode.fieldsOfStudy.map(field => field).join(', ')} </p>
                                </p>
                                <p>{selectedNode.paperAbstract}</p>
                            </Drawer.Body>
                        </Drawer>
                        {/**
                         * ForceGraph2D renders the actual graph
                         * For information on the attributes, pls visit: https://github.com/vasturiano/react-force-graph
                         */}
                        <ForceGraph2D 
                                    ref = {fgRef}
                                    graphData={graphData}
                                    height={props.size.height}
                                    width={props.size.width}
                                    onNodeClick={(node, e) => {
                                        e.preventDefault();
                                        if (node.id === selectedNode.id) {
                                            setPaperDrawer(!paperDrawer);
                                        } else {
                                            setNode((node as PaperNode));
                                            setPaperDrawer(true);
                                        };
                                    }}
                                    onNodeHover={(node, prevNode) => {
                                        if(!(prevNode === null)){
                                            (prevNode as PaperNode).isHovered = false;
                                        }
                                        if(!(node === null)){
                                            (node as PaperNode).isHovered = true;
                                        }
                                    }}
                                    onBackgroundClick={(e) => {
                                        e.preventDefault()
                                        setPaperDrawer(false)
                                        setControllerDrawer(false)
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
                                    // Here we draw our own Nodes to apply custom designs. Remove nodeCanvasObject to get normal circular nodes
                                    nodeCanvasObject={(node, ctx, globalScale) => {
                                        let paperName = (node as PaperNode).title;
                                        let authorName = (node as PaperNode).authors[0].name.split(' ');
                                        const label = showTitle ? (paperName.length > 25 ? paperName.substring(0, 20).trim() + '...' : paperName) : authorName[authorName.length-1] + ', ' + (node as PaperNode).year;
                                        const fontSize = 12/globalScale;
                                        ctx.font = `${fontSize}px Sans-Serif`;
                                        
                                        // show Node Color for Field of Study or Oppacity for year
                                        if(nodeColoring){
                                            // Node Color
                                            if((node as PaperNode).fieldsOfStudy.toString() === defaultFieldOfStudy){
                                                ctx.fillStyle = 'rgba(231, 156, 69, 1)';  
                                            }else{
                                                // Hash the names of FieldsOfStudy and use the result as index for choosing the color. For unique results we have to sort the fields first. Before that we have to copy the array using .slice since .sort doesnt return an array.
                                                ctx.fillStyle = hexToRGB(pallette[1][hash((node as PaperNode).fieldsOfStudy.slice().sort().join(', ')) % pallette[1].length], '1');
                                            }
                                        }else{
                                            // Node Oppacity
                                            ctx.fillStyle = `rgba(231, 156, 69, ${(((node as PaperNode).year - (new Date().getFullYear() - paperOppacityYearRange) < 0 ? lowerBoundForNodeOppacity : (1-lowerBoundForNodeOppacity)/paperOppacityYearRange * ((node as PaperNode).year - new Date().getFullYear()) + 1))})`;  
                                        }
                                        ctx.beginPath();
                                        if((node as PaperNode).isHovered){
                                            //Circle Edge Color when the Node is hovered
                                            ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
                                            ctx.lineWidth = 2;
                                        }else{
                                            //Circle Edge Color. The color doesnt matter since Alpha is 0 und thus the Edge is transparent
                                            ctx.strokeStyle = 'rgba(255, 255, 255, 0)';
                                            ctx.lineWidth = 0.5;
                                        }
                                        //Node shape (arc creates a cirle at coordinate (node.x, node.y) with radius determined in the same way as the React-Force-Graph-2d does internally to get overlapping nodes. The *4 is needed since they use a NodeRelSize Variable that we could use while creating the graph. Its Standard value is 4. Last 2 Parameters are needed to draw a full circle)
                                        ctx.arc(node.x!, node.y!, Math.sqrt(Math.max(0, (node as PaperNode).val || 1)) * 4, 0 , 2 * Math.PI);
                                        ctx.stroke();
                                        ctx.fill();
                                        if((node as PaperNode).id === props.data.paper[0].id){
                                            //Circle Edge Color for Origin Node
                                            ctx.strokeStyle = 'rgba(255, 255, 255, 1)';
                                            ctx.arc(node.x!, node.y!, Math.sqrt(Math.max(0, (node as PaperNode).val || 1)) * 4 + 0.5, 0 , 2 * Math.PI);
                                            ctx.stroke();
                                        }
                            
                                        ctx.textAlign = 'center';
                                        ctx.textBaseline = 'middle';
                                        ctx.fillStyle = 'rgba(230, 230, 230, 0.8)';
                                        ctx.fillText(label as string, node.x!, node.y!);
                                    }}
                                    nodeLabel='title'
                                    linkLabel={(link) => (link as SimilarityLinkObject).label}
                                    linkWidth={(link) => (link as SimilarityLinkObject).isHovered ? linkOnHoverWidth 
                                        : ((link as SimilarityLinkObject).similarity.map((element, index) => element * sliders[index] / totalSliderValue).reduce((x,y) => x+y)*3)}
                                    linkVisibility={(link) => 
                                        ((link as SimilarityLinkObject).similarity.map((element, index) => element * sliders[index] / totalSliderValue).reduce((x,y) => x+y) !== 0) &&
                                        ((link as SimilarityLinkObject).similarity.map((element, index) => element * sliders[index] / totalSliderValue).reduce((x,y) => x+y)) > weakLinkFilter/3}
                                    d3VelocityDecay={0.95}
                                    cooldownTicks={100}
                                    //onEngineStop={() => (fgRef.current as any).zoomToFit(400, 100)}
                                    />
                    </>
                : <Loader 
                    className='loader' 
                    content='Loading...'
                    size='md'
                    />}
            </div>
        </div>
    )
}

export default sizeMe({ monitorHeight: true })(Graph);