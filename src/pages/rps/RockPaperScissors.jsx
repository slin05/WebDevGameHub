import "./RockPaperScissors.css";
import WelcomeView from './WelcomeView';
import GameView from './GameView';
import { useState, useEffect } from 'react';

function App() {
  const [userName, setUserName] = useState("");
  const [gameStarted, setGameStarted] = useState(false);
  
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
          onGameStart={() => setGameStarted(true)}
        />
      ) : (
        <GameView 
          userName={userName} 
          onReset={() => {
            setGameStarted(false);
            setUserName("");
          }}
        />
      )}
    </div>
  );
}

export default App;