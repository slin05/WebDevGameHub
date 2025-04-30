import { useState, useEffect, useRef } from 'react';
import './tictactoe.css';
import { TicTacToeApi } from './tictactoeApi';

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

export default function TicTacToe() {
  const [roomCode, setRoomCode] = useState('');
  const [inputRoomCode, setInputRoomCode] = useState('');
  const [playerRole, setPlayerRole] = useState('');
  const [showLobby, setShowLobby] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);
  
  const [squares, setSquares] = useState(Array(9).fill(null));
  const [isXNext, setIsXNext] = useState(true);
  const [player1, setPlayer1] = useState('Player X');
  const [player2, setPlayer2] = useState('Player O');
  
  const pollIntervalRef = useRef(null);
  
  const winner = calculateWinner(squares);
  const isDraw = !winner && squares.every(square => square !== null);
  const isMyTurn = (isXNext && playerRole === 'X') || (!isXNext && playerRole === 'O');
  
  async function createRoom() {
    try {
      setLoading(true);
      setErrorMsg('');
      
      const result = await TicTacToeApi.createRoom(player1);
      
      setRoomCode(result.roomId);
      setPlayerRole('X');
      setSquares(result.gameState.squares);
      setIsXNext(result.gameState.isXNext);
      
      startGamePolling(result.roomId);
      
      setShowLobby(false);
    } catch (error) {
      console.error('Error creating room:', error);
      setErrorMsg('Failed to create room. Please try again.');
    } finally {
      setLoading(false);
    }
  }
  
  async function joinRoom() {
    if (!inputRoomCode) {
      setErrorMsg('Please enter a room code');
      return;
    }
    
    try {
      setLoading(true);
      setErrorMsg('');
      
      const gameState = await TicTacToeApi.getGameState(inputRoomCode);
      
      if (!gameState) {
        setErrorMsg('Room not found');
        setLoading(false);
        return;
      }
      
      if (gameState.player2) {
        setErrorMsg('Room is full');
        setLoading(false);
        return;
      }
      
      const updatedState = await TicTacToeApi.joinRoom(inputRoomCode, player2);
      
      setRoomCode(inputRoomCode);
      setPlayerRole('O');
      setSquares(updatedState.squares);
      setIsXNext(updatedState.isXNext);
      setPlayer1(updatedState.player1);
      
      startGamePolling(inputRoomCode);
      
      setShowLobby(false);
    } catch (error) {
      console.error('Error joining room:', error);
      setErrorMsg('Failed to join room. Please try again.');
    } finally {
      setLoading(false);
    }
  }
  
  function startGamePolling(roomId) {
    if (pollIntervalRef.current) {
      clearInterval(pollIntervalRef.current);
    }
    
    pollIntervalRef.current = setInterval(async () => {
      try {
        const gameState = await TicTacToeApi.getGameState(roomId);
        
        if (gameState) {
          setSquares(gameState.squares);
          setIsXNext(gameState.isXNext);
          setPlayer1(gameState.player1);
          if (gameState.player2) {
            setPlayer2(gameState.player2);
          }
        }
      } catch (error) {
        console.error('Error polling game state:', error);
      }
    }, 1000);
  }
  
  function exitRoom() {
    if (pollIntervalRef.current) {
      clearInterval(pollIntervalRef.current);
      pollIntervalRef.current = null;
    }
    
    setShowLobby(true);
    setSquares(Array(9).fill(null));
    setIsXNext(true);
    setRoomCode('');
    setInputRoomCode('');
    setErrorMsg('');
  }
  
  async function handlePlay(i) {
    if (!isMyTurn || winner || squares[i]) return;
    
    try {
      const updatedState = await TicTacToeApi.makeMove(roomCode, i, playerRole);
      
      setSquares(updatedState.squares);
      setIsXNext(updatedState.isXNext);
    } catch (error) {
      console.error('Error making move:', error);
    }
  }
  
  async function resetGame() {
    try {
      const updatedState = await TicTacToeApi.resetGame(roomCode);
      
      setSquares(updatedState.squares);
      setIsXNext(updatedState.isXNext);
    } catch (error) {
      console.error('Error resetting game:', error);
    }
  }
  
  useEffect(() => {
    return () => {
      if (pollIntervalRef.current) {
        clearInterval(pollIntervalRef.current);
        pollIntervalRef.current = null;
      }
    };
  }, []);
  
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
            disabled={loading}
          />
          <button 
            onClick={createRoom} 
            disabled={loading || !player1.trim()}
          >
            {loading ? 'Creating...' : 'Create Room'}
          </button>
        </div>
        
        <div className="join-section">
          <input 
            type="text" 
            placeholder="Your name" 
            value={player2} 
            onChange={(e) => setPlayer2(e.target.value)}
            disabled={loading}
          />
          <input 
            type="text" 
            placeholder="Room code" 
            value={inputRoomCode} 
            onChange={(e) => setInputRoomCode(e.target.value.toUpperCase())}
            maxLength={6}
            disabled={loading}
          />
          <button 
            onClick={joinRoom} 
            disabled={loading || !player2.trim() || !inputRoomCode.trim()}
          >
            {loading ? 'Joining...' : 'Join Room'}
          </button>
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
        isMyTurn={isMyTurn && !winner && !isDraw} 
      />
      
      <div className="controls">
        <button onClick={resetGame} disabled={!playerRole}>Reset Game</button>
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