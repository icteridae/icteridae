import React, { useEffect } from 'react';

import { Tree, Icon } from 'rsuite';

import { setSavedPapers } from '../../Utils/Webstorage';

import Config from '../../Utils/Config';

/**
 * Recursive type describing a tree node. The children-attribute is only used by folders, id by papers
 * @param label For Papers: Title of paper, For folders: Icon and name of folder
 * @param value Internal ID for papers and folders, folder ids start with a d(irectory) and paper ids with a p(aper), needs to be named value because rsuite
 * @param children The children of a Treenode
 * @param paperId The external ID of a paper, used to get information about papers through backend requests
 * @param name The Name of a folder
 */
export interface TreeNode { 
    label?: any;
    value: string;
    children?: TreeNode[];
    paperId?: string;
    folderName?: string;
}

/**
 * Fix the tree after changing the position of a TreeNode Object
 * @param tree, the tree to fix
 */
const fixTree = (tree: TreeNode): ConcatArray<TreeNode> => {
    const isFolder = tree.value.charAt(0) === 'd';
    if (!tree.children) return [tree];
    if (isFolder) {
        return [
            {
                folderName: tree.folderName,
                label: tree.label,
                value: tree.value,
                children: ([] as Array<TreeNode>).concat(...tree.children.map(fixTree)) as Array<TreeNode>,
            },
        ];
    }
        
    return ([
        {
            label: tree.label,
            value: tree.value,
            paperId: tree.paperId,
        }
    ] as Array<TreeNode>).concat(...tree.children.map(fixTree));
};

/**
 * Fetch paper name from the server, add folder icons, rename folders, get an Array of folderIds
 * @param tree: Array of TreeNodes representing the raw tree-data
 * @param promises: Array of Promises to store the fetched data for reloading the tree when fetching is done
 * @param renameFolderTo: String, if not '', Folder with the common ID of folderId is renamed to name
 * @param folderId: Common ID of the folder to be renamed
 */
const createPaperTreeData = (tree: Array<TreeNode>, promises: Array<Promise<string | void>>, renameFolderTo: string, folderId: string ): Array<TreeNode> => {
    for (let item in tree) {
        if (tree[item].value.charAt(0) === 'p') {
            const baseURL: string = Config.base_url;
            promises.push(
                fetch(baseURL + '/api/paper/?paper_id=' + tree[item].paperId)
                    .then((res) => res.json())
                    .then((res) => {
                        tree[item].label = res.title;
                    })
            );
        } else if (tree[item].value.charAt(0) === 'd') {
            //Renaming a folder
            if (tree[item].value === folderId) {
                tree[item].label = (
                    <div>
                        <Icon icon='folder'></Icon> {renameFolderTo}
                    </div>
                );
                tree[item].folderName = renameFolderTo;
            } else {
                tree[item].label = (
                    <div>
                        <Icon icon='folder'></Icon> {tree[item].folderName}
                    </div>
                );
            }
            tree[item].children = createPaperTreeData(tree[item].children!, promises, renameFolderTo, folderId);
        }
    }
    return tree;
};

/**
 * Delete unnecessary data to storage from tree. Also deletes folder and paper
 * @param tree represents the tree data
 * @param shouldDelete if a folder or paper should be deleted the value is true
 * @param toDelete is the value of the paper or folder which should be deleted
 */
const deletePaperTreeData = (tree: Array<TreeNode>, shouldDelete: boolean, toDelete : string) => {
    let temp: Array<TreeNode> = [];
    for (let item in tree) {
        if(shouldDelete && tree[item].value === toDelete) {
            continue;
        }
        if (tree[item].value.charAt(0) === 'p') {
            temp.push({ paperId: tree[item].paperId, value: tree[item].value });
        } else if (tree[item].value.charAt(0) === 'd') {
            let children: Array<TreeNode> = [];
            if (!(typeof tree[item].children == 'undefined'))
                children = deletePaperTreeData(tree[item].children!, shouldDelete, toDelete);
            temp.push({
                value: tree[item].value,
                folderName: tree[item].folderName,
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
export const saveTree = (treeData: Array<TreeNode>) => {
    let tree: Array<TreeNode>;
    tree = deletePaperTreeData(treeData, false, '');
    setSavedPapers(tree);
};

/**
 * @param selectPaper Function receiving the currently selected element
 * @param treeHeight The height of the tree
 * @param newFolderName The name of a folder to be renamed to,
 * @param folderId The id of a folder to be renamed
 * @param elementToDelete The id of a element to be deleted from the tree
 * @param tree The tree to be displayed
 */
interface PaperTreeProps {
    selectPaper: Function;
    treeHeight: number;
    elementToDelete: string;
    tree: Array<TreeNode>
    folderRename: {folderId: string, newName: string}
}

/**
 * React component to show the folder-structure of the saved papers
 */
export const PaperTree: React.FC<PaperTreeProps> = (props) => {
    const [treeData, setTreeData] = React.useState(props.tree);

    /**
     * Effect hook when a folder gets a new name
     */
    useEffect(() => {
        helperFunction(false, props.tree);     
    }, [props.folderRename, props.tree]);

    /**
     * Effect hook when a folder or paper should be deleted
     */
    useEffect(() => {
        helperFunction(true, treeData);
    }, [props.elementToDelete]);

    /**
     * A function for manipulating the tree data (renaming a folder or deleting a paper or folder)
     * @param shouldDelete if true, deletes the element in the three that represents props.elementToDelete
     */
    const helperFunction = (shouldDelete: boolean, tree:Array<TreeNode>) => {
        let promises: Array<Promise<string | void>> = [];
        tree = deletePaperTreeData(tree, shouldDelete, props.elementToDelete);

        createPaperTreeData(tree, promises, props.folderRename.newName, props.folderRename.folderId);
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
                    const fixedTree = fixTree({value: 'd', children: createUpdateDataFunction(treeData)})[0].children;
                    setTreeData(fixedTree!);
                    saveTree(fixedTree!);
                }}
                onSelect={(active, value, event) => props.selectPaper(active)}
                height={props.treeHeight}
            />
        </div>
    );
};
