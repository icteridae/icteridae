import * as React from 'react';
import ForceGraph2D from 'react-force-graph-2d';
import {Button} from "rsuite";

/*const myData = {
    nodes: [
        {
            id: "id1",
            name: "Aleggz",
            color: "#FF0000"
        },
        {
            id: "id11",
            name: "AleggzMinion1",
            color: "#FF0000"
        },{
            id: "id12",
            name: "AleggzMinion2",
            color: "#FF0000"
        },{
            id: "id13",
            name: "AleggzMinion3",
            color: "#FF0000"
        },
        {
            id: "id2",
            name: "Lenny",
            color: "#00FF00",
        },
        {
            id: "id3",
            name: "Hoebelt",
            color: "#0000FF"
        },
        {
            id: "id4",
            name: "Nico",
            color: "#FFFF00",
            val: 10
        },
        {
            id: "id5",
            name: "Leon",
            color: "#00FFFF"
        }
    ],
    links: [
        {
            source: "id1",
            target: "id2",
            color: "#FFFFFF"
        },
        {
            source: "id1",
            target: "id11",
            color: "#FF0000",
            width: 5,
            curvature: -1
        },
        {
            source: "id1",
            target: "id12",
            color: "#FF0000",
            width: 1,
            arrowLen: 10
        },
        {
            source: "id1",
            target: "id13",
            color: "#FF0000",
            width: 3,
            dirParticles: 5
        },
        {
            source: "id2",
            target: "id3",
            color: "#FFFFFF"
        },
        {
            source: "id3",
            target: "id4",
            color: "#FFFFFF"
        },
        {
            source: "id4",
            target: "id5",
            color: "#FFFFFF"
        },
        {
            source: "id1",
            target: "id5",
            color: "#FFFFFF",
            width: 3
        },
    ]
};*/

/*json: {
    tensor: list[list[list[number]]] (shape: similarity_id x paper1_id x paper2_id),
    papers: list[obj : paper_obj],
    Similarities: list[obj : similarity_obj]
},*/

interface graph {
    nodes : {id: string, name: string, color: string}[],
    links : {source: string, target: string, color: string, width?: number}[]
}

const genArray = (N:number) => {
    let a = [];
    for (let i = 0; i < N; i++){
        a[i] = i;
    }
    return a;
}

const getCategories = () =>{
    let cat = [];
    cat[0] = "author";
    cat[1] = "category";
    cat[2] = "citations";
    return cat;
}

const genGraph = (N:number) => {
    return ({
        nodes: getCategories().map(id => ({
            id: id,
            name: id,
            color: "#FF00FF"
        })).concat(genArray(N).map(id => ({
            id: id.toString(),
            name: id.toString(),
            color: "#FF0000"
        }))),
        links: getCategories().map(id => ({
            source: id,
            target: "0",
            color: "#FFFFFF"
        })).concat(genArray(N).map(id => ({
            source: id.toString(),
            target: getCategories()[Math.floor(Math.random()*3)],
            color: "#FFFFFF"
        })))
    });
}

export const Graph: React.FC = () => {
    const[state, setState] = React.useState<graph>(genGraph(1));

    return(
        <div>
            <Button onClick={() => setState(({nodes, links}) : graph =>
                {const id = nodes.length;
                    return ({
                        nodes: [...nodes, { id: id.toString(), name: id.toString(), color: "#FF0000" }],
                        links: [...links, { source: id.toString(), target: getCategories()[Math.floor(Math.random()*3)], color: "#FFFFFF"}]
                    });
                })}>+1</Button>
            <Button onClick={() => setState(({nodes, links}) => ({
                nodes: nodes.slice(0,4),
                links: links.slice(0,3)
            }))}>Reset</Button>
            <ForceGraph2D graphData={state}
                          onNodeClick={(node:any, e) => {
                              e.preventDefault();
                              if (node.name === "1") {
                                  window.location.href = 'http://lenny.codes/'
                              } else {
                                  alert(node.name)
                              }
                          }}
                          linkWidth="width"
                          linkCurvature="curvature"
                          linkDirectionalArrowLength="arrowLen"
                          linkDirectionalParticles="dirParticles"/>
        </div>
                          )
}
