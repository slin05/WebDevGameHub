import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navigation from './components/Navigation';
import HomePage from './pages/HomePage';
import TicTacToe from './pages/tictactoe/tictactoe';
import RockPaperScissors from './pages/rps/RockPaperScissors';
import DinoGame from './pages/dino-game/DinoGame'; 
import BlackjackGame from './pages/black-jack/BlackjackGame';
import WordlePage from './pages/wordle/WordlePage';
import './App.css';

function App() {
  return (
    <Router>
      <div className="app">
        <Navigation />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/rock-paper-scissors" element={<RockPaperScissors />} />
            <Route path="/tic-tac-toe" element={<TicTacToe />} />
            <Route path="/dino-game" element={<DinoGame />} /> 
            <Route path="/black-jack" element={<BlackjackGame />} /> 
            <Route path="/wordle" element={<WordlePage />} /> 
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;