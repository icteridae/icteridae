import Config from "../../Utils/Config";
import { Icon } from 'rsuite';
import * as TreeTypes from './TreeTypes';
import * as GeneralTypes from '../../Utils/GeneralTypes'

const folderIcon = <Icon icon='folder'></Icon>

export function loadPapers(treeData: TreeTypes.PaperOrDirectoryNode[], setLoadedPapers: React.Dispatch<React.SetStateAction<{
    [id: string]: GeneralTypes.Paper;
}>>) {
        let paper_ids : string[] = getSubtreePaperIds(treeData);
        fetch(Config.base_url + '/api/paper_bulk/', 
            {
                method: 'POST',
                body: JSON.stringify({paper_ids: paper_ids}),
            })
            .then(result => result.json())
            .then(result => result
                .reduce(
                    (accumulator: { [id: string] : string}, current: GeneralTypes.Paper) => ({...accumulator, [current.id]: current}), 
                    {}))
            .then(setLoadedPapers)
}

export function getSubtreePaperIds(node: TreeTypes.PaperOrDirectoryNode[]): string[] {
    
    return node.map(
        node => TreeTypes.isPaperNode(node) ? node.paperId
                : TreeTypes.hasChildren(node) ? getSubtreePaperIds(node.children) 
                : []
    ).flat()
    
}

export function createDirectory(treeData: TreeTypes.PaperOrDirectoryNode[], directoryName: string): TreeTypes.PaperOrDirectoryNode[]{
    let temp = [...treeData];
    temp.push({
        value: generateNewDirectoryValue(),
        directoryName: directoryName,
        label: <>{folderIcon} New Folder</>,
        children: []
    });
    return temp;
}

export function stripTree(nodes: TreeTypes.PaperOrDirectoryNode[]): TreeTypes.StrippedPaperOrDirectoryNode[] {
    return nodes.filter(node => TreeTypes.isPaperNode(node) || TreeTypes.isDirectoryNode(node))
                .map(
                    node => TreeTypes.isPaperNode(node) ? {paperId: node.paperId} as TreeTypes.StrippedPaperNode
                            : (TreeTypes.hasChildren(node) ? {
                                value: node.value,
                                children: stripTree(node.children),
                                directoryName: node.directoryName
                            } as TreeTypes.StrippedDirectoryNode  
                            :  {
                                value: node.value,
                                directoryName: node.directoryName
                            } as TreeTypes.StrippedDirectoryNode )
    )
}

export function getLoadPaperPromises(nodes: TreeTypes.PaperOrDirectoryNode[], promises: any[]) {
    nodes.forEach(node => 
        TreeTypes.isPaperNode(node) ? promises.push(node.paperId) 
        : TreeTypes.isDirectoryNode(node) && node.children && getLoadPaperPromises(node.children, promises)
    );
}   

export function generateNewDirectoryValue(): string {
    return new Date().valueOf().toString();
}

export function renameDirectory(value: string, newName: string, treeData: TreeTypes.PaperOrDirectoryNode[], setTreeData: React.Dispatch<React.SetStateAction<TreeTypes.PaperOrDirectoryNode[]>>) {
    
    function renameDirectoryRecursively (nodes: TreeTypes.PaperOrDirectoryNode[], value: string, newName: string) : TreeTypes.PaperOrDirectoryNode[] {
        let r = nodes
            .map(node =>
                TreeTypes.isDirectoryNode(node) && node.value === value
                    ? {
                        ...node,
                        directoryName: newName,
                        label: <>{folderIcon} {newName}</>
                    }
                    : node
            )
            .map(node =>
                TreeTypes.isDirectoryNode(node) && node.children
                    ? {
                        ...node,
                        children: renameDirectoryRecursively(node.children, value, newName)
                    }
                    : node
            );
        return r;
    }
        
    let temp = [...treeData];
    temp = renameDirectoryRecursively(temp, value, newName);
    setTreeData(temp);
}

export function deleteTreeNode(value: string, treeData: TreeTypes.PaperOrDirectoryNode[]) {
    function filterNodeRecursively(nodes: TreeTypes.PaperOrDirectoryNode[], value: string) : TreeTypes.PaperOrDirectoryNode[] {
        let r = nodes
            .filter(node => node.value !== value)
            .map(node =>
                TreeTypes.isDirectoryNode(node) && node.children
                    ? {
                          ...node,
                          children: filterNodeRecursively(node.children, value)
                      }
                    : node
            );
        return r;
    }

    return filterNodeRecursively(treeData, value);
}

export function flattenPapers(tree: TreeTypes.PaperOrDirectoryNode[]): TreeTypes.PaperOrDirectoryNode[] {

    function flattenPapersRec (node: TreeTypes.PaperOrDirectoryNode): TreeTypes.PaperOrDirectoryNode[] {
        return TreeTypes.isDirectoryNode(node) && TreeTypes.hasChildren(node) ? [{...node, children: node.children.map(child => flattenPapersRec(child)).flat(1)}]
            : TreeTypes.isPaperNode(node) && TreeTypes.hasChildren(node) ? ([{
                label: node.label,
                value: node.value,
                paperId: node.paperId
            }] as TreeTypes.PaperOrDirectoryNode[]).concat(...node.children!.map(child => flattenPapersRec(child)))
            : [node] 
    }

    let rootTree: TreeTypes.DirectoryNode = {label: <div/>, value: '', directoryName: '', children: tree}

    let flattenedTree: TreeTypes.PaperOrDirectoryNode[] = flattenPapersRec(rootTree)

    return flattenedTree[0].children!

}

export function deepMap<T extends TreeTypes.BaseTreeNode>(tree: T[], method: (param: T) => T): T[] {
    return tree.map(node => 
        TreeTypes.hasChildren(node) ? {...method(node), children: deepMap<T>((node.children as T[])!, method)} 
        : method(node))
}

export function deepFilter<T extends TreeTypes.BaseTreeNode>(tree: T[], method: (param: T) => boolean): T[] {
    return tree.filter(node => method(node))    
                .map(node => 
                    TreeTypes.hasChildren(node) ? {...node, children: deepFilter<T>((node.children as T[])!, method)} 
                    : node)
}

export function deepReduce<T>(tree: TreeTypes.PaperOrDirectoryNode[], method: (accumulator: T, value: TreeTypes.PaperOrDirectoryNode) => T, base: T): T {

    return tree.reduce(
        (previousValue: T, currentValue: TreeTypes.PaperOrDirectoryNode) => 
            TreeTypes.hasChildren(currentValue) 
                ? deepReduce(currentValue.children!, method, method(previousValue, currentValue))
                : method(previousValue, currentValue),
            base)

}