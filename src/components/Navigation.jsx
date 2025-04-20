import React from 'react';
import { Link } from 'react-router-dom';
import './Navigation.css';

function Navigation() {
  return (
    <nav className="navigation">
      <div className="nav-brand">
        <Link to="/" className="nav-logo">GameHub</Link>
      </div>
      <ul className="nav-links">
        <li className="nav-item">
          <Link to="/" className="nav-link">Home</Link>
        </li>
        <li className="nav-item">
          <Link to="/rock-paper-scissors" className="nav-link">Rock Paper Scissors</Link>
        </li>
        <li className="nav-item">
          <Link to="/tic-tac-toe" className="nav-link">Tic Tac Toe</Link>
        </li>
        <li className="nav-item">
          <Link to="/dino-game" className="nav-link">Dino Game</Link>
        </li>
      </ul>
    </nav>
  );
}

export default Navigation;