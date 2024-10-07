import React from "react";
import { useState } from "react";

const numRows = 50;
const numCols = 50;

function ViewPort() {
  const [isRunning, toggleRunning] = useState(false);
  const [intervalId, setIntervalId] = useState(0);
  // Initializing 2D array numRows x numCols, representing the game grid
  const [grid, setGrid] = useState(() => {
    const arr = [];
    for (let i = 0; i < numRows; i++) {
      const row = [];
      for (let j = 0; j < numCols; j++) {
        row.push(0);
      }
      arr.push(row);
    }
    return arr;
  });

  // This updates initial state when the user clicks
  const handleCellClick = (i: number, j: number) => {
    const newGrid = grid.map((row, rowIndex) =>
      row.map((col, colIndex) =>
        i === rowIndex && j === colIndex ? (col === 0 ? 1 : 0) : col
      )
    );
    setGrid(newGrid);
  };

  const handleRun = () => {
    if (isRunning) {
      clearInterval(intervalId);
      setIntervalId(0);
      toggleRunning(false);
    } else {
      const id = setInterval(() => {
        setGrid((prevGrid) => {
          const newFrame: number[][] = prevGrid.map((row, rowIndex) =>
            row.map((col, colIndex) =>
              calculateSurival(col, rowIndex, colIndex, prevGrid)
            )
          );
          return newFrame;
        });
      }, 375);
      setIntervalId(id);
      toggleRunning(true);
    }
  };
  // Helper function for updating game state, returns 1 or 0 based on survival rules
  const calculateSurival = (
    cur: number,
    indexRow: number,
    indexColumn: number,
    currentGrid: number[][]
  ) => {
    // calculates life state for every adjacent tile
    const neighbors = [
      inBounds(indexRow - 1, indexColumn - 1)
        ? currentGrid[indexRow - 1][indexColumn - 1]
        : 0,
      inBounds(indexRow - 1, indexColumn)
        ? currentGrid[indexRow - 1][indexColumn]
        : 0,
      inBounds(indexRow - 1, indexColumn + 1)
        ? currentGrid[indexRow - 1][indexColumn + 1]
        : 0,
      inBounds(indexRow, indexColumn - 1)
        ? currentGrid[indexRow][indexColumn - 1]
        : 0,
      inBounds(indexRow, indexColumn + 1)
        ? currentGrid[indexRow][indexColumn + 1]
        : 0,
      inBounds(indexRow + 1, indexColumn - 1)
        ? currentGrid[indexRow + 1][indexColumn - 1]
        : 0,
      inBounds(indexRow + 1, indexColumn)
        ? currentGrid[indexRow + 1][indexColumn]
        : 0,
      inBounds(indexRow + 1, indexColumn + 1)
        ? currentGrid[indexRow + 1][indexColumn + 1]
        : 0,
    ];
    const adjacentSum = neighbors.reduce((acc, val) => acc + val);
    if (cur === 0) {
      return adjacentSum == 3 ? 1 : 0;
    }
    if (cur === 1) {
      if (adjacentSum < 2) {
        return 0;
      } else if (adjacentSum > 3) {
        return 0;
      } else {
        return 1;
      }
    }
    /* If some other number comes in, in an effort to handle errors I'm just going
     * to return zero and assume the cell is dead, and log it in console
     */
    console.error("Only cells with value 0 or 1 are allowed");
    return 0;
  };

  const inBounds = (indexRow: number, indexColumn: number) => {
    return (
      0 <= indexRow &&
      0 <= indexColumn &&
      indexRow < numRows &&
      indexColumn < numCols
    );
  };

  return (
    <div className="flex flex-col justify-center align-middle">
      <div
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${numCols}, 15px)`,
        }}
      >
        {grid.map((row, i) =>
          row.map((val, j) => (
            <div
              key={`index-${i}-${j}`}
              className={`aspect-square border-[0.5px] border-gray-600 rounded" ${
                val === 0 ? "bg-gray-500" : "bg-slate-800"
              }`}
              onClick={() => handleCellClick(i, j)}
            ></div>
          ))
        )}
      </div>
      <button
        className=" mx-auto my-2 w-32 bg-gray-400 rounded shadow-sm border-gray-600 border hover:bg-slate-400"
        onClick={handleRun}
      >
        {isRunning ? "Stop" : "Run"}
      </button>
    </div>
  );
}

export default ViewPort;
