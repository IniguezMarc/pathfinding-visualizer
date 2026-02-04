import { type GridNode } from '../types/Node';
import { dijkstra } from '../algorithms/dijkstra';
import { bfs } from '../algorithms/bfs';
import { astar } from '../algorithms/astar';
import { dfs } from '../algorithms/dfs';

export enum AlgorithmType {
  DIJKSTRA = 'DIJKSTRA',
  BFS = 'BFS',
  ASTAR = 'ASTAR',
  DFS = 'DFS'
}

export interface AlgorithmInfo {
  id: AlgorithmType;
  name: string;
  description: string;
  timeComplexity: string;
  spaceComplexity: string;
  pros: string[];
  cons: string[];
  bestFor: string;
  code: string;
  run: (grid: GridNode[][], startNode: GridNode, finishNode: GridNode) => GridNode[];
}

export const algorithms: Record<AlgorithmType, AlgorithmInfo> = {
  [AlgorithmType.DIJKSTRA]: {
    id: AlgorithmType.DIJKSTRA,
    name: "Dijkstra's Algorithm",
    description: "The father of pathfinding algorithms. It guarantees the shortest path in weighted graphs by exploring diverse paths.",
    timeComplexity: "O(E + V log V)",
    spaceComplexity: "O(V)",
    pros: ["Guarantees shortest path", "Works with weighted edges"],
    cons: ["Slower than A*", "Can be wasteful in large empty grids"],
    bestFor: "Weighted graphs where the shortest path is needed",
    code: `function dijkstra(grid, start, end) {
  // 1. Initialize distance to start as 0
  start.distance = 0;
  const unvisited = getAllNodes(grid);

  while (unvisited.length) {
    // 2. Sort unvisited nodes by distance (smallest first)
    sort(unvisited); 
    const current = unvisited.shift();

    // 3. Skip walls or unreachable nodes
    if (current.isWall) continue;
    if (current.distance === Infinity) break;
    
    // 4. Mark as visited
    current.isVisited = true;
    if (current === end) return visitedNodes;

    // 5. Update neighbors
    updateNeighbors(current, grid);
  }
}`,
    run: dijkstra
  },
  [AlgorithmType.ASTAR]: {
    id: AlgorithmType.ASTAR,
    name: "A* Search",
    description: "A smart pathfinding algorithm that uses heuristics to guide its search towards the target, often traversing fewer nodes than Dijkstra.",
    timeComplexity: "O(E)",
    spaceComplexity: "O(V)",
    pros: ["Faster than Dijkstra (usually)", "Guarantees shortest path"],
    cons: ["Complex to implement", "Heuristic must be admissible"],
    bestFor: "Pathfinding in games, maps",
    code: `function aStar(grid, start, end) {
  // 1. Initialize open set with start node
  start.g = 0;
  start.f = heuristic(start, end);
  const openSet = [start];

  while (openSet.length) {
    // 2. Get node with lowest F score
    sortByFScore(openSet);
    const current = openSet.shift();

    if (current === end) return visitedNodes;
    current.closed = true;

    // 3. Evaluate neighbors
    for (const n of getNeighbors(current)) {
      if (n.closed || n.isWall) continue;

      // 4. Calculate tentative G score
      const tentativeG = current.g + 1;

      if (tentativeG < n.g) {
        // 5. Found a better path to n
        n.prev = current;
        n.g = tentativeG;
        n.f = n.g + heuristic(n, end);
        
        if (!openSet.includes(n)) openSet.push(n);
      }
    }
  }
}`,
    run: astar
  },
  [AlgorithmType.BFS]: {
    id: AlgorithmType.BFS,
    name: "Breadth-First Search",
    description: "A fundamental traversal algorithm. In an unweighted grid, it expands uniformly and guarantees the shortest path.",
    timeComplexity: "O(V + E)",
    spaceComplexity: "O(V)",
    pros: ["Guarantees shortest path (unweighted)", "Complete (finds solution if exists)"],
    cons: ["Inefficient for weighted graphs", "High memory usage"],
    bestFor: "Unweighted graphs, finding closest node",
    code: `function bfs(grid, start, end) {
  // 1. Initialize queue with start node
  const queue = [start];
  start.visited = true;

  while (queue.length) {
    // 2. Dequeue the first node
    const current = queue.shift();
    if (current === end) return visitedNodes;

    // 3. Explore all neighbors
    const neighbors = getNeighbors(current);
    for (const n of neighbors) {
      if (!n.visited && !n.isWall) {
        // 4. Mark visited and add to queue
        n.visited = true;
        n.prev = current; // Track path
        queue.push(n);
      }
    }
  }
}`,
    run: bfs
  },
  [AlgorithmType.DFS]: {
    id: AlgorithmType.DFS,
    name: "Depth-First Search",
    description: "An algorithm that explores as far as possible along each branch before backtracking. Does NOT guarantee the shortest path.",
    timeComplexity: "O(V + E)",
    spaceComplexity: "O(V)",
    pros: ["Low memory usage", "Good for mazes/topological sort"],
    cons: ["NOT shortest path", "Can get stuck in infinite loops (without check)"],
    bestFor: "Maze generation, solving puzzles",
    code: `function dfs(grid, start, end) {
  // 1. Initialize stack with start node
  const stack = [start];

  while (stack.length) {
    // 2. Pop the last node (LIFO)
    const current = stack.pop();
    
    if (current.visited) continue;
    current.visited = true;

    if (current === end) return visitedNodes;

    // 3. Add unvisited neighbors to stack
    const neighbors = getNeighbors(current);
    for (const n of neighbors) {
      if (!n.visited && !n.isWall) {
        n.prev = current;
        stack.push(n);
      }
    }
  }
}`,
    run: dfs
  }
};
