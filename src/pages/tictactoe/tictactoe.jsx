import { useState, useEffect } from 'react';
import './tictactoe.css';

function Square({ value, onSquareClick }) {
  return (
    <button className="square" onClick={onSquareClick}>
      {value}
    </button>
  );
}

function Board({ squares, onPlay, isMyTurn }) {
  function handleClick(i) {
    if (squares[i] || !isMyTurn) {
      return;
    }
    onPlay(i);
  }
  
  return (
    <div className="board">
      <div className="board-row">
        <Square value={squares[0]} onSquareClick={() => handleClick(0)} />
        <Square value={squares[1]} onSquareClick={() => handleClick(1)} />
        <Square value={squares[2]} onSquareClick={() => handleClick(2)} />
      </div>
      <div className="board-row">
        <Square value={squares[3]} onSquareClick={() => handleClick(3)} />
        <Square value={squares[4]} onSquareClick={() => handleClick(4)} />
        <Square value={squares[5]} onSquareClick={() => handleClick(5)} />
      </div>
      <div className="board-row">
        <Square value={squares[6]} onSquareClick={() => handleClick(6)} />
        <Square value={squares[7]} onSquareClick={() => handleClick(7)} />
        <Square value={squares[8]} onSquareClick={() => handleClick(8)} />
      </div>
    </div>
  );
}

export default function Game() {
  const [roomCode, setRoomCode] = useState('');
  const [inputRoomCode, setInputRoomCode] = useState('');
  const [playerRole, setPlayerRole] = useState('');
  const [showLobby, setShowLobby] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  
  const [squares, setSquares] = useState(Array(9).fill(null));
  const [isXNext, setIsXNext] = useState(true);
  const [player1, setPlayer1] = useState('Player X');
  const [player2, setPlayer2] = useState('Player O');
  
  const winner = calculateWinner(squares);
  const isDraw = !winner && squares.every(square => square !== null);
  const isMyTurn = (isXNext && playerRole === 'X') || (!isXNext && playerRole === 'O');
  
  const getGameKey = (code) => `ttt-${code}`;
  
  function generateCode() {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
  }
  
  function createRoom() {
    const code = generateCode();
    setRoomCode(code);
    setPlayerRole('X');
    
    const gameState = {
      squares: Array(9).fill(null),
      isXNext: true,
      player1,
      player2,
      lastUpdate: Date.now()
    };
    
    localStorage.setItem(getGameKey(code), JSON.stringify(gameState));
    setShowLobby(false);
  }
  
  function joinRoom() {
    const gameKey = getGameKey(inputRoomCode);
    const gameState = JSON.parse(localStorage.getItem(gameKey));
    
    if (!gameState) {
      setErrorMsg('Room not found');
      return;
    }
    
    setRoomCode(inputRoomCode);
    setPlayerRole('O');
    setSquares(gameState.squares);
    setIsXNext(gameState.isXNext);
    setPlayer1(gameState.player1);
    
    gameState.player2 = player2;
    gameState.lastUpdate = Date.now();
    localStorage.setItem(gameKey, JSON.stringify(gameState));
    
    setShowLobby(false);
    setErrorMsg('');
  }
  
  function exitRoom() {
    setShowLobby(true);
    setSquares(Array(9).fill(null));
    setIsXNext(true);
  }
  
  function handlePlay(i) {
    if (!isMyTurn || winner || squares[i]) return;
    
    const newSquares = [...squares];
    newSquares[i] = isXNext ? 'X' : 'O';
    
    setSquares(newSquares);
    setIsXNext(!isXNext);
    
    const gameState = {
      squares: newSquares,
      isXNext: !isXNext,
      player1,
      player2,
      lastUpdate: Date.now()
    };
    
    localStorage.setItem(getGameKey(roomCode), JSON.stringify(gameState));
  }
  
  function resetGame() {
    const gameState = {
      squares: Array(9).fill(null),
      isXNext: true,
      player1,
      player2,
      lastUpdate: Date.now()
    };
    
    setSquares(Array(9).fill(null));
    setIsXNext(true);
    localStorage.setItem(getGameKey(roomCode), JSON.stringify(gameState));
  }
  
  useEffect(() => {
    function handleStorageChange(e) {
      if (e.key === getGameKey(roomCode)) {
        const gameState = JSON.parse(e.newValue);
        if (gameState) {
          setSquares(gameState.squares);
          setIsXNext(gameState.isXNext);
          setPlayer1(gameState.player1);
          setPlayer2(gameState.player2);
        }
      }
    }
    
    window.addEventListener('storage', handleStorageChange);
    
    const intervalId = setInterval(() => {
      if (roomCode) {
        const gameState = JSON.parse(localStorage.getItem(getGameKey(roomCode)));
        if (gameState && gameState.lastUpdate) {
          setSquares(gameState.squares);
          setIsXNext(gameState.isXNext);
          setPlayer1(gameState.player1);
          setPlayer2(gameState.player2);
        }
      }
    }, 500);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(intervalId);
    };
  }, [roomCode]);
  
  if (showLobby) {
    return (
      <div className="lobby">
        <h1>Tic Tac Toe</h1>
        
        <div className="create-section">
          <input 
            type="text" 
            placeholder="Your name" 
            value={player1} 
            onChange={(e) => setPlayer1(e.target.value)}
          />
          <button onClick={createRoom}>Create Room</button>
        </div>
        
        <div className="join-section">
          <input 
            type="text" 
            placeholder="Your name" 
            value={player2} 
            onChange={(e) => setPlayer2(e.target.value)}
          />
          <input 
            type="text" 
            placeholder="Room code" 
            value={inputRoomCode} 
            onChange={(e) => setInputRoomCode(e.target.value.toUpperCase())}
            maxLength={6}
          />
          <button onClick={joinRoom}>Join Room</button>
          {errorMsg && <p className="error">{errorMsg}</p>}
        </div>
      </div>
    );
  }
  
  let status;
  if (winner) {
    status = `Winner: ${winner === 'X' ? player1 : player2}`;
  } else if (isDraw) {
    status = "Draw!";
  } else {
    status = `Next: ${isXNext ? player1 : player2} ${isMyTurn ? '(Your Turn)' : ''}`;
  }
  
  return (
    <div className="game">
      <div className="game-info">
        <p className="room-code">Room: {roomCode}</p>
        <p className="player-role">You: {playerRole} ({playerRole === 'X' ? player1 : player2})</p>
        <p className="status">{status}</p>
      </div>
      
      <Board 
        squares={squares} 
        onPlay={handlePlay}
        isMyTurn={isMyTurn} 
      />
      
      <div className="controls">
        <button onClick={resetGame}>Reset Game</button>
        <button onClick={exitRoom}>Exit Room</button>
      </div>
    </div>
  );
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6]
  ];
  
  for (const [a, b, c] of lines) {
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}