import * as React from 'react';
import {Tree, Icon} from 'rsuite';
import {getSavedPapers, setSavedPapers} from "../../../Utils/Webstorage";
import Config from '../../../Utils/Config'
import {useEffect} from "react";

type TreeType = {label?: any, value: string, children?: TreeInterface[], id? :string};
interface TreeInterface extends TreeType {};

const CreatePaperTreeData = (tree : Array<TreeInterface>) => {
    console.log("Create Paper Tree  " + tree);
    for(let item in tree) {
        if(tree[item].value.charAt(0) === 'p')
        {
            const baseURL : string = Config.base_url;
            fetch(baseURL +"/api/paper/?paper_id=" + tree[item].id)
                .then(res => res.json())
                .then(res => {
                    tree[item].label = res.title;
                })
        } else if (tree[item].value.charAt(0) === "d") {
            tree[item].label = (<div><Icon icon='folder'/> {tree[item].label}</div>);
            if (tree[item].children) {
                //@ts-ignore
                tree[item].children = CreatePaperTreeData(tree[item].children);
            }
        }
    }
    return tree;
}

const MakeTreeSaveFriendly = (tree : Array<TreeInterface>) => {
    console.log("make Tree Save Friendly" );
    console.log(tree);
}

const data : TreeInterface[]= [
    {
        "label": "Folder 1",
        "value": "d1",
        "children" : []
    },
    {
        "id": "a7f9dd2edae1a87e27b6ce3bb2f6661395b71390",
        "value": "p2",
    },
    {
        "label": "Folder 3",
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



const PaperTree: React.FC<{choosePaper: Function, height: number}> = (props ) => {
    const [treeData, setTreeData] = React.useState(data);

    useEffect(() => {
        setTreeData(CreatePaperTreeData(treeData));
    }, []);


    return (
        <Tree
            data={treeData}
            draggable
            defaultExpandAll
            onDrop={
                ({dropNode, dropNodePosition , createUpdateDataFunction} : any, event : any) => {
                    const v = createUpdateDataFunction(treeData);
                    //@ts-ignore
                    setTreeData(fixTree({value: 'd', children: v})[0].children);
                    MakeTreeSaveFriendly(treeData);
                }
            }
            onSelect={(active, value, event) => (
                props.choosePaper(active)
            )}
            height={props.height*20}
        />
    );
}

const fixTree = (tree: any) : Array<TreeInterface> => {
    const isFolder = tree.value.charAt(0) === 'd';
    if (!tree.children) return [tree]
    if (isFolder) return [{
        'label': tree.label,
        'value': tree.value,
        'children': [].concat(...tree.children.map(fixTree))
    } ]
    return [{
        'label': tree.label,
        'value': tree.value,
        'id' : tree.id
    }].concat(...tree.children.map(fixTree))
};

export default PaperTree;
