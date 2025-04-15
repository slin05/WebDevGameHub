import React, { useEffect, useRef, useState } from 'react';

const DinoGame = () => {
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);

  const boardRef = useRef(null); // Ref for the canvas element
  const [cactusArray, setCactusArray] = useState([]);
  
  const dinoWidth = 88;
  const dinoHeight = 94;
  const dinoX = 50;
  const dinoY = 250 - dinoHeight;

  const [dino, setDino] = useState({ x: dinoX, y: dinoY, width: dinoWidth, height: dinoHeight });

  // Reference to the canvas and context
  let context;

  useEffect(() => {
    const board = boardRef.current;
    board.height = 250;
    board.width = 750;
    context = board.getContext("2d");

    const dinoImg = new Image();
    dinoImg.src = "./img/dino.png";

    dinoImg.onload = function() {
      context.drawImage(dinoImg, dino.x, dino.y, dino.width, dino.height);
    }

    const cactus1Img = new Image();
    cactus1Img.src = "./img/cactus1.png";
    const cactus2Img = new Image();
    cactus2Img.src = "./img/cactus2.png";
    const cactus3Img = new Image();
    cactus3Img.src = "./img/cactus3.png";

    let velocityY = 0;
    const gravity = 0.4;
    const velocityX = -8;

    let gameInterval;
    const updateGame = () => {
      if (gameOver) return;

      context.clearRect(0, 0, board.width, board.height);

      // Dino Gravity
      velocityY += gravity;
      setDino(prevDino => ({ ...prevDino, y: Math.min(prevDino.y + velocityY, dinoY) }));

      context.drawImage(dinoImg, dino.x, dino.y, dino.width, dino.height);

      // Cactus Movement
      cactusArray.forEach(cactus => {
        cactus.x += velocityX;
        context.drawImage(cactus.img, cactus.x, cactus.y, cactus.width, cactus.height);

        if (detectCollision(dino, cactus)) {
          setGameOver(true);
          dinoImg.src = "./img/dino-dead.png";
          dinoImg.onload = () => context.drawImage(dinoImg, dino.x, dino.y, dino.width, dino.height);
        }
      });

      setScore(prevScore => prevScore + 1);

      gameInterval = requestAnimationFrame(updateGame);
    };

    requestAnimationFrame(updateGame);

    return () => {
      cancelAnimationFrame(gameInterval); // Cleanup when the component unmounts
    };
  }, [dino, cactusArray, gameOver]);

  // Jump logic
  const moveDino = (e) => {
    if (gameOver) return;

    if ((e.code === "Space" || e.code === "ArrowUp") && dino.y === dinoY) {
      velocityY = -10;
    }
  };

  useEffect(() => {
    document.addEventListener("keydown", moveDino);
    return () => {
      document.removeEventListener("keydown", moveDino);
    };
  }, [dino.y, gameOver]);

  // Cactus spawn logic
  useEffect(() => {
    if (gameOver) return;

    const placeCactus = () => {
      const cactus = {
        img: null,
        x: 700,
        y: dinoY,
        width: null,
        height: 70
      };

      let placeCactusChance = Math.random();

      if (placeCactusChance > 0.90) {
        cactus.img = cactus3Img;
        cactus.width = 102;
      } else if (placeCactusChance > 0.70) {
        cactus.img = cactus2Img;
        cactus.width = 69;
      } else {
        cactus.img = cactus1Img;
        cactus.width = 34;
      }

      setCactusArray(prevArray => [...prevArray, cactus]);

      // Limit cactus array size
      if (cactusArray.length > 5) {
        setCactusArray(prevArray => prevArray.slice(1));
      }
    };

    const cactusInterval = setInterval(placeCactus, 1000);

    return () => clearInterval(cactusInterval); // Cleanup interval
  }, [cactusArray, gameOver]);

  const detectCollision = (a, b) => {
    return a.x < b.x + b.width &&
           a.x + a.width > b.x &&
           a.y < b.y + b.height &&
           a.y + a.height > b.y;
  };

  return (
    <div>
      <canvas ref={boardRef} id="board"></canvas>
      <div>Score: {score}</div>
      {gameOver && <div>Game Over</div>}
    </div>
  );
};

export default DinoGame;
