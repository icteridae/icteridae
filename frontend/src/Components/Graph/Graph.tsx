import * as React from 'react';
import ForceGraph2D, {GraphData, NodeObject, LinkObject} from 'react-force-graph-2d';
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

interface dummyData {
    source: {
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
        entities : string[]}[]
}

//const testData = fetch("127.0.0.1:8000").then(res => res.json()).then((result) => {} );

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

/*const genGraphOld = (N:number) => {
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
}*/

const genGraph = (data:dummyData) =>{
    return ({
            nodes: [({
                id: "0",
                name: "Origin",
                color: "00FF00",
            })].concat(data.source.map(id => ({
                id: id.id,
                name: id.title,
                color: "#FF0000"
            }))),
            links: data.source.map(id => ({
                source: "0",
                target: id.id,
                color: "FFFFFF"
            }))
        }
    )

}

/*export const Graph: React.FC = () => {
    const [dummyState, setDummyState] = React.useState<dummyData | any>(undefined);
    const [state, setState] = React.useState<GraphData>(genGraph(dummyState));
    React.useEffect(() => {
            fetch("127.0.0.1:8000")
                .then(res => res.json())
                .then(setDummyState)
        },[])*/ //Ablage

export const Graph: React.FC = () => {
    const [state, setState] = React.useState<GraphData>({nodes:[], links:[]});
    React.useEffect(() => {
            loadData();
        },[]);
    const loadData = async () => {
        const response = await fetch("127.0.0.1:8000/api/generate-graph");
        const data = await response.json();
        setState(genGraph(data));
        console.log(data.title);
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
