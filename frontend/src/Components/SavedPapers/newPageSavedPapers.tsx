import React, { useEffect, useState } from 'react';

import { Button, Loader, Tree } from 'rsuite';
import { DropData } from 'rsuite/lib/TreePicker';

import * as TreeTypes from './TreeTypes';
import * as PaperFunctions from './PageSavedPapersFunctions';
import * as GeneralTypes from '../../Utils/GeneralTypes';
import { RenamableDirectory } from './RenameableDirectory';
import { Link } from 'react-router-dom';

import './paper.scss'

const testData: TreeTypes.StrippedPaperOrDirectoryNode[] = 
[
    {
        value: 'd1',
        directoryName: 'a test directory',
        children: [
            {
                paperId: 'a2e87fad8a1430e52e8c3cc3dcb66cb47b62bffc',
            },
            {
                value: 'd2',
                directoryName: 'another test directory',
                children: [
                    {
                        paperId: 'f8cd82997f35e86c862225395e52fe45c0580910',
                    },
                ],
            },
        ],
    },
    { 
        paperId: '9165b228d0cc7ee9f8b5c32ab10753d3cd2d3a6c'
    }
];

export const NewPageSavedPapers: React.FC = () => {

    
    const [selectedTreeNode, setSelectedTreeNode] = useState<TreeTypes.PaperOrDirectoryNode>();
    const [loadedPapers, setLoadedPapers] = useState<{ [id: string] : GeneralTypes.Paper}>({})
    const [directoryNames, setDirectoryNames] = useState<{ [id: string] : string}>({})
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
        PaperFunctions.loadPapers(treeData, setLoadedPapers)
        setDirectoryNames(PaperFunctions.deepReduce(treeData, (ac, val) => TreeTypes.isDirectoryNode(val) ? {...ac, [val.value]: val.directoryName}: ac, {}))
    }, []);

    useEffect(() => {
        setTreeData(treeData => PaperFunctions.deepMap(treeData, 
            node => (
                TreeTypes.isPaperNode(node) && loadedPapers.hasOwnProperty(node.paperId) ? {...node, label: <>{loadedPapers[node.paperId].title}</>} 
                : node
                )))
    }, [loadedPapers])

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

    return (
        <div className="page-my-papers">
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
                <Button onClick={() => localStorage.setItem('savedpapers', JSON.stringify(testData))}>
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
