import "./RockPaperScissors.css";
import WelcomeView from './WelcomeView';
import GameView from './GameView';
import ApiMultiplayerView from './ApiMultiplayerView';
import { useState, useEffect } from 'react';

function App() {
  const [userName, setUserName] = useState("");
  const [gameStarted, setGameStarted] = useState(false);
  const [gameMode, setGameMode] = useState("single");
  
  useEffect(() => {
    document.title = "Rock Paper Scissors";
  }, []);
  
  return (
    <div className="container">
      <h1 className="mainHeader">Rock Paper Scissors</h1>
      
      {!gameStarted ? (
        <WelcomeView 
          onGameStart={(mode, username) => {
            setUserName(username);
            setGameMode(mode);
            setGameStarted(true);
          }}
        />
      ) : (
        gameMode === "multiplayer" ? (
          <ApiMultiplayerView 
            userName={userName} 
            onReset={() => {
              setGameStarted(false);
              setUserName("");
            }}
          />
        ) : (
          <GameView 
            userName={userName} 
            onReset={() => {
              setGameStarted(false);
              setUserName("");
            }}
          />
        )
      )}
    </div>
  );
}