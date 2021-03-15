import React, { useEffect, useState, useRef } from 'react';

import { Button, Loader, Tree, Icon, Input, Modal } from 'rsuite';
import { DropData } from 'rsuite/lib/TreePicker';

import * as TreeTypes from './TreeTypes';
import * as PaperFunctions from './PageSavedPapersFunctions';
import * as GeneralTypes from '../../Utils/GeneralTypes';

import './SavedPapers.sass'


export const SavedPapersTree: React.FC<{setSelectedPaper: Function}> = (props) => {
    const [selectedTreeNode, setSelectedTreeNode] = useState<TreeTypes.PaperOrDirectoryNode>();
    const [isRenaming, setIsRenaming] = useState<boolean>(false);
    const [loadedPapers, setLoadedPapers] = useState<{ [id: string] : GeneralTypes.Paper}>({})
    const [directoryNames, setDirectoryNames] = useState<{ [id: string] : string}>({})
    const [showModal, setShowModal] = useState<boolean>(false);
    const renameInputRef = useRef(null);
    const [treeData, setTreeData] = useState<TreeTypes.PaperOrDirectoryNode[]>(
        PaperFunctions.deepMap(JSON.parse(localStorage.getItem('savedpapers') || '[]'),
        (node) => TreeTypes.isDirectoryNode(node) ? 
        {
            ...node, 
            label: (<div className="folder">
                        {// Render Inputfield if renaming
                            directoryNames.hasOwnProperty(node.value) ? (
                            isRenaming && (node.value === selectedTreeNode?.value) ? 
                                <Input
                                    id='tree-node-folder-rename-input'
                                    value={directoryNames[node.value]} 
                                    onChange={(val:string) => {setDirectoryNames((directoryNames) => ({...directoryNames, [node.value]: val}))}}
                                    onBlur={() => setIsRenaming(false)}
                                    onPressEnter={() => setIsRenaming(false)}
                                    inputRef={renameInputRef}
                                    autoFocus
                                />
                                :
                                <div>
                                    <Icon icon='folder'/> {directoryNames[node.value]}
                                </div>
                            )
                            :
                            <div>
                                <Icon icon='folder'/> {'Loading...'}
                            </div>
                        }
                    </div>)
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
                            {(node.paperId === selectedTreeNode?.value) &&
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
                            <div className="folder">
                                {// Render Inputfield if renaming
                                    directoryNames.hasOwnProperty(node.value) ? (
                                    isRenaming && (node.value === selectedTreeNode?.value) ? 
                                        <Input
                                            id='tree-node-folder-rename-input'
                                            value={directoryNames[node.value]} 
                                            onChange={(val:string) => {setDirectoryNames((directoryNames) => ({...directoryNames, [node.value]: val}))}}
                                            onBlur={() => setIsRenaming(false)}
                                            onPressEnter={() => setIsRenaming(false)}
                                            inputRef={renameInputRef}
                                            autoFocus
                                        />
                                        :
                                        <div>
                                            <Icon icon='folder'/> {directoryNames[node.value]}
                                        </div>
                                    )
                                    :
                                    <div>
                                        <Icon icon='folder'/> {'Loading...'}
                                    </div>
                                }
                            </div>
                            {(node.value === selectedTreeNode?.value) && 
                                <>
                                    <button className='delete-button' onClick={() => setTreeData(PaperFunctions.deleteTreeNode(selectedTreeNode.value, treeData))}>
                                        <Icon icon='trash'/>
                                    </button>
                                    <button className='rename-button' onClick={() => {setIsRenaming(true)}}>
                                        <Icon icon='pencil'/>
                                    </button>
                                </>
                            }
                        </div>
                    ),
                    directoryName: directoryNames[node.value]
            } 
                : node
            )));
    }, [directoryNames, selectedTreeNode, isRenaming])

    useEffect(() => {
        localStorage.setItem('savedpapers', JSON.stringify(PaperFunctions.deepMap(PaperFunctions.stripTree(treeData), (node) => (TreeTypes.isStrippedDirectoryNode(node) ? {...node, directoryName: directoryNames[node.value]} : node))))
    }, [treeData, directoryNames])



    return (
        <div className="saved-papers-tree">
            <div className="my-papers-actions">
                <Button onClick={() => addFolder('New Directory')}>
                    <Icon icon='folder-open'/>
                    Create Directory
                </Button>
                <Button onClick={() => setShowModal(true)}>
                    <Icon icon='eraser'/>
                    Reset Storage
                </Button>
                <Modal backdrop="static" show={showModal} onHide={() => setShowModal(false)} size="xs">
                    <Modal.Body>
                        <Icon
                            icon="remind"
                            style={{
                                color: '#ffb300',
                                fontSize: 24
                            }}
                        />
                        {'  '}
                        Clearing storage will irreversibly delete all your saved papers. Are you sure?
                    </Modal.Body>
                    <Modal.Footer>
                        <Button onClick={() => {setShowModal(false);localStorage.setItem('savedpapers', JSON.stringify([]));setTreeData([])}} appearance="primary">
                            Yes
                        </Button>
                        <Button onClick={() => setShowModal(false)} appearance="subtle">
                            Cancel
                        </Button>
                    </Modal.Footer>
                </Modal>
            </div>
            <div className='line'/>
            <Tree
                data={treeData}
                draggable={// Used to prevent dragging before tree has loaded. Decreases chance of some weird bug occuring where localstorage is emptied is minimized
                    (Object.keys(loadedPapers).length > 0 || PaperFunctions.getSubtreePaperIds(treeData).length === 0) && isRenaming === false} 
                defaultExpandAll
                onDrop={({ createUpdateDataFunction }: DropData) => setTreeData(PaperFunctions.flattenPapers(createUpdateDataFunction(treeData)))}
                onSelect={(active) => {setSelectedTreeNode(active);props.setSelectedPaper(loadedPapers[active.paperId])}}
            />
        </div>
    );
};
