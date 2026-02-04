import { useState, useCallback } from 'react';
import { type GridNode, NodeType } from '../types/Node';

const createNode = (col: number, row: number, startNode: { r: number, c: number }, endNode: { r: number, c: number }): GridNode => {
    return {
        col,
        row,
        type: row === startNode.r && col === startNode.c ? NodeType.Start
            : row === endNode.r && col === endNode.c ? NodeType.End
                : NodeType.Empty,
        distance: Infinity,
        isVisited: false,
        previousNode: null,
    };
};

const getInitialGrid = (rows: number, cols: number, startNode: { r: number, c: number }, endNode: { r: number, c: number }): GridNode[][] => {
    const grid = [];
    for (let row = 0; row < rows; row++) {
        const currentRow = [];
        for (let col = 0; col < cols; col++) {
            currentRow.push(createNode(col, row, startNode, endNode));
        }
        grid.push(currentRow);
    }
    return grid;
};

export const useGrid = (rows: number, cols: number) => {
    // Fixed start and end points for now
    const START_NODE = { r: Math.floor(rows / 2), c: 5 };
    const END_NODE = { r: Math.floor(rows / 2), c: cols - 6 };

    const [grid, setGrid] = useState<GridNode[][]>(getInitialGrid(rows, cols, START_NODE, END_NODE));
    const [isMousePressed, setIsMousePressed] = useState(false);

    const resetGrid = useCallback(() => {
        setGrid(getInitialGrid(rows, cols, START_NODE, END_NODE));
    }, [rows, cols]);

    const clearPath = useCallback(() => {
        setGrid(prev => {
            const newGrid = prev.map(row => row.map(node => {
                if (node.type === NodeType.Visited || node.type === NodeType.Path) {
                    return { ...node, type: NodeType.Empty, isVisited: false, distance: Infinity, previousNode: null };
                }
                // Reset algorithm props for all nodes
                return { ...node, isVisited: false, distance: Infinity, previousNode: null };
            }));
            return newGrid;
        });
    }, []);

    const toggleWall = (row: number, col: number) => {
        setGrid(prev => {
            const newGrid = [...prev]; // Shallow copy of rows
            const rowArr = [...newGrid[row]]; // Copy row
            const node = { ...rowArr[col] }; // Copy node

            // Don't overwrite Start/End
            if (node.type !== NodeType.Start && node.type !== NodeType.End) {
                node.type = node.type === NodeType.Wall ? NodeType.Empty : NodeType.Wall;
            }

            rowArr[col] = node;
            newGrid[row] = rowArr;
            return newGrid;
        });
    };

    const handleMouseDown = (row: number, col: number) => {
        toggleWall(row, col);
        setIsMousePressed(true);
    };

    const handleMouseEnter = (row: number, col: number) => {
        if (!isMousePressed) return;
        toggleWall(row, col);
    };

    const handleMouseUp = () => {
        setIsMousePressed(false);
    };

    return {
        grid,
        setGrid,
        handleMouseDown,
        handleMouseEnter,
        handleMouseUp,
        resetGrid,
        clearPath,
        START_NODE,
        END_NODE
    };
};
