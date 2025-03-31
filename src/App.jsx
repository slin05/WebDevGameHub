import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navigation from './components/Navigation';
import HomePage from './pages/HomePage';
import TicTacToe from './pages/tictactoe/tictactoe';
import './App.css';

function App() {
  return (
    <Router>
      <div className="app">
        <Navigation />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<HomePage />} />
            {/* You'll need to add your game components here */}
            
            <Route path="/tic-tac-toe" element={<TicTacToe />} />
            <Route path="/tic-tac-toe" element={<div>Tic Tac Toe Game</div>} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;