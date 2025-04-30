import React, { useState, useEffect } from 'react';
import './WordleGame.css';

const WordleGame = () => {
  // Game state
  const [targetWord, setTargetWord] = useState("");
  const [attempts, setAttempts] = useState(6);
  const [wordLength, setWordLength] = useState(5);
  const [currentAttempt, setCurrentAttempt] = useState(0);
  const [currentPosition, setCurrentPosition] = useState(0);
  const [grid, setGrid] = useState(Array(6).fill().map(() => Array(5).fill("")));
  const [gameStatus, setGameStatus] = useState("playing"); // "playing", "won", "lost"
  const [cellStates, setCellStates] = useState(
    Array(6).fill().map(() => Array(5).fill(null))
  );
  const [showInvalidWordMsg, setShowInvalidWordMsg] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  // Initialize game on component mount
  useEffect(() => {
    initializeGame();
  }, []);

  // Get random word from API
  const getRandomWord = async () => {
    try {
      // Make sure wordLength is defined before making the request
      const length = wordLength || 5;
      const response = await fetch(
        `https://random-word-api.vercel.app/api?words=1&length=${length}`
      );
      const data = await response.json();
      return data[0];
    } catch (error) {
      console.error("Error fetching word:", error);
      return "hello"; // Fallback word
    }
  };

  // Initialize game state
  const initializeGame = async () => {
    const word = await getRandomWord();
    setTargetWord(word);
  };

  // Check if input is a letter
  const isLetter = (input) => {
    return input.length === 1 && input.match(/[a-z]/i);
  };

  // Add letter to grid
  const addLetterToGrid = (letter) => {
    if (currentPosition < wordLength && gameStatus === "playing") {
      const newGrid = [...grid];
      newGrid[currentAttempt][currentPosition] = letter;
      setGrid(newGrid);
      setCurrentPosition(currentPosition + 1);
    }
  };

  // Remove letter from grid
  const removeLetterFromGrid = () => {
    if (currentPosition > 0 && gameStatus === "playing") {
      setCurrentPosition(currentPosition - 1);
      const newGrid = [...grid];
      newGrid[currentAttempt][currentPosition - 1] = "";
      setGrid(newGrid);
    }
  };

  // Check if word is valid using dictionary API
  const isWordValid = async (word) => {
    try {
      const response = await fetch(
        `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`
      );
      return response.ok;
    } catch (error) {
      return false;
    }
  };

  // Check word letters against target word
  const checkWordLetters = (word) => {
    const letters = word.split("");
    const targetLetters = targetWord.split("");

    return letters.map((letter, index) => {
      if (letter.toLowerCase() === targetLetters[index].toLowerCase()) {
        return "correct";
      }
      if (targetLetters.includes(letter.toLowerCase())) {
        return "misplaced";
      }
      return "incorrect";
    });
  };

  // Submit guess
  const submitGuess = async () => {
    if (currentPosition < wordLength || gameStatus !== "playing") {
      return;
    }

    const currentWord = grid[currentAttempt].join("");

    // Check if the guess matches the target word
    if (currentWord.toLowerCase() === targetWord.toLowerCase()) {
      const results = checkWordLetters(currentWord);
      
      // Update cell states for the current row
      const newCellStates = [...cellStates];
      newCellStates[currentAttempt] = results;
      setCellStates(newCellStates);
      
      setGameStatus("won");
      return;
    }

    // Check if the word is valid
    const valid = await isWordValid(currentWord);
    if (!valid) {
      setShowInvalidWordMsg(true);
      setTimeout(() => setShowInvalidWordMsg(false), 2000);
      return;
    }

    const results = checkWordLetters(currentWord);
    
    // Update cell states for the current row
    const newCellStates = [...cellStates];
    newCellStates[currentAttempt] = results;
    setCellStates(newCellStates);

    if (currentAttempt >= attempts - 1) {
      setGameStatus("lost");
    } else {
      setCurrentAttempt(currentAttempt + 1);
      setCurrentPosition(0);
    }
  };

  // Handle keyboard input
  useEffect(() => {
    const handleKeyDown = (event) => {
      const key = event.key;
      
      if (isLetter(key)) {
        addLetterToGrid(key);
      } else if (key === "Backspace") {
        removeLetterFromGrid();
      } else if (key === "Enter") {
        submitGuess();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [grid, currentAttempt, currentPosition, gameStatus, wordLength]);

  // Reset the game
  const resetGame = async () => {
    setCurrentAttempt(0);
    setCurrentPosition(0);
    setGrid(Array(6).fill().map(() => Array(5).fill("")));
    setCellStates(Array(6).fill().map(() => Array(5).fill(null)));
    setGameStatus("playing");
    const word = await getRandomWord();
    setTargetWord(word);
  };

  // Toggle dark mode
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  // Render game board
  return (
    <div className={`wordle-game ${darkMode ? 'dark-mode' : 'light-mode'}`}>
      <div className="game-header">
        <button className="theme-toggle" onClick={toggleDarkMode}>
          {darkMode ? '☀️' : '🌙'}
        </button>
      </div>
      
      <div className="wordle-grid">
        {grid.map((row, rowIndex) => (
          <div key={`row-${rowIndex}`} className={`wordle-row ${rowIndex === currentAttempt && showInvalidWordMsg ? 'shake' : ''}`}>
            {row.map((cell, cellIndex) => (
              <div
                key={`cell-${rowIndex}-${cellIndex}`}
                className={`letter-cell ${cellStates[rowIndex]?.[cellIndex] || ""}`}
              >
                {cell}
              </div>
            ))}
          </div>
        ))}
      </div>
      
      {showInvalidWordMsg && (
        <div className="message invalid-word">Not in word list</div>
      )}
      
      {gameStatus === "won" && (
        <div className="message success">
          <p>You won!</p>
          <button className="reset-button" onClick={resetGame}>Play Again</button>
        </div>
      )}
      
      {gameStatus === "lost" && (
        <div className="message game-over">
          <p>Game Over! The word was: {targetWord}</p>
          <button className="reset-button" onClick={resetGame}>Play Again</button>
        </div>
      )}
    </div>
  );
};

export default WordleGame;