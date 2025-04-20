import React, { useEffect, useRef, useState } from 'react';
import './DinoGame.css';

// Import images directly
import dinoImageSrc from './img/dino.png';
import dinoDeadImageSrc from './img/dino-dead.png';
import cactus1ImageSrc from './img/cactus1.png';
import cactus2ImageSrc from './img/cactus2.png';
import cactus3ImageSrc from './img/cactus3.png';

const DinoGame = () => {
  const boardRef = useRef(null);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);

  const dinoWidth = 88;
  const dinoHeight = 94;
  const dinoX = 50;
  const dinoY = 250 - dinoHeight;

  const dino = useRef({ x: dinoX, y: dinoY, width: dinoWidth, height: dinoHeight });
  const velocityYRef = useRef(0);
  const gravity = 0.4;
  const velocityX = -6; // Consistent speed for cacti

  const cactusArrayRef = useRef([]);
  const animationIdRef = useRef(null);

  const dinoImg = useRef(new Image());
  const dinoDeadImg = useRef(new Image());
  const cactus1Img = useRef(new Image());
  const cactus2Img = useRef(new Image());
  const cactus3Img = useRef(new Image());

  useEffect(() => {
    const board = boardRef.current;
    board.width = 750;
    board.height = 250;
    const context = board.getContext("2d");

    // Load images with imports
    dinoImg.current.src = dinoImageSrc;
    dinoDeadImg.current.src = dinoDeadImageSrc;
    cactus1Img.current.src = cactus1ImageSrc;
    cactus2Img.current.src = cactus2ImageSrc;
    cactus3Img.current.src = cactus3ImageSrc;

    const updateGame = () => {
      if (gameOver) return;

      context.clearRect(0, 0, board.width, board.height);

      // Dino physics
      velocityYRef.current += gravity;
      dino.current.y = Math.min(dino.current.y + velocityYRef.current, dinoY);

      // Draw dino
      context.drawImage(dinoImg.current, dino.current.x, dino.current.y, dino.current.width, dino.current.height);

      // Update cacti positions
      cactusArrayRef.current.forEach((cactus, index) => {
        cactus.x += velocityX;
        context.drawImage(cactus.img, cactus.x, cactus.y, cactus.width, cactus.height);

        // Check collision
        if (detectCollision(dino.current, cactus)) {
          setGameOver(true);
          dinoImg.current = dinoDeadImg.current;
        }
      });

      // Remove cacti that are off screen
      cactusArrayRef.current = cactusArrayRef.current.filter(cactus => cactus.x + cactus.width > 0);

      // Score
      setScore(prev => prev + 1);

      animationIdRef.current = requestAnimationFrame(updateGame);
    };

    animationIdRef.current = requestAnimationFrame(updateGame);

    return () => cancelAnimationFrame(animationIdRef.current);
  }, [gameOver]);

  useEffect(() => {
    const handleJump = (e) => {
      if (gameOver) return;
      if ((e.code === "Space" || e.code === "ArrowUp") && dino.current.y === dinoY) {
        velocityYRef.current = -10;
      }
    };

    document.addEventListener("keydown", handleJump);
    return () => document.removeEventListener("keydown", handleJump);
  }, [gameOver]);

  // Cactus spawner
  useEffect(() => {
    if (gameOver) return;

    const spawnInterval = setInterval(() => {
      const newCactus = {
        img: null,
        x: 700,
        y: dinoY,
        width: 0,
        height: 70,
      };

      const chance = Math.random();
      if (chance > 0.9) {
        newCactus.img = cactus3Img.current;
        newCactus.width = 102;
      } else if (chance > 0.7) {
        newCactus.img = cactus2Img.current;
        newCactus.width = 69;
      } else {
        newCactus.img = cactus1Img.current;
        newCactus.width = 34;
      }

      cactusArrayRef.current.push(newCactus);
    }, 1200); // every 1.2 seconds

    return () => clearInterval(spawnInterval);
  }, [gameOver]);

  const detectCollision = (a, b) => {
    return (
      a.x < b.x + b.width &&
      a.x + a.width > b.x &&
      a.y < b.y + b.height &&
      a.y + a.height > b.y
    );
  };

  const restartGame = () => {
    setGameOver(false);
    setScore(0);
    cactusArrayRef.current = [];
    dino.current = { x: dinoX, y: dinoY, width: dinoWidth, height: dinoHeight };
    velocityYRef.current = 0;
    dinoImg.current.src = dinoImageSrc;
  };

  return (
    <div>
      <canvas ref={boardRef} id="board" />
      <div>Score: {score}</div>
      {gameOver && (
        <div className="game-over">
          <div>Game Over</div>
          <button onClick={restartGame}>Restart</button>
        </div>
      )}
    </div>
  );
};

export default DinoGame;