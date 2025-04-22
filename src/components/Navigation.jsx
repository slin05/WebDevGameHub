import React from 'react';
import { Link } from 'react-router-dom';

function Navigation() {
  return (
    <nav className="bg-blue-700 p-2">
      <div className="flex flex-col items-center">
        <h1 className="text-white text-xl mb-2">ByteMe</h1>
        <div className="flex flex-wrap justify-center">
          <Link to="/" className="text-white mx-2 underline">Home</Link>
          <Link to="/rock-paper-scissors" className="text-white mx-2 underline">Rock Paper Scissors</Link>
          <Link to="/tic-tac-toe" className="text-white mx-2 underline">Tic Tac Toe</Link>
          <Link to="/dino-game" className="text-white mx-2 underline">Dino Game</Link>
          <Link to="/black-jack" className="text-white mx-2 underline">Blackjack</Link>
          <Link to="/wordle" className="text-white mx-2 underline">Wordle</Link>
        </div>
      </div>
    </nav>
  );
}

export default Navigation;