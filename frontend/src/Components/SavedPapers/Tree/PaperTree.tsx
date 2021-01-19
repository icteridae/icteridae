import * as React from 'react';
import {Tree, Icon} from 'rsuite';
import {getSavedPapers, setSavedPapers} from "../../../Utils/Webstorage";
import Config from '../../../Utils/Config'

type TreeType = {label?: string, value: string, children?: TreeInterface[], id? :string};
interface TreeInterface extends TreeType {};

const data : TreeInterface[]= [
        {
            "label": /*<div><Icon icon='folder'/> Folder1</div> */ "Folder 1",
            "value": "d1",
        },
        {
            "id": "f977b5310ba86074d2be0fb86553b418a24a9273",
            "value": "p2",
        },
        {
            "label": /*<div><Icon icon='folder'/> Folder3</div>*/ "Folder 3",
            "value": "d3",
            "children": [{
                "id": "f977b5310ba86074d2be0fb86553b418a24a9273",
                "value": "p4",
            }, {
                "id": "3dd133251dffdc9480bed899bd62050f086bf43e",
                "value": "p5",
            }
            ]
        }
]

const CreatePaperTreeData = (tree : Array<TreeInterface>) => {
    console.log(tree);
    for(let item in tree) {
        //console.log(tree[item]);
        if(tree[item].value.charAt(0) === 'p')
        {
            const baseURL : string = Config.base_url;
            fetch(baseURL +"/api/paper/?paper_id=" + tree[item].id)
                .then(res => res.json())
                .then(res => {
                    tree[item].label = res.title;
                })
        } else if (tree[item].value.charAt(0) === "d") {
            if (tree[item].children) {
                //@ts-ignore
                tree[item].children = CreatePaperTreeData(tree[item].children);
            }
        }
    }
    return tree;
}

const PaperTree: React.FC<{choosePaper: Function, height: number}> = (props ) => {
    const [treeData, setTreeData] = React.useState(CreatePaperTreeData(getSavedPapers()));
    return (
        <Tree
            data={treeData}
            draggable
            defaultExpandAll
            onDrop={
                ({dropNode, dropNodePosition , createUpdateDataFunction} : any, event : any) => {
                    const v = createUpdateDataFunction(treeData);
                    setTreeData(fixTree({value: 'd', children: v})[0].children);
                    setSavedPapers(treeData);
                }
            }
            onSelect={(active, value, event) => (
                props.choosePaper(active)
            )}
            height={props.height*20}
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
