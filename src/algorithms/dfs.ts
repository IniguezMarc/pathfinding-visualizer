import { type GridNode, NodeType } from '../types/Node';

export function dfs(grid: GridNode[][], startNode: GridNode, finishNode: GridNode): GridNode[] {
    const visitedNodesInOrder: GridNode[] = [];
    const stack: GridNode[] = [];

    stack.push(startNode);

    while (stack.length > 0) {
        const currentNode = stack.pop();

        if (!currentNode) break;

        // Skip if already visited (can happen if added to stack multiple times via different paths)
        // or if it's a wall
        if (currentNode.isVisited || currentNode.type === NodeType.Wall) continue;

        currentNode.isVisited = true;
        visitedNodesInOrder.push(currentNode);

        if (currentNode === finishNode) return visitedNodesInOrder;

        const neighbors = getUnvisitedNeighbors(currentNode, grid);
        // Reverse to prioritize specific directions if desired, or just push
        for (const neighbor of neighbors) {
            if (!neighbor.isVisited) {
                neighbor.previousNode = currentNode;
                stack.push(neighbor);
            }
        }
    }

    return visitedNodesInOrder;
}

function getUnvisitedNeighbors(node: GridNode, grid: GridNode[][]): GridNode[] {
    const neighbors: GridNode[] = [];
    const { col, row } = node;
    // Order matters for DFS shape: Up, Right, Down, Left (or similar)
    if (row > 0) neighbors.push(grid[row - 1][col]); // Up
    if (col < grid[0].length - 1) neighbors.push(grid[row][col + 1]); // Right
    if (row < grid.length - 1) neighbors.push(grid[row + 1][col]); // Down
    if (col > 0) neighbors.push(grid[row][col - 1]); // Left

    return neighbors.filter(neighbor => !neighbor.isVisited && neighbor.type !== NodeType.Wall);
}
