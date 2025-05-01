import { useState } from "react";
import { useNavigate } from 'react-router-dom';

const WelcomeView = ({ onGameStart }) => {
  const [gameMode, setGameMode] = useState("single");
  const [gameUsername, setGameUsername] = useState("");
  const navigate = useNavigate();
  
  const goToHomePage = () => {
    navigate('/');
  };

  const handleStartGame = () => {
    const usernameToUse = gameUsername.trim() || "Player";
    onGameStart(gameMode, usernameToUse);
  };

  return (
    <div id="welcome-screen">
      <form id="name-form">
        <div className="form-group">
          <label htmlFor="game-username">Your username: </label>
          <input
            type="text"
            id="game-username"
            className="form-control"
            value={gameUsername}
            onChange={(e) => setGameUsername(e.target.value)}
            placeholder="Enter your username"
          />
        </div>
        
        <div className="form-group">
          <label>Game Mode: </label>
          <div>
            <label style={{ marginRight: '15px' }}>
              <input
                type="radio"
                name="gameMode"
                value="single"
                checked={gameMode === "single"}
                onChange={() => setGameMode("single")}
              /> 
              Single Player (vs CPU)
            </label>
            <label>
              <input
                type="radio"
                name="gameMode"
                value="multiplayer"
                checked={gameMode === "multiplayer"}
                onChange={() => setGameMode("multiplayer")}
              /> 
              Multiplayer 
            </label>
          </div>
        </div>
        
        <div className="button-group">
          <button 
            className="btn btn-primary" 
            id="start-game-button" 
            type="button"
            onClick={handleStartGame}
          >
            Start Game!
          </button>
          
          <button 
            className="btn btn-secondary" 
            type="button"
            onClick={goToHomePage}
            style={{ marginLeft: '10px' }}
          >
            Return to Home
          </button>
        </div>
      </form>
    </div>
  );
};

export default WelcomeView;