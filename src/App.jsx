import React from 'react';
import { HashRouter, Routes, Route, Link } from 'react-router-dom';
import { UserProvider } from './UserContext';
import UsernamePrompt from './components/UsernamePrompt';
import HomePage from './pages/HomePage';
import RockPaperScissors from './pages/rps/RockPaperScissors';
import TicTacToe from './pages/tictactoe/tictactoe';
import DinoGame from './pages/dino-game/DinoGame';
import WordleGame from './pages/wordle/WordleGame';
import BlackjackGame from './pages/black-jack/BlackjackGame';
import './App.css';

function App() {
  return (
    <UserProvider>
      <HashRouter>
        <div className="app-container">
          <header className="app-header">
            <div className="app-title">ByteMe</div>
            <nav className="app-nav">
              <Link to="/">Home</Link>
              <Link to="/rock-paper-scissors">Rock Paper Scissors</Link>
              <Link to="/tic-tac-toe">Tic Tac Toe</Link>
              <Link to="/dino-game">Dino Game</Link>
              <Link to="/wordle">Wordle</Link>
              <Link to="/blackjack">Blackjack</Link>
            </nav>
          </header>
          
          <main className="app-content">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/rock-paper-scissors" element={<RockPaperScissors />} />
              <Route path="/tic-tac-toe" element={<TicTacToe />} />
              <Route path="/dino-game" element={<DinoGame />} />
              <Route path="/wordle" element={<WordleGame />} />
              <Route path="/blackjack" element={<BlackjackGame />} />
            </Routes>
          </main>
          
          <footer className="app-footer">
            ByteMe @2025
          </footer>
          
          <UsernamePrompt />
        </div>
      </HashRouter>
    </UserProvider>
  );
}

export default App;