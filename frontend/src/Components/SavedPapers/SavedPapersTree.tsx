import React, { useEffect, useState } from 'react';

import { Button, Loader, Tree, Icon} from 'rsuite';
import { DropData } from 'rsuite/lib/TreePicker';

import * as TreeTypes from './TreeTypes';
import * as PaperFunctions from './PageSavedPapersFunctions';
import * as GeneralTypes from '../../Utils/GeneralTypes';
import { RenamableDirectory } from './RenameableDirectory';
import { Link } from 'react-router-dom';

import './SavedPapers.sass'


export const SavedPapersTree: React.FC<{setSelectedPaper: Function}> = (props) => {
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
    // do not update on treeData change as this would create an infinite loop
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        setTreeData(treeData => PaperFunctions.deepMap(treeData, 
            node => (
                TreeTypes.isPaperNode(node) && loadedPapers.hasOwnProperty(node.paperId) ? 
                    {...node, 
                    label: (
                        <div className="tree-node">
                            {loadedPapers[node.paperId].title 
                                + ' (' 
                                + loadedPapers[node.paperId].authors[0].name.split(' ').slice(-1)[0] 
                                + ' ' 
                                + loadedPapers[node.paperId].year 
                                + ')'
                            }
                            {(node.paperId == selectedTreeNode?.value) &&
                                <button className='delete-button' onClick={() => setTreeData(PaperFunctions.deleteTreeNode(selectedTreeNode.value, treeData))}>
                                    <Icon icon='trash'/>
                                </button>
                            }
                        </div>
                    ),
                        } 
                : node
                )))
    }, [loadedPapers, selectedTreeNode])

    useEffect(() => {
        setTreeData(treeData => PaperFunctions.deepMap(treeData,
            node => (
                TreeTypes.isDirectoryNode(node) && directoryNames.hasOwnProperty(node.value) ? {
                    ...node, 
                    label: (
                        <div className="tree-node">
                            <RenamableDirectory 
                                name={directoryNames.hasOwnProperty(node.value) ? directoryNames[node.value] : 'Loading...'} 
                                setName={(val) => setDirectoryNames((directoryNames) => ({...directoryNames, [node.value]: val}))}
                            />
                            {(node.value == selectedTreeNode?.value) && 
                                <button className='delete-button' onClick={() => setTreeData(PaperFunctions.deleteTreeNode(selectedTreeNode.value, treeData))}>
                                    <Icon icon='trash'/>
                                </button>
                            }
                        </div>
                    ),
                    directoryName: directoryNames[node.value]
            } 
                : node
            )));
            console.log(selectedTreeNode);
    }, [directoryNames, selectedTreeNode])

    useEffect(() => {
        localStorage.setItem('savedpapers', JSON.stringify(PaperFunctions.deepMap(PaperFunctions.stripTree(treeData), (node) => (TreeTypes.isStrippedDirectoryNode(node) ? {...node, directoryName: directoryNames[node.value]} : node))))
    }, [treeData, directoryNames])

    return (
        <div className="saved-papers-tree">
            <Tree
                data={treeData}
                draggable={// Used to prevent dragging before tree has loaded. Decreases chance of some weird bug occuring where localstorage is emptied is minimized
                    Object.keys(loadedPapers).length > 0 || PaperFunctions.getSubtreePaperIds(treeData).length === 0} 
                defaultExpandAll
                onDrop={({ createUpdateDataFunction }: DropData) => setTreeData(PaperFunctions.flattenPapers(createUpdateDataFunction(treeData)))}
                onSelect={(active) => {setSelectedTreeNode(active);props.setSelectedPaper(loadedPapers[active.paperId])}}
            />
            <div className="my-papers-actions">
                <Button onClick={() => addFolder('New Directory')}>
                    Create Directory
                </Button>
                <Button onClick={() => localStorage.setItem('savedpapers', JSON.stringify([]))}>
                    Reset localStorage
                </Button>
                {TreeTypes.isPaperNode(selectedTreeNode) && (
                    <Link to={`/graph/${selectedTreeNode.paperId}`}>Load Graph</Link>
                )}
            </div>
        </div>
    );
};
