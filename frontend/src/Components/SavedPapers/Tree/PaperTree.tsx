import * as React from 'react';
import {Tree, Icon} from 'rsuite';

const data = [
    {
        "label": <div><Icon icon='folder'/> Folder1</div>,
        "value": "d1",
        "isFolder": true
    },
    {
        "label": "Thing 2",
        "value": "p2",
        "link": 5,
        "isFolder": false
    },
    {
        "label": <div><Icon icon='folder'/> Folder3</div>,
        "value": "d3",
        "isFolder": true,
        "children": [{
            "label": "Thing 4",
            "value": "p4",
            "link": 6,
            "isFolder": false
        },{
            "label": "Thing 5",
            "value": "p5",
            "link": 7,
            "isFolder": false
        }
        ]
    }

]

const PaperTree: React.FC<{choosePaper: Function, height: number}> = (props ) => {
    const [treeData, setTreeData] = React.useState(data);
    return (
        <Tree
            data={treeData}
            draggable
            defaultExpandAll
            onDrop={
                ({dropNode, dropNodePosition , createUpdateDataFunction} : any, event : any) => {
                    const v = createUpdateDataFunction(treeData);
                    return setTreeData(fixTree({value: 'd', children: v})[0].children)
                }
            }
            onSelect={(active, value, event) => (
                props.choosePaper(active)
            )}
            height={props.height}
        />
    );
}

const fixTree = (tree: any) => {
    const isFolder = tree.value.charAt(0) === 'd';
    if (!tree.children) return [tree]
    if (isFolder) return [{
        'label': tree.label,
        'value': tree.value,
        'children': [].concat(...tree.children.map(fixTree))
    }]
    return [{
        'label': tree.label,
        'value': tree.value
    }].concat(...tree.children.map(fixTree))
};

export default PaperTree;
