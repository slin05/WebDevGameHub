import { useState, useEffect } from 'react';

function Square({ value, onSquareClick }) {
  return (
    <button className="square" onClick={onSquareClick}>
      {value}
    </button>
  );
}

function Board({ xIsNext, squares, onPlay }) {
  function handleClick(i) {
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    
    const nextSquares = squares.slice();
    if (xIsNext) {
      nextSquares[i] = 'X';
    } else {
      nextSquares[i] = 'O';
    }
    onPlay(nextSquares);
  }
  
  const winner = calculateWinner(squares);
  let status;
  if (winner) {
    status = "Winner: " + winner;
  } else if (squares.every(square => square !== null)) {
    status = "Game is a draw!";
  } else {
    status = "Next player: " + (xIsNext ? "X" : "O");
  }
  
  return (
    <>
      <div className="status">{status}</div>
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
    </>
  );
}

export default function Game() {
  // Room code state
  const [roomCode, setRoomCode] = useState('');
  const [inputRoomCode, setInputRoomCode] = useState('');
  const [playerRole, setPlayerRole] = useState('X'); // 'X' (creator) or 'O' (joiner)
  const [roomExists, setRoomExists] = useState(true);
  const [showLobby, setShowLobby] = useState(true);
  
  // Game state
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const [player1Name, setPlayer1Name] = useState('Player X');
  const [player2Name, setPlayer2Name] = useState('Player O');
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];
  
  // Game room registry
  const ROOM_REGISTRY_KEY = 'tictactoe-room-registry';
  const getGameRoomKey = (code) => `tictactoe-room-${code}`;
  const checkInterval = 1000; // Check for game updates every second
  
  // Generate a random 6-character room code
  function generateRoomCode() {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < 6; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
  }
  
  // Register a room in the registry
  function registerRoom(code) {
    const registry = JSON.parse(localStorage.getItem(ROOM_REGISTRY_KEY) || '[]');
    if (!registry.includes(code)) {
      registry.push(code);
      localStorage.setItem(ROOM_REGISTRY_KEY, JSON.stringify(registry));
    }
  }
  
  // Check if a room exists
  function roomCodeExists(code) {
    const registry = JSON.parse(localStorage.getItem(ROOM_REGISTRY_KEY) || '[]');
    return registry.includes(code);
  }
  
  // Create a new game room
  function createRoom() {
    const newRoomCode = generateRoomCode();
    setRoomCode(newRoomCode);
    setPlayerRole('X'); // Creator is always X
    registerRoom(newRoomCode);
    
    // Initialize game state
    const initialGameState = {
      history: [Array(9).fill(null)],
      currentMove: 0,
      player1Name: player1Name,
      player2Name: player2Name,
      lastUpdated: new Date().toISOString(),
      lastMoveBy: null,
    };
    
    localStorage.setItem(getGameRoomKey(newRoomCode), JSON.stringify(initialGameState));
    setHistory([Array(9).fill(null)]);
    setCurrentMove(0);
    setShowLobby(false);
  }
  
  // Join an existing game room
  function joinRoom() {
    if (roomCodeExists(inputRoomCode)) {
      setRoomCode(inputRoomCode);
      setPlayerRole('O'); // Joiner is always O
      setRoomExists(true);
      setShowLobby(false);
      
      // Load the game state
      const gameState = JSON.parse(localStorage.getItem(getGameRoomKey(inputRoomCode)));
      if (gameState) {
        setHistory(gameState.history);
        setCurrentMove(gameState.currentMove);
        setPlayer1Name(gameState.player1Name || 'Player X');
        setPlayer2Name(gameState.player2Name || 'Player O');
      }
    } else {
      setRoomExists(false);
    }
  }
  
  // Return to the lobby
  function exitRoom() {
    setRoomCode('');
    setShowLobby(true);
  }
  
  // Save current game state to localStorage
  function saveGameState() {
    if (!roomCode) return;
    
    const gameState = {
      history,
      currentMove,
      player1Name,
      player2Name,
      lastUpdated: new Date().toISOString(),
      lastMoveBy: playerRole,
    };
    
    localStorage.setItem(getGameRoomKey(roomCode), JSON.stringify(gameState));
  }
  
  // Load game state from localStorage
  function loadGameState() {
    if (!roomCode) return;
    
    const gameState = JSON.parse(localStorage.getItem(getGameRoomKey(roomCode)));
    if (gameState && gameState.lastMoveBy !== playerRole) {
      setHistory(gameState.history);
      setCurrentMove(gameState.currentMove);
      setPlayer1Name(gameState.player1Name || 'Player X');
      setPlayer2Name(gameState.player2Name || 'Player O');
    }
  }
  
  // Check for updates periodically
  useEffect(() => {
    let intervalId;
    
    if (roomCode && !showLobby) {
      // Initial load
      loadGameState();
      
      // Set up polling for changes
      intervalId = setInterval(loadGameState, checkInterval);
    }
    
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [roomCode, showLobby]);
  
  // Handle game play
  function handlePlay(nextSquares) {
    // Only allow moves from the correct player
    if ((xIsNext && playerRole !== 'X') || (!xIsNext && playerRole !== 'O')) {
      return; // Not your turn
    }
    
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
    
    // Save the updated state
    setTimeout(() => saveGameState(), 0);
  }
  
  // Navigate through move history
  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
    setTimeout(() => saveGameState(), 0);
  }
  
  // Update player names
  function handlePlayerNameChange(player, name) {
    if (player === 'X') {
      setPlayer1Name(name);
    } else {
      setPlayer2Name(name);
    }
    setTimeout(() => saveGameState(), 0);
  }
  
  // Generate move history list
  const moves = history.map((squares, move) => {
    let description;
    if (move > 0) {
      description = 'Go to move #' + move;
    } else {
      description = 'Go to game start';
    }
    return (
      <li key={move}>
        <button onClick={() => jumpTo(move)}>{description}</button>
      </li>
    );
  });
  
  // Determine if it's this player's turn
  const isMyTurn = (xIsNext && playerRole === 'X') || (!xIsNext && playerRole === 'O');
  
  // Game status display
  const winner = calculateWinner(currentSquares);
  const isDraw = currentSquares.every(square => square !== null) && !winner;
  const gameStatus = winner 
    ? `Winner: ${winner === 'X' ? player1Name : player2Name} (${winner})`
    : isDraw 
    ? "Game ended in a draw!"
    : `Next player: ${xIsNext ? player1Name : player2Name} (${xIsNext ? 'X' : 'O'})${isMyTurn ? ' - YOUR TURN' : ''}`;
  
  // Render the lobby or the game
  if (showLobby) {
    return (
      <div className="game-lobby">
        <h1>Tic Tac Toe Multiplayer</h1>
        
        <div className="lobby-section">
          <h2>Create a Room</h2>
          <div className="player-name-input">
            <label>
              Your Name:
              <input
                type="text"
                value={player1Name}
                onChange={(e) => setPlayer1Name(e.target.value)}
              />
            </label>
          </div>
          <button onClick={createRoom} className="create-room-btn">Create New Room</button>
        </div>
        
        <div className="lobby-section">
          <h2>Join a Room</h2>
          <div className="player-name-input">
            <label>
              Your Name:
              <input
                type="text"
                value={player2Name}
                onChange={(e) => setPlayer2Name(e.target.value)}
              />
            </label>
          </div>
          <div className="room-code-input">
            <label>
              Room Code:
              <input
                type="text"
                value={inputRoomCode}
                onChange={(e) => setInputRoomCode(e.target.value.toUpperCase())}
                placeholder="Enter 6-digit code"
                maxLength={6}
              />
            </label>
          </div>
          <button onClick={joinRoom} className="join-room-btn">Join Room</button>
          {!roomExists && <p className="error-message">Room not found. Check the code and try again.</p>}
        </div>
      </div>
    );
  }
  
  // Render the game
  return (
    <div className="game-container">
      <h1>Tic Tac Toe</h1>
      
      <div className="room-info">
        <p>Room Code: <span className="room-code">{roomCode}</span></p>
        <p>You are: {playerRole === 'X' ? player1Name : player2Name} ({playerRole})</p>
        <button onClick={exitRoom} className="exit-room-btn">Exit Room</button>
      </div>
      
      <div className="game-status">
        <h2>{gameStatus}</h2>
      </div>
      
      <div className="game">
        <div className="game-board">
          <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
        </div>
        
        <div className="game-controls">
          <div className="player-info">
            <h3>Players</h3>
            <p>X: {player1Name}</p>
            <p>O: {player2Name}</p>
            
            {/* Only allow editing your own name */}
            {playerRole === 'X' && (
              <div className="name-edit">
                <label>
                  Change Your Name:
                  <input
                    type="text"
                    value={player1Name}
                    onChange={(e) => handlePlayerNameChange('X', e.target.value)}
                  />
                </label>
              </div>
            )}
            
            {playerRole === 'O' && (
              <div className="name-edit">
                <label>
                  Change Your Name:
                  <input
                    type="text"
                    value={player2Name}
                    onChange={(e) => handlePlayerNameChange('O', e.target.value)}
                  />
                </label>
              </div>
            )}
          </div>
          
          <div className="game-history">
            <h3>Game History</h3>
            <ol>{moves}</ol>
          </div>
        </div>
      </div>
    </div>
  );
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}