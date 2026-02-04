import { type GridNode, NodeType } from '../types/Node';

interface AStarNode extends GridNode {
    fScore: number;
    gScore: number;
    hScore: number;
}

export function astar(grid: GridNode[][], startNode: GridNode, finishNode: GridNode): GridNode[] {
    const visitedNodesInOrder: GridNode[] = [];

    // Initialize scores
    initializeScores(grid);

    // Use a simplified openSet array (in prod a min-heap would be better)
    const openSet: AStarNode[] = [];
    const start = startNode as AStarNode;

    start.gScore = 0;
    start.hScore = heuristic(start, finishNode);
    start.fScore = start.hScore;

    openSet.push(start);

    while (openSet.length > 0) {
        // Sort by F score
        sortNodesByFScore(openSet);
        const currentNode = openSet.shift();

        if (!currentNode) break;

        // Skip walls
        if (currentNode.type === NodeType.Wall) continue;

        // If 'g' score is infinity, we are trapped
        if (currentNode.gScore === Infinity) return visitedNodesInOrder;

        currentNode.isVisited = true;
        visitedNodesInOrder.push(currentNode);

        if (currentNode === finishNode) return visitedNodesInOrder;

        const neighbors = getUnvisitedNeighbors(currentNode, grid);
        for (const neighbor of neighbors) {
            const neighborNode = neighbor as AStarNode;

            // Assume weight is 1 for now
            const tentativeGScore = currentNode.gScore + 1;

            if (tentativeGScore < neighborNode.gScore) {
                neighborNode.previousNode = currentNode;
                neighborNode.gScore = tentativeGScore;
                neighborNode.hScore = heuristic(neighborNode, finishNode);
                neighborNode.fScore = neighborNode.gScore + neighborNode.hScore;
                neighborNode.distance = tentativeGScore; // Keep base distance updated too

                if (!openSet.includes(neighborNode)) {
                    openSet.push(neighborNode);
                }
            }
        }
    }

    return visitedNodesInOrder;
}

function initializeScores(grid: GridNode[][]) {
    for (const row of grid) {
        for (const node of row) {
            const aNode = node as AStarNode;
            aNode.gScore = Infinity;
            aNode.fScore = Infinity;
            aNode.hScore = Infinity;
        }
    }
}

function heuristic(nodeA: GridNode, nodeB: GridNode): number {
    // Manhattan distance
    const d1 = Math.abs(nodeB.col - nodeA.col);
    const d2 = Math.abs(nodeB.row - nodeA.row);
    return d1 + d2;
}

function sortNodesByFScore(nodes: AStarNode[]) {
    nodes.sort((nodeA, nodeB) => nodeA.fScore - nodeB.fScore);
}

function getUnvisitedNeighbors(node: GridNode, grid: GridNode[][]): GridNode[] {
    const neighbors: GridNode[] = [];
    const { col, row } = node;
    if (row > 0) neighbors.push(grid[row - 1][col]);
    if (row < grid.length - 1) neighbors.push(grid[row + 1][col]);
    if (col > 0) neighbors.push(grid[row][col - 1]);
    if (col < grid[0].length - 1) neighbors.push(grid[row][col + 1]);
    return neighbors.filter(neighbor => !neighbor.isVisited);
}
