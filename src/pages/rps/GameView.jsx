import { useState, useEffect, useRef } from "react";
import { RockPaperScissors } from "./rps.js";

const GameView = ({userName, onReset}) => {
  const [userScore, setUserScore] = useState(0);
  const [cpuScore, setCpuScore] = useState(0);
  const [gameHistory, setGameHistory] = useState([]);
  const [userChoice, setUserChoice] = useState("rock");
  
  const gameRef = useRef(null);
  
  useEffect(() => {
    gameRef.current = new RockPaperScissors(userName);
  }, [userName]);
  
  const handlePlay = () => {
    const selectedChoice = document.getElementById("user-selection").value;
    
    const result = gameRef.current.play(selectedChoice);
    
    setUserScore(gameRef.current.score.user);
    setCpuScore(gameRef.current.score.cpu);
    setGameHistory([...gameRef.current.gameHistoryLog]);
  };
  
  const handleReset = () => {
    setUserScore(0);
    setCpuScore(0);
    setGameHistory([]);
    
    gameRef.current = new RockPaperScissors(userName);
    
  };
  
  const handleSelectChange = (e) => {
    setUserChoice(e.target.value);
  };
  
  return (
    <div id="game-screen">
      <div id="score-tally">
        <p id="score">{userName}: {userScore} v CPU: {cpuScore}</p>
      </div>

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
            <option id="rock" value="rock">
              Rock
            </option>
            <option id="paper" value="paper">
              Paper
            </option>
            <option id="scissors" value="scissors">
              Scissors
            </option>
          </select>
        </div>
        <button 
          className="btn btn-success" 
          id="go-button" 
          type="button"
          onClick={handlePlay}
        >
          Go!
        </button>
      </form>

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
        Reset
      </button>
    </div>
  );
};

export default GameView;