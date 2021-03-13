import React, { useEffect, useState } from 'react';

import { Button, Loader, Tree } from 'rsuite';
import { DropData } from 'rsuite/lib/TreePicker';

import * as TreeTypes from './TreeTypes';
import * as PaperFunctions from './PageSavedPapersFunctions';
import * as GeneralTypes from '../../Utils/GeneralTypes';
import { RenamableDirectory } from './RenameableDirectory';
import { Link } from 'react-router-dom';

import './SavedPapers.sass'

interface SavedPaperTreeProps {
    setSelectedPaper: (x: TreeTypes.PaperOrDirectoryNode | undefined) => void,
    loadedPapers: { [id: string] : GeneralTypes.Paper},
    setLoadedPapers: React.Dispatch<React.SetStateAction<{
        [id: string]: GeneralTypes.Paper;
    }>>,
}

export const SavedPapersTree: React.FC<SavedPaperTreeProps> = (props) => {
    
    const [selectedTreeNode, setSelectedTreeNode] = useState<TreeTypes.PaperOrDirectoryNode>();
    const [directoryNames, setDirectoryNames] = useState<{ [id: string] : string}>({});
    const [treeData, setTreeData] = useState<TreeTypes.PaperOrDirectoryNode[]>(
        PaperFunctions.deepMap(JSON.parse(localStorage.getItem('savedpapers') || '[]'),
        (node) => TreeTypes.isDirectoryNode(node) ? 
        {
            ...node, 
            label: <RenamableDirectory name={directoryNames.hasOwnProperty(node.value) ? directoryNames[node.value] : 'Loading...'} 
                                       setName={(val) => setDirectoryNames((directoryNames) => ({...directoryNames, [node.value]: val}))}/>//<><Icon icon='folder'/> {node.directoryName}</>
        } : {...node, value: node.paperId, label: <Loader/>}
        )
        );

    function addFolder(name: string): void {
        let newTreeData: TreeTypes.PaperOrDirectoryNode[] = PaperFunctions.createDirectory(treeData, name)
        setTreeData(newTreeData)
        setDirectoryNames(PaperFunctions.deepReduce(newTreeData, (ac, val) => TreeTypes.isDirectoryNode(val) ? {...ac, [val.value]: val.directoryName}: ac, {}))
    }

    useEffect(() => {
        PaperFunctions.loadPapers(treeData, props.setLoadedPapers)
        setDirectoryNames(PaperFunctions.deepReduce(treeData, (ac, val) => TreeTypes.isDirectoryNode(val) ? {...ac, [val.value]: val.directoryName}: ac, {}))
    }, []);

    useEffect(() => {
        setTreeData(treeData => PaperFunctions.deepMap(treeData, 
            node => (
                TreeTypes.isPaperNode(node) && props.loadedPapers.hasOwnProperty(node.paperId) ? 
                    {...node, label: 
                        <>{props.loadedPapers[node.paperId].title 
                            + ' (' 
                            + props.loadedPapers[node.paperId].authors[0].name.split(' ').slice(-1)[0] 
                            + ' ' 
                            + props.loadedPapers[node.paperId].year 
                            + ')'} </>} 
                : node
                )))
    }, [props.loadedPapers])

    useEffect(() => {
        setTreeData(treeData => PaperFunctions.deepMap(treeData,
            node => (
                TreeTypes.isDirectoryNode(node) && directoryNames.hasOwnProperty(node.value) ? {
                    ...node, 
                    label: <RenamableDirectory name={directoryNames.hasOwnProperty(node.value) ? directoryNames[node.value] : 'Loading...'} 
                                setName={(val) => setDirectoryNames((directoryNames) => ({...directoryNames, [node.value]: val}))}/>,
                    directoryName: directoryNames[node.value]
            } 
                : node
            )))
    }, [directoryNames])

    useEffect(() => {
        localStorage.setItem('savedpapers', JSON.stringify(PaperFunctions.deepMap(PaperFunctions.stripTree(treeData), (node) => (TreeTypes.isStrippedDirectoryNode(node) ? {...node, directoryName: directoryNames[node.value]} : node))))
    }, [treeData, directoryNames])

    useEffect(() => {
        if (TreeTypes.isPaperNode(selectedTreeNode)) {
            props.setSelectedPaper(selectedTreeNode)
        } else {
            props.setSelectedPaper(undefined)
        }
        
    })

    return (
        <div className="saved-papers-tree">
            <Tree
                data={treeData}
                draggable
                defaultExpandAll
                onDrop={({ createUpdateDataFunction }: DropData) => setTreeData(PaperFunctions.flattenPapers(createUpdateDataFunction(treeData)))}
                onSelect={(active) => setSelectedTreeNode(active)}
            />
            <div className="my-papers-actions">
                <Button onClick={() => addFolder('New Directory')}>
                    Create Directory
                </Button>
                <Button onClick={() => localStorage.setItem('savedpapers', JSON.stringify([]))}>
                    Reset localStorage
                </Button>
                {selectedTreeNode != null && (
                    <Button onClick={() => setTreeData(PaperFunctions.deleteTreeNode(selectedTreeNode.value, treeData))}>
                        Delete
                    </Button>
                )}
                {TreeTypes.isPaperNode(selectedTreeNode) && (
                    <Link to={`/graph/${selectedTreeNode.paperId}`}>Load Graph</Link>
                )}
            </div>
        </div>
    );
};
