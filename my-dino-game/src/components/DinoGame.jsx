import React, { useEffect, useRef, useState } from 'react';

const DinoGame = () => {
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [imagesLoaded, setImagesLoaded] = useState(false);

  const boardRef = useRef(null);
  const contextRef = useRef(null);
  const velocityY = useRef(0);

  const dinoWidth = 88;
  const dinoHeight = 94;
  const dinoX = 50;
  const dinoY = 250 - dinoHeight;

  const [dino, setDino] = useState({
    x: dinoX,
    y: dinoY,
    width: dinoWidth,
    height: dinoHeight,
  });

  const [cactusArray, setCactusArray] = useState([]);

  // Images
  const dinoImg = useRef(new Image());
  const dinoDeadImg = useRef(new Image());
  const cactus1Img = useRef(new Image());
  const cactus2Img = useRef(new Image());
  const cactus3Img = useRef(new Image());

  // Preload images
  useEffect(() => {
    let loadedCount = 0;
    const totalImages = 5;

    const checkLoaded = () => {
      loadedCount++;
      if (loadedCount === totalImages) {
        setImagesLoaded(true);
      }
    };

    dinoImg.current.src = './img/dino.png';
    dinoImg.current.onload = checkLoaded;
    dinoImg.current.onerror = () => console.error("Failed to load dino.png");

    dinoDeadImg.current.src = './img/dino-dead.png';
    dinoDeadImg.current.onload = checkLoaded;
    dinoDeadImg.current.onerror = () => console.error("Failed to load dino-dead.png");

    cactus1Img.current.src = './img/cactus1.png';
    cactus1Img.current.onload = checkLoaded;
    cactus1Img.current.onerror = () => console.error("Failed to load cactus1.png");

    cactus2Img.current.src = './img/cactus2.png';
    cactus2Img.current.onload = checkLoaded;
    cactus2Img.current.onerror = () => console.error("Failed to load cactus2.png");

    cactus3Img.current.src = './img/cactus3.png';
    cactus3Img.current.onload = checkLoaded;
    cactus3Img.current.onerror = () => console.error("Failed to load cactus3.png");
  }, []);

  useEffect(() => {
    if (!imagesLoaded) return;

    const board = boardRef.current;
    board.height = 250;
    board.width = 750;
    contextRef.current = board.getContext('2d');

    let animationFrameId;

    const updateGame = () => {
      if (gameOver) return;

      const context = contextRef.current;
      context.clearRect(0, 0, board.width, board.height);

      velocityY.current += 0.4;
      setDino((prev) => {
        const newY = Math.min(prev.y + velocityY.current, dinoY);
        return { ...prev, y: newY };
      });

      context.drawImage(dinoImg.current, dino.x, dino.y, dino.width, dino.height);

      cactusArray.forEach((cactus) => {
        cactus.x -= 8;
        context.drawImage(cactus.img, cactus.x, cactus.y, cactus.width, cactus.height);

        if (detectCollision(dino, cactus)) {
          setGameOver(true);
          dinoImg.current = dinoDeadImg.current;
        }
      });

      setScore((prev) => prev + 1);
      animationFrameId = requestAnimationFrame(updateGame);
    };

    requestAnimationFrame(updateGame);

    return () => cancelAnimationFrame(animationFrameId);
  }, [imagesLoaded, gameOver, cactusArray, dino]);

  const moveDino = (e) => {
    if (gameOver) return;

    if ((e.code === 'Space' || e.code === 'ArrowUp') && dino.y === dinoY) {
      velocityY.current = -10;
    }
  };

  useEffect(() => {
    document.addEventListener('keydown', moveDino);
    return () => document.removeEventListener('keydown', moveDino);
  }, [dino.y, gameOver]);

  useEffect(() => {
    if (!imagesLoaded || gameOver) return;

    const interval = setInterval(() => {
      const cactus = {
        img: null,
        x: 750,
        y: dinoY,
        width: null,
        height: 70,
      };

      const chance = Math.random();
      if (chance > 0.9) {
        cactus.img = cactus3Img.current;
        cactus.width = 102;
      } else if (chance > 0.7) {
        cactus.img = cactus2Img.current;
        cactus.width = 69;
      } else {
        cactus.img = cactus1Img.current;
        cactus.width = 34;
      }

      setCactusArray((prev) => {
        const newArray = [...prev, cactus];
        return newArray.length > 5 ? newArray.slice(1) : newArray;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [imagesLoaded, gameOver]);

  const detectCollision = (a, b) => {
    return (
      a.x < b.x + b.width &&
      a.x + a.width > b.x &&
      a.y < b.y + b.height &&
      a.y + a.height > b.y
    );
  };

  return (
    <div>
      <canvas ref={boardRef} id="board"></canvas>
      <div style={{ marginTop: '10px' }}>Score: {score}</div>
      {gameOver && <div style={{ color: 'red' }}>Game Over</div>}
    </div>
  );
};

export default DinoGame;
