import * as React from 'react';
import ForceGraph2D from 'react-force-graph-2d';

const testPaper = {
    source: {
        title: "Test Paper 1",
        authors: [
            "Alexander Sinkovic",
            "Lennart Mischnaewski",
            "Dennis Hoebelt",
            "Nico Kunz",
            "Leon Petri",
            "Papa Sucuk"
        ]
    }
}

const myDataBasic = {
    nodes: [
        {
            id: "id1",
            name: "Aleeggz",
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
};

const genTree = () => {
    return {
        nodes: ,
        links:
    };

};



const myData = genTree();

export const Graph: React.FC = () => (
    <ForceGraph2D graphData={myData}
                  onNodeClick={(node:any , e)=>{
                      e.preventDefault();
                      if (node.name === "Lenny"){
                          window.location.href='http://lenny.codes/'
                      }else{
                          alert(node.name)
                      }}}
                  linkWidth="width"
                  linkCurvature="curvature"
                  linkDirectionalArrowLength="arrowLen"
                  linkDirectionalParticles="dirParticles">
    </ForceGraph2D>
);
