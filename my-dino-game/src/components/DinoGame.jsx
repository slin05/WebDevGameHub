import React, { useState, useEffect, useRef } from 'react';
import './DinoGame.css';

const DinoGame = () => {
  const [isJumping, setIsJumping] = useState(false);
  const [dinoPosition, setDinoPosition] = useState(0);
  const [obstacleLeft, setObstacleLeft] = useState(1000);
  const [isGameOver, setIsGameOver] = useState(false);
  const gameInterval = useRef(null);

  // Jump logic
  useEffect(() => {
    const handleJump = (e) => {
      if ((e.code === 'Space' || e.code === 'ArrowUp') && !isJumping) {
        setIsJumping(true);
        let upInterval = setInterval(() => {
          setDinoPosition((pos) => {
            if (pos >= 150) {
              clearInterval(upInterval);
              let downInterval = setInterval(() => {
                setDinoPosition((pos) => {
                  if (pos <= 0) {
                    clearInterval(downInterval);
                    setIsJumping(false);
                    return 0;
                  }
                  return pos - 5;
                });
              }, 20);
              return pos;
            }
            return pos + 5;
          });
        }, 20);
      }
    };

    document.addEventListener('keydown', handleJump);
    return () => document.removeEventListener('keydown', handleJump);
  }, [isJumping]);

  // Obstacle movement and collision detection
  useEffect(() => {
    if (!isGameOver) {
      gameInterval.current = setInterval(() => {
        setObstacleLeft((left) => {
          if (left < -20) return 1000; // reset obstacle position
          if (left < 90 && left > 50 && dinoPosition < 60) {
            setIsGameOver(true);
            clearInterval(gameInterval.current);
          }
          return left - 10;
        });
      }, 30);
    }
  }, [isGameOver, dinoPosition]);

  return (
    <div className="game">
      <div className="dino" style={{ bottom: `${dinoPosition}px` }}></div>
      <div className="obstacle" style={{ left: `${obstacleLeft}px` }}></div>
      {isGameOver && <div className="game-over">Game Over</div>}
    </div>
  );
};

export default DinoGame;