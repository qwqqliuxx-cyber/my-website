import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';

const GRID_SIZE = 20;
const TILE_SIZE = 24; // in pixels
const INITIAL_SNAKE = [{ x: 10, y: 10 }];
const INITIAL_FOOD = { x: 15, y: 15 };
const GAME_SPEED = 150; // ms

type Position = { x: number; y: number };
type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';

const useSnakeGame = () => {
  const [snake, setSnake] = useState<Position[]>(INITIAL_SNAKE);
  const [food, setFood] = useState<Position>(INITIAL_FOOD);
  const [direction, setDirection] = useState<Direction>('RIGHT');
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  const generateFood = useCallback(() => {
    let newFoodPosition: Position;
    do {
      newFoodPosition = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
    } while (snake.some(segment => segment.x === newFoodPosition.x && segment.y === newFoodPosition.y));
    setFood(newFoodPosition);
  }, [snake]);
  
  const resetGame = () => {
    setSnake(INITIAL_SNAKE);
    setFood(INITIAL_FOOD);
    setDirection('RIGHT');
    setScore(0);
    setGameOver(false);
    setIsPaused(false);
  };

  const moveSnake = useCallback(() => {
    if (gameOver || isPaused) return;

    setSnake(prevSnake => {
      const newSnake = [...prevSnake];
      const head = { ...newSnake[0] };

      switch (direction) {
        case 'UP': head.y -= 1; break;
        case 'DOWN': head.y += 1; break;
        case 'LEFT': head.x -= 1; break;
        case 'RIGHT': head.x += 1; break;
      }
      
      // Wall collision
      if (head.x < 0 || head.x >= GRID_SIZE || head.y < 0 || head.y >= GRID_SIZE) {
        setGameOver(true);
        return prevSnake;
      }

      // Self collision
      if (newSnake.some(segment => segment.x === head.x && segment.y === head.y)) {
        setGameOver(true);
        return prevSnake;
      }

      newSnake.unshift(head);

      // Food collision
      if (head.x === food.x && head.y === food.y) {
        setScore(s => s + 10);
        generateFood();
      } else {
        newSnake.pop();
      }
      
      return newSnake;
    });
  }, [direction, food.x, food.y, gameOver, isPaused, generateFood]);
  
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
        setDirection(prevDirection => {
            switch (e.key) {
                case 'ArrowUp':
                case 'w':
                    return prevDirection !== 'DOWN' ? 'UP' : prevDirection;
                case 'ArrowDown':
                case 's':
                    return prevDirection !== 'UP' ? 'DOWN' : prevDirection;
                case 'ArrowLeft':
                case 'a':
                    return prevDirection !== 'RIGHT' ? 'LEFT' : prevDirection;
                case 'ArrowRight':
                case 'd':
                    return prevDirection !== 'LEFT' ? 'RIGHT' : prevDirection;
                default:
                    return prevDirection;
            }
        });
        if(e.key === ' '){
             setIsPaused(p => !p);
        }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    const gameInterval = setInterval(moveSnake, GAME_SPEED);
    return () => clearInterval(gameInterval);
  }, [moveSnake]);

  return { snake, food, score, gameOver, isPaused, resetGame };
};


const SnakeGamePage: React.FC = () => {
    const { snake, food, score, gameOver, isPaused, resetGame } = useSnakeGame();

    return (
        <div className="flex flex-col items-center">
            <h1 className="text-5xl font-display text-secondary mb-4">赛博贪吃蛇</h1>
            <Link to="/" className="mb-4 text-secondary hover:underline">返回主页</Link>
            <div className="relative bg-surface p-4 rounded-lg shadow-lg border-2 border-primary" style={{ width: GRID_SIZE * TILE_SIZE, height: GRID_SIZE * TILE_SIZE }}>
                {gameOver && (
                    <div className="absolute inset-0 bg-black bg-opacity-70 flex flex-col items-center justify-center z-10 rounded-md">
                        <h2 className="text-5xl font-display text-red-500">游戏结束</h2>
                        <p className="text-white text-xl mt-2">最终得分: {score}</p>
                        <button onClick={resetGame} className="mt-6 bg-secondary hover:bg-teal-300 text-background font-bold py-2 px-6 rounded-lg">
                            再玩一次
                        </button>
                    </div>
                )}
                 {isPaused && !gameOver && (
                    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center z-10 rounded-md">
                        <h2 className="text-5xl font-display text-yellow-400">已暂停</h2>
                    </div>
                )}
                {/* Render Snake */}
                {snake.map((segment, index) => (
                    <div
                        key={index}
                        className={`absolute rounded-md ${index === 0 ? 'bg-secondary shadow-neon' : 'bg-green-500'}`}
                        style={{
                            left: segment.x * TILE_SIZE,
                            top: segment.y * TILE_SIZE,
                            width: TILE_SIZE,
                            height: TILE_SIZE,
                        }}
                    />
                ))}
                {/* Render Food */}
                <div
                    className="absolute rounded-full bg-red-500"
                    style={{
                        left: food.x * TILE_SIZE,
                        top: food.y * TILE_SIZE,
                        width: TILE_SIZE,
                        height: TILE_SIZE,
                    }}
                />
            </div>
            <div className="mt-6 text-2xl font-bold">得分: <span className="text-secondary font-display tracking-widest">{score}</span></div>
             <div className="mt-4 text-text-secondary">使用方向键或 WASD 移动。按空格键暂停。</div>
        </div>
    );
};

export default SnakeGamePage;