import React, { useState } from 'react';
import './App.css';

const SNAKES = {
  17: 7, 54: 34, 62: 19, 64: 60, 87: 36, 93: 73, 95: 75, 98: 79,
};

const LADDERS = {
  4: 14, 9: 31, 20: 38, 28: 84, 40: 59, 51: 67, 63: 81, 71: 91,
};

// Generate grid rows from top (100) to bottom (1)
const generateBoard = () => {
  const board = [];
  for (let row = 10; row >= 1; row--) {
    const rowCells = [];
    if (row % 2 === 0) {
      // Even rows (10, 8, 6, 4, 2) go from high to low (e.g., 100 to 91)
      for (let i = 0; i < 10; i++) {
        rowCells.push(row * 10 - i);
      }
    } else {
      // Odd rows (9, 7, 5, 3, 1) go from low to high (e.g., 81 to 90)
      for (let i = 0; i < 10; i++) {
        rowCells.push((row - 1) * 10 + i + 1);
      }
    }
    board.push(rowCells);
  }
  return board;
};

const BOARD = generateBoard();

function App() {
  const [positions, setPositions] = useState({ P1: 0, P2: 0 });
  const [turn, setTurn] = useState('P1');
  const [winner, setWinner] = useState(null);
  const [lastRoll, setLastRoll] = useState(null);

  const rollDice = () => {
    if (winner) return;

    const roll = Math.floor(Math.random() * 6) + 1;
    setLastRoll(roll);

    let currentPos = positions[turn];
    let newPos = currentPos + roll;

    // Exact 100 rule
    if (newPos > 100) {
      newPos = currentPos;
    } else {
      // Check for snakes or ladders
      if (SNAKES[newPos]) newPos = SNAKES[newPos];
      if (LADDERS[newPos]) newPos = LADDERS[newPos];
    }

    const newPositions = { ...positions, [turn]: newPos };
    setPositions(newPositions);

    if (newPos === 100) {
      setWinner(turn);
    } else {
      setTurn(turn === 'P1' ? 'P2' : 'P1');
    }
  };

  const resetGame = () => {
    setPositions({ P1: 0, P2: 0 });
    setTurn('P1');
    setWinner(null);
    setLastRoll(null);
  };

  return (
    <div className="app-container">
      <div className="header">
        <h1 className="title">Snake & Ladders</h1>
      </div>

      <div className="status-bar">
        <div className="turn-indicator">
          {winner ? (
            <span className="win-text">🏆 Player 1 wins! | Player 2 loses</span>
          ) : (
            <>
              <span className="turn-label">Turn:</span>
              <span className={`player-badge ${turn === 'P1' ? 'bg-red' : 'bg-blue'}`}>
                {turn}
              </span>
            </>
          )}
        </div>
        <div className="legend">
          <span className="legend-item">
            <span className="dot dot-red"></span> P1
          </span>
          <span className="legend-item">
            <span className="dot dot-blue"></span> P2
          </span>
        </div>
      </div>

      <div className="board">
        {BOARD.flat().map((cellNum) => {
          const hasSnake = SNAKES[cellNum];
          const hasLadder = LADDERS[cellNum];
          
          return (
            <div key={cellNum} className="cell">
              <span className="cell-number">{cellNum}</span>
              
              {hasLadder && (
                <span className="action-pill ladder-pill">-&gt; {hasLadder}</span>
              )}
              {hasSnake && (
                <span className="action-pill snake-pill">-&gt; {hasSnake}</span>
              )}

              <div className="pieces">
                {positions.P1 === cellNum && <div className="piece piece-red">P1</div>}
                {positions.P2 === cellNum && <div className="piece piece-blue">P2</div>}
              </div>
            </div>
          );
        })}
      </div>

      <div className="controls">
        <button className="btn btn-primary" onClick={rollDice} disabled={!!winner}>
          Roll Dice {lastRoll && `(${lastRoll})`}
        </button>
        <button className="btn btn-secondary" onClick={resetGame}>
          Reset
        </button>
      </div>

      <p className="description">
        Exact 100 is required to win. Land on a ladder to climb up, a snake to slide down.
      </p>
    </div>
  );
}

export default App;