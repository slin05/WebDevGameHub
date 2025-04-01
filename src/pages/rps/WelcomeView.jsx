import { useEffect, useState } from "react";

const WelcomeView = ({userName, setUserName, onGameStart}) => {
  const [showButton, setShowButton] = useState(userName.length >= 2);
  
  const handleNameChange = (e) => {
    const value = e.target.value;
    setUserName(value);
    setShowButton(value.length >= 2);
  };
  
  useEffect(() => {
    setShowButton(userName.length >= 2);
  }, [userName]);

  return (
    <div id="welcome-screen">
      <form id="name-form">
        <div className="form-group">
          <label htmlFor="username">Type your name: </label>
          <input
            value={userName}
            onChange={handleNameChange}
            className="form-control"
            type="text"
            id="username"
            name="username"
            required 
            placeholder="Enter Name Here..." 
            minLength="2"
            maxLength="15"
          />
        </div>
        {showButton && (
          <button 
            className="btn btn-primary" 
            id="start-game-button" 
            type="button"
            onClick={onGameStart}
          >
            Start Game!
          </button>
        )}
      </form>
    </div>
  );
};

export default WelcomeView;