import * as React from 'react';
import ForceGraph2D, {GraphData, NodeObject, LinkObject} from 'react-force-graph-2d';
import {Button} from "rsuite";


interface paper {
    id : string,
    title : string,
    paperAbstract : string,
    authors : {name: string, ids : string[]}[],
    inCitations : string[],
    outCitations : string[],
    year : number,
    s2Url : string,
    sources : string[],
    pdfUrls : string[],
    venue : string,
    journalName : string,
    journalVolume : string,
    journalPages : string,
    doi : string,
    doiUrl : string,
    pmid : string,
    fieldsOfStudy : string[],
    magId : string,
    s2PdfUrl : string,
    entities : string[]
}

interface similarity{
    name: string,
    description: string
}

interface papersAndSimilarities{
    tensor: number[][][],
    paper: paper[],
    similarities: similarity[]
}

const getCategories = () =>{
    let cat = [];
    cat[0] = "author";
    cat[1] = "category";
    cat[2] = "citations";
    return cat;
}

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

export const Graph: React.FC = () => {
    const [state, setState] = React.useState<GraphData>({nodes:[], links:[]});
    React.useEffect(() => {
            loadData();
        },[]);
    const loadData = async () => {
        const response = await fetch("http://127.0.0.1:8000/api/generate_graph/?paper_id=d3ff20bc1a3bb222099ef652c65d494901620908");
        const data = await response.json();
        setState(genGraph(data));
    }

    return(
        <div>
            <Button onClick={() => setState(({nodes, links}) : GraphData =>
                {const id = nodes.length;
                    return ({
                        nodes: [...nodes, ({ id: id.toString(), name: id.toString(), color: "#FF0000" } as NodeObject)],
                        links: [...links, ({ source: id.toString(), target: getCategories()[Math.floor(Math.random()*3)], color: "#FFFFFF"} as LinkObject)]
                    });
                })}>+1</Button>
            <Button onClick={() => setState(({nodes, links}) => ({
                nodes: nodes.slice(0,4),
                links: links.slice(0,3)
            }))}>Reset</Button>
            <ForceGraph2D graphData={state}
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
                          linkDirectionalParticles="dirParticles"/>
        </div>
                          )
}
