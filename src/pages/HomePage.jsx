import React from 'react';
import { Link } from 'react-router-dom';
import './HomePage.css';

function HomePage() {
  return (
    <div className="home-container">
      <header className="home-header">
        <h1>Welcome to GameHub</h1>
        <p>Your one-stop destination for fun React-based games!</p>
      </header>
      
      <section className="games-showcase">
        <h2>Available Games</h2>
        <div className="game-cards">
          <div className="game-card">
            <h3>Rock Paper Scissors</h3>
            <p>Play the classic game of chance against the computer!</p>
            <Link to="/rock-paper-scissors" className="game-link">Play Now</Link>
          </div>
          
          <div className="game-card">
            <h3>Tic Tac Toe</h3>
            <p>Challenge yourself in this strategic game of X's and O's.</p>
            <Link to="/tic-tac-toe" className="game-link">Play Now</Link>
          </div>
          
          <div className="game-card">
            <h3>Dino Game</h3>
            <p>Jump over cacti in this endless runner game!</p>
            <Link to="/dino-game" className="game-link">Play Now</Link>
          </div>

          <div className="game-card">
            <h3>Wordle</h3>
            <p>Guess the right word in Wordle!</p>
            <Link to="/wordle" className="game-link">Play Now</Link>
          </div>
          
          <div className="game-card">
            <h3>Blackjack</h3>
            <p>Test your luck in this classic card game against the dealer!</p>
            <Link to="/black-jack" className="game-link">Play Now</Link>
          </div>
        </div>

      </section>
      
      <footer className="home-footer">
        <p>GameHub @2025</p>
      </footer>
    </div>
  );
}

export default HomePage;