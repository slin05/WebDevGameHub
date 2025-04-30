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
          userName={userName} 
          setUserName={setUserName} 
          onGameStart={(mode) => {
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

export default App;