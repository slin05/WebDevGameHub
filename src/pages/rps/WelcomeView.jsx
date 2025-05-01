import { useState } from "react";
import { useUser } from '../../UserContext';
import { useNavigate } from 'react-router-dom';

const WelcomeView = ({ onGameStart }) => {
  const { username } = useUser();
  const [gameMode, setGameMode] = useState("single");
  const navigate = useNavigate();
  
  const goToHomePage = () => {
    navigate('/');
  };

  return (
    <div id="welcome-screen">
      <form id="name-form">
        <div className="form-group">
          <label htmlFor="username">Your username: </label>
          <p>{username}</p>
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
            onClick={() => onGameStart(gameMode)}
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