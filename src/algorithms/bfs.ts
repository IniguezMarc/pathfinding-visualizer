import { type GridNode, NodeType } from '../types/Node';

export function bfs(grid: GridNode[][], startNode: GridNode, finishNode: GridNode): GridNode[] {
    const visitedNodesInOrder: GridNode[] = [];
    const queue: GridNode[] = [];

    startNode.distance = 0;
    startNode.isVisited = true;
    queue.push(startNode);
    visitedNodesInOrder.push(startNode);

    while (queue.length > 0) {
        const currentNode = queue.shift();
        if (!currentNode) break;

        if (currentNode === finishNode) return visitedNodesInOrder;

        const neighbors = getUnvisitedNeighbors(currentNode, grid);
        for (const neighbor of neighbors) {
            neighbor.isVisited = true;
            neighbor.distance = currentNode.distance + 1;
            neighbor.previousNode = currentNode;
            visitedNodesInOrder.push(neighbor);
            queue.push(neighbor);

            if (neighbor === finishNode) return visitedNodesInOrder;
        }
    }

    return visitedNodesInOrder;
}

function getUnvisitedNeighbors(node: GridNode, grid: GridNode[][]): GridNode[] {
    const neighbors: GridNode[] = [];
    const { col, row } = node;
    if (row > 0) neighbors.push(grid[row - 1][col]);
    if (row < grid.length - 1) neighbors.push(grid[row + 1][col]);
    if (col > 0) neighbors.push(grid[row][col - 1]);
    if (col < grid[0].length - 1) neighbors.push(grid[row][col + 1]);
    return neighbors.filter(neighbor => !neighbor.isVisited && neighbor.type !== NodeType.Wall);
}
