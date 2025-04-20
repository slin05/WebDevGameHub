import React from 'react';
import WordleGame from './WordleGame';
import './WordlePage.css';

const WordlePage = () => {
  return (
    <div className="wordle-page">
      <h1>Wordle</h1>
      <div className="game-container">
        <WordleGame />
      </div>
    </div>
  );
};

export default WordlePage;