import { useState, useEffect, useRef } from "react";
import { LocalStorageMultiplayerRPS } from "./rps-localStorage-multiplayer.js";

const LocalStorageMultiplayerView = ({ userName, onReset }) => {
  const [roomCode, setRoomCode] = useState("");
  const [joiningRoom, setJoiningRoom] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [players, setPlayers] = useState([]);
  const [scores, setScores] = useState({});
  const [gameHistory, setGameHistory] = useState([]);
  const [userChoice, setUserChoice] = useState("rock");
  const [hasSelected, setHasSelected] = useState(false);
  
  const gameRef = useRef(null);
  
  useEffect(() => {
    return () => {
      if (gameRef.current) {
        gameRef.current.leaveGame();
      }
    };
  }, []);
  
  const handleCreateRoom = () => {
    const newRoomCode = Math.random().toString(36).substring(2, 8).toUpperCase();
    setRoomCode(newRoomCode);
    initializeGame(newRoomCode);
  };
  
  const handleJoinRoom = () => {
    if (roomCode.length < 4) {
      alert("Please enter a valid room code");
      return;
    }
    
    initializeGame(roomCode);
  };
  
  const initializeGame = (code) => {
    gameRef.current = new LocalStorageMultiplayerRPS(code, userName);
    
    gameRef.current.onStateChanged = (gameState) => {
      setPlayers([...gameState.players]);
      setScores({...gameState.scores});
      setGameHistory([...gameState.gameHistory]);
      
      if (gameState.selections && gameState.selections[userName]) {
        setHasSelected(true);
      } else {
        setHasSelected(false);
      }
    };
    
    const currentState = gameRef.current.getGameState();
    setPlayers([...currentState.players]);
    setScores({...currentState.scores});
    setGameHistory([...currentState.gameHistory]);
    
    setGameStarted(true);
  };
  
  const handlePlay = () => {
    gameRef.current.makeSelection(userChoice);
    setHasSelected(true);
  };
  
  const handleSelectChange = (e) => {
    setUserChoice(e.target.value);
  };
  
  const handleReset = () => {
    if (gameRef.current) {
      gameRef.current.leaveGame();
    }
    
    onReset();
  };
  
  const renderLobby = () => (
    <div id="welcome-screen">
      <h2>Tab Multiplayer (LocalStorage)</h2>
      <p>Play Rock Paper Scissors across multiple browser tabs</p>
      
      {!joiningRoom ? (
        <div>
          <button 
            className="btn btn-primary" 
            onClick={handleCreateRoom}
          >
            Create New Game
          </button>
          <button 
            className="btn btn-secondary" 
            onClick={() => setJoiningRoom(true)}
            style={{ marginLeft: '10px' }}
          >
            Join Existing Game
          </button>
        </div>
      ) : (
        <div>
          <div className="form-group">
            <label htmlFor="room-code">Enter Room Code: </label>
            <input
              value={roomCode}
              onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
              className="form-control"
              type="text"
              id="room-code"
              placeholder="Enter code..."
              maxLength="6"
            />
          </div>
          <button 
            className="btn btn-success" 
            onClick={handleJoinRoom}
          >
            Join Game
          </button>
          <button 
            className="btn btn-secondary" 
            onClick={() => setJoiningRoom(false)}
            style={{ marginLeft: '10px' }}
          >
            Back
          </button>
        </div>
      )}
    </div>
  );
  
  const renderGame = () => (
    <div id="game-screen">
      <div id="room-info">
        <h3>Room Code: {roomCode}</h3>
        <p>Share this code with friends to let them join (in a different tab)</p>
      </div>
      
      <div id="score-tally">
        <h3>Players:</h3>
        {players.map((player) => (
          <p key={player} id="score">
            {player}: {scores[player] || 0} {player === userName ? "(You)" : ""}
          </p>
        ))}
      </div>

      {!hasSelected ? (
        <form id="game-form">
          <div className="form-group">
            <label htmlFor="user-selection">Select your choice: </label>
            <select
              className="custom-select"
              id="user-selection"
              name="user-selection"
              value={userChoice}
              onChange={handleSelectChange}
            >
              <option id="rock" value="rock">Rock</option>
              <option id="paper" value="paper">Paper</option>
              <option id="scissors" value="scissors">Scissors</option>
            </select>
          </div>
          <button 
            className="btn btn-success" 
            id="go-button" 
            type="button"
            onClick={handlePlay}
            disabled={players.length < 2}
          >
            Go!
          </button>
          
          {players.length < 2 && (
            <p style={{ marginTop: '10px' }}>Waiting for more players to join...</p>
          )}
        </form>
      ) : (
        <div>
          <p>You selected: {userChoice}</p>
          <p>Waiting for all players to make their selections...</p>
        </div>
      )}

      <ul id="game-history">
        {gameHistory.map((entry, index) => (
          <li key={index}>{entry}</li>
        ))}
      </ul>
      
      <button 
        id="reset-game-button" 
        className="btn btn-secondary"
        onClick={handleReset} 
      >
        Exit Game
      </button>
    </div>
  );
  
  return gameStarted ? renderGame() : renderLobby();
};

export default LocalStorageMultiplayerView;