export interface TreeNode {
    label: JSX.Element;
    value: string;
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
    return node !== undefined && (node as DirectoryNode).children !== undefined;
}

export interface StrippedPaperNode {
    paperId: string;
}

export interface StrippedDirectoryNode {
    directoryName: string;
    children: PaperOrDirectoryNode[];
    value: string;
}

export type StrippedPaperOrDirectoryNode = StrippedPaperNode | StrippedDirectoryNode;
