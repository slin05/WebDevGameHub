import React from 'react';
import { Link } from 'react-router-dom';

function HomePage() {
  return (
    <div className="p-4">
      <h1 className="text-3xl text-center mb-4">ByteMe!</h1>
      <p className="text-center mb-6">Time to take a Byte out of some classics!</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="border p-4">
          <h3 className="font-bold">Rock Paper Scissors</h3>
          <p>Play the classic game of chance against an AI or another player!</p>
          <Link to="/rock-paper-scissors" className="bg-blue-500 text-white p-1 mt-2 inline-block">Play Now</Link>
        </div>
        
        <div className="border p-4">
          <h3 className="font-bold">Tic Tac Toe</h3>
          <p>Challenge yourself against an AI or another player in this strategic game of X's and O's!</p>
          <Link to="/tic-tac-toe" className="bg-blue-500 text-white p-1 mt-2 inline-block">Play Now</Link>
        </div>
        
        <div className="border p-4">
          <h3 className="font-bold">Dino Game</h3>
          <p>Jump over cacti in this endless runner game!</p>
          <Link to="/dino-game" className="bg-blue-500 text-white p-1 mt-2 inline-block">Play Now</Link>
        </div>
        
        <div className="border p-4">
          <h3 className="font-bold">Wordle</h3>
          <p>Guess the right word in Wordle!</p>
          <Link to="/wordle" className="bg-blue-500 text-white p-1 mt-2 inline-block">Play Now</Link>
        </div>
        
        <div className="border p-4">
          <h3 className="font-bold">Blackjack</h3>
          <p>Test your luck in this classic card game against the dealer!</p>
          <Link to="/black-jack" className="bg-blue-500 text-white p-1 mt-2 inline-block">Play Now</Link>
        </div>
      </div>
      
      <footer className="mt-8 text-center text-gray-500">
        <p>ByteMe @2025</p>
      </footer>
    </div>
  );
}

export default HomePage;