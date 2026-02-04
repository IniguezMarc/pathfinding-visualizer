export enum NodeType {
    Empty = 'EMPTY',
    Wall = 'WALL',
    Start = 'START',
    End = 'END',
    Visited = 'VISITED',
    Path = 'PATH',
}

export interface GridNode {
    row: number;
    col: number;
    type: NodeType;
    distance: number;
    isVisited: boolean;
    previousNode: GridNode | null;
}
