import * as React from 'react';

import { getSavedPapers, setSavedPapers } from '../../../Utils/Webstorage';
import Config from '../../../Utils/Config';

import { Tree, Icon, Button } from 'rsuite';
import { useEffect } from 'react';

/*
Recursive Type to descripe a Tree Object. The children-attribute is only used by folders, id by papers
*/
export interface TreeInterface { label?: any;
    value: string;
    children?: TreeInterface[];
    id?: string;
    name?: string
}

/*temporrary Treedata as an example */
const data: TreeInterface[] = [
    {
        name: "Folder 1",
        value: "d1",
        children: [],
    },
    {
        id: "ebe84b47c84537f3d536aed004955799c2f212a0",
        value: "p2",
    },
    {
        name: "Folder 3",
        value: "d3",
        children: [
            {
                id: "5b5df4500756561e3d15a8a10958d6575ab3bc28",
                value: "p4",
            },
            {
                id: "0c70c3a504a3c8b46cc02d1c290d93bfe84f7651",
                value: "p5",
            },
        ],
    },
];

/**
 * fix the tree after changing the position of an TreeInterface Object
 * @param tree, the tree to fix
 */
const fixTree = (tree: TreeInterface): ConcatArray<TreeInterface> => {
    const isFolder = tree.value.charAt(0) === 'd';
    if (!tree.children) return [tree];
    if (isFolder)
        return [
            {
                name: tree.name,
                label: tree.label,
                value: tree.value,
                children: ([] as Array<TreeInterface>).concat(...tree.children.map(fixTree)) as Array<TreeInterface>,
            },
        ];
    return ([
        {
            label: tree.label,
            value: tree.value,
            id: tree.id,
        },
    ] as Array<TreeInterface> ).concat(...tree.children.map(fixTree));
};

/**
 * fetching paper name from the server, adding folder icons, renaming folders, getting an Array of Folderids
 * @param tree: Array of TreeInterface representing the raw tree-data
 * @param promises: Array of Promises to store the fetched data for reloading the tree when fetching is done
 * @param name: String, if not '', Folder with the value @param id is renamed to name 
 */
const createPaperTreeData = (tree: Array<TreeInterface>, promises: Array<Promise<string | void>>, name: string, id: string ): Array<TreeInterface> => {
    for (let item in tree) {
        if (tree[item].value.charAt(0) === 'p') {
            const baseURL: string = Config.base_url;
            promises.push(
                fetch(baseURL + '/api/paper/?paper_id=' + tree[item].id)
                    .then((res) => res.json())
                    .then((res) => {
                        tree[item].label = res.title;
                    })
            );
        } else if (tree[item].value.charAt(0) === 'd') {
            //Renaming a folder
            if (tree[item].value === id) {
                tree[item].label = (
                    <div>
                        <Icon icon='folder'></Icon> {name}
                    </div>
                );
                tree[item].name = name;
            } else {
                tree[item].label = (
                    <div>
                        <Icon icon='folder'></Icon> {tree[item].name}
                    </div>
                );
            }
            tree[item].children = createPaperTreeData(tree[item].children!, promises, name, id );
        }
    }
    return tree;
};

/**
 * Deletes unnecessary data to storage from tree. Also deletes folder and paper
 * @param tree represents the tree data
 * @param shouldDelete if a folder or paper should be deleted the value is true
 * @param toDelete is the value of the paper or folder which should be deleted
 */
const DeletePaperTreeData = (tree: Array<TreeInterface>, shouldDelete: boolean, toDelete : string) => {
    let temp: Array<TreeInterface> = [];
    for (let item in tree) {
        if(shouldDelete && tree[item].value === toDelete) {
            continue;
        }
        if (tree[item].value.charAt(0) === 'p') {
            temp.push({ id: tree[item].id, value: tree[item].value });
        } else if (tree[item].value.charAt(0) === 'd') {
            let children: Array<TreeInterface> = [];
            if (!(typeof tree[item].children == 'undefined'))
                children = DeletePaperTreeData(tree[item].children!, shouldDelete, toDelete);
            temp.push({
                value: tree[item].value,
                name: tree[item].name,
                children: children,
            });
        }
    }
    return temp;
};

 /**
     * Saves the tree to the webstorage
     * @param treeData the treeData to store the tree 
     */
    export const saveTree = (treeData: Array<TreeInterface>) => {
        let tree: Array<TreeInterface>;
        tree = DeletePaperTreeData(treeData, false, '');
        setSavedPapers(tree);
    };

/**
 * React component to show the folder-structure of the saved papers
 * @param props representing the properties needed for the tree such as choosePaper, if a paper is clicked on, the height of the Element, the name of a folder to rename it, the id of a folder to rename it and
 * the folderid to delete a paper(toDelete)
 */
export const PaperTree: React.FC<{choosePaper: Function; height: number; name: string; id: string; toDelete: string; tree: Array<TreeInterface>}> = (props) => {
    const [treeData, setTreeData] = React.useState(props.tree);

    /**
     * Effect hook when a folder gets a new name
     */
    useEffect(() => {
        helperFunction(false, props.tree);        
    }, [props.name, props.tree]);

    
    /**
     * Effect hook when a folder or paper should be deleted
     */
    useEffect(() => {
        helperFunction(true, treeData);
    }, [props.toDelete]);

    /**
     * A function for manipulating the tree data (renaming a folder or deleting a paper or folder)
     * @param shouldDelete if the function is called to delete a folder
     */
    const helperFunction = (shouldDelete: boolean, tree:Array<TreeInterface>) => {
        let promises: Array<Promise<string | void>> = [];
        tree = DeletePaperTreeData(tree, shouldDelete, props.toDelete);

        createPaperTreeData(tree, promises, props.name, props.id);
        Promise.all(promises).then(() => {
            setTreeData(tree);
            saveTree(tree);
        });
    }

   
    return (
        <div>
            <Tree
                data={treeData}
                draggable
                defaultExpandAll
                virtualized={false}
                onDrop={(
                    { dropNode, dropNodePosition, createUpdateDataFunction }: any,
                    event: any
                ) => {
                    const v = createUpdateDataFunction(treeData);
                    const c = fixTree({ value: 'd', children: v })[0].children;
                    setTreeData(c!);
                    saveTree(c!);
                }}
                onSelect={(active, value, event) => props.choosePaper(active)}
                height={props.height}
            />
           
        </div>
    );
};
