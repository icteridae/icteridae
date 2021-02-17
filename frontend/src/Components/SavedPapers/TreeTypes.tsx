export interface BaseTreeNode {
    children?: BaseTreeNode[];
}

export interface TreeNode extends BaseTreeNode{
    label: JSX.Element;
    value: string;
    children?: PaperOrDirectoryNode[];
}

export interface PaperNode extends TreeNode {
    paperId: string;
}

export interface DirectoryNode extends TreeNode {
    children: PaperOrDirectoryNode[];
    directoryName: string;
}

export type PaperOrDirectoryNode = DirectoryNode | PaperNode;

export function isPaperNode(node: TreeNode | undefined): node is PaperNode {
    return node !== undefined && (node as PaperNode).paperId !== undefined;
}

export function isDirectoryNode(node: TreeNode | undefined): node is DirectoryNode {
    return node !== undefined && (node as DirectoryNode).directoryName !== undefined;
}

export function hasChildren(node: BaseTreeNode | undefined) {
    return node !== undefined && node.children !== undefined
}

export interface StrippedPaperNode extends BaseTreeNode{
    paperId: string;
}

export interface StrippedDirectoryNode extends BaseTreeNode{
    directoryName: string;
    children: StrippedPaperOrDirectoryNode[];
    value: string;
}

export function isStrippedDirectoryNode(node: BaseTreeNode | undefined): node is StrippedDirectoryNode {
    return node !== undefined && (node as DirectoryNode).directoryName !== undefined && (node as DirectoryNode).value !== undefined;
}

export type StrippedPaperOrDirectoryNode = StrippedPaperNode | StrippedDirectoryNode;
