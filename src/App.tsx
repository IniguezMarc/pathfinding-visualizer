/**
 * Pathfinding Visualizer App
 * 
 * An interactive tool for visualizing pathfinding algorithms on a grid.
 * Users can draw walls, select algorithms, and watch the visualization
 * step by step.
 * 
 * Supported algorithms: Dijkstra, A*, BFS, DFS
 */
import { useState } from 'react';
import { Button, ControlPanel, InteractiveGrid, Slider, SplitLayout } from '@iniguezmarc/design-system';
import { useGrid } from './hooks/useGrid';
import { getNodesInShortestPathOrder } from './algorithms/dijkstra';
import { NodeType, type GridNode } from './types/Node';
import { AlgorithmType, algorithms } from './data/algorithms';

function App() {
  const ROWS = 20;
  const COLS = 40;
  const { grid, setGrid, handleMouseDown, handleMouseEnter, handleMouseUp, resetGrid, clearPath, START_NODE, END_NODE } = useGrid(ROWS, COLS);

  const [speed, setSpeed] = useState(10);
  const [isVisualizing, setIsVisualizing] = useState(false);
  const [selectedAlgorithm, setSelectedAlgorithm] = useState<AlgorithmType>(AlgorithmType.DIJKSTRA);
  const [showCode, setShowCode] = useState(false);

  const currentAlgorithm = algorithms[selectedAlgorithm];

  const animateAlgorithm = (visitedNodesInOrder: GridNode[], nodesInShortestPathOrder: GridNode[]) => {
    for (let i = 0; i <= visitedNodesInOrder.length; i++) {
      if (i === visitedNodesInOrder.length) {
        setTimeout(() => {
          animateShortestPath(nodesInShortestPathOrder);
        }, speed * i);
        return;
      }
      setTimeout(() => {
        const node = visitedNodesInOrder[i];
        if (node.type !== NodeType.Start && node.type !== NodeType.End) {
          updateNodeState(node.row, node.col, NodeType.Visited);
        }
      }, speed * i);
    }
  };

  const animateShortestPath = (nodesInShortestPathOrder: GridNode[]) => {
    for (let i = 0; i < nodesInShortestPathOrder.length; i++) {
      setTimeout(() => {
        const node = nodesInShortestPathOrder[i];
        if (node.type !== NodeType.Start && node.type !== NodeType.End) {
          updateNodeState(node.row, node.col, NodeType.Path);
        }
        if (i === nodesInShortestPathOrder.length - 1) {
          setIsVisualizing(false);
        }
      }, 50 * i);
    }
  };

  const updateNodeState = (row: number, col: number, type: NodeType) => {
    setGrid(prev => {
      const newGrid = [...prev];
      const newRow = [...newGrid[row]];
      newRow[col] = { ...newRow[col], type };
      newGrid[row] = newRow;
      return newGrid;
    });
  };

  const visualizeAlgorithm = () => {
    if (isVisualizing) return;
    setIsVisualizing(true);
    clearPath();
    const startNode = grid[START_NODE.r][START_NODE.c];
    const finishNode = grid[END_NODE.r][END_NODE.c];

    // Dynamic execution
    const visitedNodesInOrder = currentAlgorithm.run(grid, startNode, finishNode);
    nodesInShortestPathOrder(finishNode);

    // Since DFS doesn't guarantee shortest path, we still show the path found by backtracking 'previousNode'
    const path = getNodesInShortestPathOrder(finishNode);

    animateAlgorithm(visitedNodesInOrder, path);
  };

  // Necessary wrapper because original function name implies shortest path, which is true for BFS/Dijkstra/A* but just "Path" for DFS
  const nodesInShortestPathOrder = (finishNode: GridNode) => {
    // Logic is same: backtracking from finishNode via previousNode
    return getNodesInShortestPathOrder(finishNode);
  }

  const getCellClass = (type: NodeType) => {
    switch (type) {
      case NodeType.Wall: return 'bg-gray-800 dark:bg-gray-200 animate-pop';
      case NodeType.Start: return 'bg-green-500';
      case NodeType.End: return 'bg-red-500';
      case NodeType.Visited: return 'bg-teal-300 animate-visited';
      case NodeType.Path: return 'bg-yellow-400 animate-path';
      default: return 'bg-white dark:bg-gray-800 hover:bg-blue-50 dark:hover:bg-gray-700';
    }
  };

  return (
    <div className="h-screen w-screen bg-gray-50 dark:bg-gray-900" onMouseUp={handleMouseUp}>
      <SplitLayout
        initialLeftWidth={20}
        leftContent={
          <div className="h-full p-4 overflow-y-auto">
            <ControlPanel title="Pathfinding Visualizer">
              <div className="flex flex-col gap-6">
                {/* Algorithm Selection */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Algorithm</label>
                  <div className="grid grid-cols-2 gap-2">
                    {Object.values(algorithms).map((algo) => (
                      <Button
                        key={algo.id}
                        label={algo.id}
                        variant={selectedAlgorithm === algo.id ? 'primary' : 'outline'}
                        size="small"
                        onClick={() => setSelectedAlgorithm(algo.id)}
                      />
                    ))}
                  </div>
                </div>

                {/* Info Card */}
                <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded-lg border border-gray-200 dark:border-gray-700 text-sm">
                  <h4 className="font-bold text-gray-900 dark:text-white mb-2">{currentAlgorithm.name}</h4>
                  <p className="text-gray-600 dark:text-gray-400 mb-3 leading-relaxed text-xs">{currentAlgorithm.description}</p>

                  <div className="grid grid-cols-2 gap-x-2 gap-y-1 text-xs font-mono mb-3">
                    <div className="text-gray-500">Time: <span className="text-gray-800 dark:text-gray-200">{currentAlgorithm.timeComplexity}</span></div>
                    <div className="text-gray-500">Space: <span className="text-gray-800 dark:text-gray-200">{currentAlgorithm.spaceComplexity}</span></div>
                  </div>

                  <div className="mb-3">
                    <span className="text-xs font-semibold text-gray-500 uppercase">Best For</span>
                    <p className="text-xs text-gray-800 dark:text-gray-200">{currentAlgorithm.bestFor}</p>
                  </div>

                  <Button
                    label={showCode ? "Hide Code" : "View Code"}
                    variant="ghost"
                    size="small"
                    onClick={() => setShowCode(!showCode)}
                    className="w-full text-xs"
                  />

                  {showCode && (
                    <div className="mt-2 bg-gray-900 text-gray-100 p-2 rounded text-[10px] font-mono overflow-auto max-h-48">
                      <pre>{currentAlgorithm.code}</pre>
                    </div>
                  )}
                </div>

                <Slider
                  label="Animation Delay (ms)"
                  min={5}
                  max={50}
                  step={5}
                  value={speed}
                  onChange={setSpeed}
                />

                <div className="grid grid-cols-2 gap-2">
                  <Button
                    variant="primary"
                    label={isVisualizing ? "Running..." : "Visualize"}
                    onClick={visualizeAlgorithm}
                    className='col-span-2'
                  />
                  <Button
                    variant="outline"
                    label="Clear Path"
                    onClick={clearPath}
                  />
                  <Button
                    variant="secondary"
                    label="Reset Grid"
                    onClick={resetGrid}
                  />
                </div>

                <div className="text-xs text-gray-500 mt-4 space-y-1">
                  <div className="flex items-center gap-2"><div className="w-4 h-4 bg-green-500 rounded"></div> Start Node</div>
                  <div className="flex items-center gap-2"><div className="w-4 h-4 bg-red-500 rounded"></div> End Node</div>
                  <div className="flex items-center gap-2"><div className="w-4 h-4 bg-gray-800 dark:bg-gray-200 rounded"></div> Wall (Drag to draw)</div>
                  <div className="flex items-center gap-2"><div className="w-4 h-4 bg-teal-300 rounded"></div> Visited</div>
                  <div className="flex items-center gap-2"><div className="w-4 h-4 bg-yellow-400 rounded"></div> Shortest Path</div>
                </div>
              </div>
            </ControlPanel>
          </div>
        }
        rightContent={
          <div className="h-full w-full p-4 flex justify-center items-center">
            <div className="w-full h-full max-w-4xl max-h-[80vh] aspect-video shadow-lg bg-white dark:bg-gray-800 rounded-lg overflow-hidden">
              <InteractiveGrid
                rows={ROWS}
                cols={COLS}
                onCellMouseDown={handleMouseDown}
                onCellMouseEnter={handleMouseEnter}
                onCellMouseUp={handleMouseUp}
                renderCell={(r, c) => {
                  const node = grid[r][c];
                  return (
                    <div
                      key={`${r}-${c}`}
                      className={`w-full h-full border-[0.5px] border-gray-100 dark:border-gray-800 transition-colors duration-200 ${getCellClass(node.type)}`}
                    />
                  );
                }}
              />
            </div>
          </div>
        }
      />
    </div>
  );
}

export default App;
