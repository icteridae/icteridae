import React, { useEffect, useState } from 'react';

import { Button, Icon, Tree } from 'rsuite';
import { DropData } from 'rsuite/lib/TreePicker';

import * as TreeTypes from './TreeTypes';

const testData: TreeTypes.DirectoryNode = {
    value: 'd1',
    label: <>text</>,
    directoryName: 'testDirectory',
    children: [
        {
            value: 'p1',
            label: <>child1</>,
            paperId: '1',
        },
        {
            value: 'd2',
            label: <>text</>,
            directoryName: '',
            children: [
                {
                    value: 'p3',
                    label: <>child1</>,
                    paperId: '3',
                },
            ],
        },
    ],
};

export const NewPageSavedPapers: React.FC = () => {
    const [treeData, setTreeData] = useState<TreeTypes.PaperOrDirectoryNode[]>([]);
    const [selectedTreeNode, setSelectedTreeNode] = useState<TreeTypes.PaperOrDirectoryNode>();

    const folderIcon = <Icon icon='folder'></Icon>

    useEffect(() => {
        setTreeData([testData, { value: 'p4', paperId: '2', label: <>p4</> }]);
    }, []);

    function createDirectory(directoryName: String) {
        let temp = [...treeData];
        temp.push({
            value: generateNewDirectoryValue(),
            directoryName: directoryName,
            label: <>{folderIcon} New Folder</>,
            children: []
        });
        setTreeData(temp);
    }

    function loadPapers() {
        let prom : any[] = [];
        getLoadPaperPromises(treeData, prom);
        console.log(prom);

    }

    function getLoadPaperPromises(nodes: TreeTypes.PaperOrDirectoryNode[], promises: any[]) {
        nodes.forEach(node => 
            TreeTypes.isPaperNode(node) 
                ? 
                    promises.push(node.paperId) 
                    : TreeTypes.isDirectoryNode(node) && node.children && getLoadPaperPromises(node.children, promises)
        );
    }   

    function generateNewDirectoryValue(): String {
        return new Date().valueOf().toString();
    }

    function renameDirectory(value: String, newName: String) {
        let temp = [...treeData];
        temp = renameDirectoryRecursively(temp, value, newName);
        setTreeData(temp);
    }

    function renameDirectoryRecursively (nodes: TreeTypes.PaperOrDirectoryNode[], value: String, newName: String) : TreeTypes.PaperOrDirectoryNode[] {
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

    function deleteTreeNode(value: String) {
        let temp = [...treeData];
        temp = filterNodeRecursively(temp, value);

        setTreeData(temp);
    }

    function filterNodeRecursively(nodes: TreeTypes.PaperOrDirectoryNode[], value: String) : TreeTypes.PaperOrDirectoryNode[] {
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

        /*let r = nodes.filter((node) => {
            if(TreeTypes.isDirectoryNode(node)) {
                if(node.children)
                    node.children.map(o => filterNodeRecursively(o, value));
                
                return node.value !== value;
            } else if(TreeTypes.isPaperNode(node)) {
                return node.value !== value;
            }
        })
        */
    }

    return (
        <div className="page-my-papers">
            <Tree
                data={treeData}
                draggable
                defaultExpandAll
                onDrop={({ createUpdateDataFunction }: DropData) => setTreeData(createUpdateDataFunction(treeData))}
                onSelect={(active) => setSelectedTreeNode(active)}
            />
            <div className="my-papers-actions">
                <Button onClick={() => createDirectory('new Directory')}>
                    Create Directory
                </Button>
                {selectedTreeNode != null && (
                    <Button onClick={() => loadPapers()}>
                        Delete
                    </Button>
                )}
                {TreeTypes.isDirectoryNode(selectedTreeNode) && (
                    <Button onClick={() => renameDirectory("d2", "testname")}>Rename</Button>
                )}
            </div>
        </div>
    );
};
