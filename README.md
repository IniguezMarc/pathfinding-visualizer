
[See Live Demo](https://iniguezmarc.github.io/pathfinding-visualizer/)

# Pathfinding Visualizer

An interactive web application for visualizing pathfinding algorithms. Watch how different algorithms explore the grid and find the shortest path from start to finish.

## Features

- **4 Algorithms**: Dijkstra, A*, BFS, and DFS
- **Interactive Grid**: Draw walls by clicking and dragging
- **Real-time Visualization**: Watch the algorithm explore step by step
- **Algorithm Info**: View complexity, pros/cons, and pseudocode for each algorithm
- **Adjustable Speed**: Control animation speed with a slider
- **Dark Mode Support**: Automatic theme detection

## Algorithms

| Algorithm | Shortest Path? | Best For |
|-----------|----------------|----------|
| Dijkstra | ✅ Yes | Weighted graphs |
| A* | ✅ Yes | Games, maps (uses heuristics) |
| BFS | ✅ Yes (unweighted) | Finding closest node |
| DFS | ❌ No | Maze generation, puzzles |

## Tech Stack

- React 19
- TypeScript
- Tailwind CSS
- Vite
- [@iniguezmarc/design-system](https://www.npmjs.com/package/@iniguezmarc/design-system)

## Usage

1. **Select an algorithm** from the control panel
2. **Draw walls** by clicking and dragging on the grid
3. **Click "Visualize"** to start the animation
4. **Clear Path** removes the visualization but keeps walls
5. **Reset Grid** clears everything

