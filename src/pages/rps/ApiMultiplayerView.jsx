import { useState, useEffect, useRef } from "react";
import { ApiMultiplayerRPS } from "./rps-api-multiplayer.js";

const ApiMultiplayerView = ({ userName, onReset }) => {
  const [roomCode, setRoomCode] = useState("");
  const [joiningRoom, setJoiningRoom] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [players, setPlayers] = useState([]);
  const [scores, setScores] = useState({});
  const [gameHistory, setGameHistory] = useState([]);
  const [userChoice, setUserChoice] = useState("rock");
  const [hasSelected, setHasSelected] = useState(false);
  const [isCreatingRoom, setIsCreatingRoom] = useState(false);
  const [isJoiningRoom, setIsJoiningRoom] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  
  const gameRef = useRef(null);
  
  useEffect(() => {
    return () => {
      if (gameRef.current) {
        gameRef.current.leaveGame();
      }
    };
  }, []);
  
  const handleCreateRoom = async () => {
    try {
      setIsCreatingRoom(true);
      setErrorMessage("");
      
      gameRef.current = new ApiMultiplayerRPS(null, userName);
      
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
      
      await new Promise(resolve => {
        const checkRoomCode = () => {
          if (gameRef.current.roomCode) {
            setRoomCode(gameRef.current.roomCode);
            resolve();
          } else {
            setTimeout(checkRoomCode, 100);
          }
        };
        checkRoomCode();
      });
      
      const currentState = await gameRef.current.getGameState();
      setPlayers([...currentState.players]);
      setScores({...currentState.scores});
      setGameHistory([...currentState.gameHistory]);
      
      setGameStarted(true);
    } catch (error) {
      console.error("Error creating room:", error);
      setErrorMessage("Failed to create room. Please try again.");
    } finally {
      setIsCreatingRoom(false);
    }
  };
  
  const handleJoinRoom = async () => {
    if (roomCode.length < 4) {
      setErrorMessage("Please enter a valid room code");
      return;
    }
    
    try {
      setIsJoiningRoom(true);
      setErrorMessage("");
      
      gameRef.current = new ApiMultiplayerRPS(roomCode, userName);
      
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
      
      const currentState = await gameRef.current.getGameState();
      setPlayers([...currentState.players]);
      setScores({...currentState.scores});
      setGameHistory([...currentState.gameHistory]);
      
      setGameStarted(true);
    } catch (error) {
      console.error("Error joining room:", error);
      setErrorMessage("Failed to join room. Please check the room code and try again.");
    } finally {
      setIsJoiningRoom(false);
    }
  };
  
  const handlePlay = async () => {
    try {
      setErrorMessage("");
      await gameRef.current.makeSelection(userChoice);
      setHasSelected(true);
    } catch (error) {
      console.error("Error making selection:", error);
      setErrorMessage("Failed to submit your choice. Please try again.");
    }
  };
  
  const handleSelectChange = (e) => {
    setUserChoice(e.target.value);
  };
  
  const handleReset = async () => {
    if (gameRef.current) {
      try {
        await gameRef.current.leaveGame();
      } catch (error) {
        console.error("Error leaving game:", error);
      }
    }
    
    onReset();
  };
  
  const renderLobby = () => (
    <div id="welcome-screen">
      <h2>Multiplayer</h2>
      <p>Play Rock Paper Scissors against someone else!</p>
      
      {errorMessage && (
        <div style={{ color: 'red', marginBottom: '10px' }}>
          {errorMessage}
        </div>
      )}
      
      {!joiningRoom ? (
        <div>
          <button 
            className="btn btn-primary" 
            onClick={handleCreateRoom}
            disabled={isCreatingRoom}
          >
            {isCreatingRoom ? "Creating..." : "Create New Game"}
          </button>
          <button 
            className="btn btn-secondary" 
            onClick={() => setJoiningRoom(true)}
            style={{ marginLeft: '10px' }}
            disabled={isCreatingRoom}
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
            disabled={isJoiningRoom}
          >
            {isJoiningRoom ? "Joining..." : "Join Game"}
          </button>
          <button 
            className="btn btn-secondary" 
            onClick={() => {
              setJoiningRoom(false);
              setErrorMessage("");
            }}
            style={{ marginLeft: '10px' }}
            disabled={isJoiningRoom}
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
        <p>Share this code with friends to let them join</p>
      </div>
      
      {errorMessage && (
        <div style={{ color: 'red', marginBottom: '10px' }}>
          {errorMessage}
        </div>
      )}
      
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

export default ApiMultiplayerView;