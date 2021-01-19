import * as React from 'react';
import {Tree, Icon} from 'rsuite';
import {getSavedPapers} from "../../../Utils/Webstorage";
import Config from '../../../Utils/Config'

const data = [
    {
        "label": <div><Icon icon='folder'/> Folder1</div>,
        "value": "d1",
    },
    {
        "label": "f977b5310ba86074d2be0fb86553b418a24a9273",
        "value": "p2",
    },
    {
        "label": <div><Icon icon='folder'/> Folder3</div>,
        "value": "d3",
        "children": [{
            "label": "f977b5310ba86074d2be0fb86553b418a24a9273",
            "value": "p4",
        },{
            "label": "3dd133251dffdc9480bed899bd62050f086bf43e",
            "value": "p5",
        }
        ]
    }
]

const CreatePaperTreeData = (tree : any) => {
    const baseURL : string = Config.base_url;
    if(tree.value.charAt(0) === 'p') {
        const id = tree.label;
        fetch(baseURL+"/api/paper/?paper_id=" + id)
            .then(res => res.json())
            .then(res => tree.label = res.title)
    }
    else if (tree.value.charAt(0) === 'd' && tree.children) {
         tree.children = CreatePaperTreeData(tree.children);
    }
    return tree;
}

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
