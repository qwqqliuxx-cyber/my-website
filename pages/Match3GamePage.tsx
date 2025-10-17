import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';

const BOARD_SIZE = 8;
const GEM_COLORS = ['#EF4444', '#3B82F6', '#22C55E', '#A855F7', '#EAB308', '#F97316'];

const generateBoard = (): string[][] => {
  const newBoard: string[][] = [];
  for (let r = 0; r < BOARD_SIZE; r++) {
    const row: string[] = [];
    for (let c = 0; c < BOARD_SIZE; c++) {
      row.push(GEM_COLORS[Math.floor(Math.random() * GEM_COLORS.length)]);
    }
    newBoard.push(row);
  }
  return newBoard;
};


const Match3GamePage: React.FC = () => {
    const [board, setBoard] = useState<string[][]>(generateBoard());
    const [selectedGem, setSelectedGem] = useState<{ r: number, c: number } | null>(null);
    const [score, setScore] = useState(0);
    const [moves, setMoves] = useState(30);
    const [gameOver, setGameOver] = useState(false);

    const checkForMatches = useCallback((currentBoard: string[][]): { newBoard: string[][], matchesMade: boolean, points: number } => {
        const newBoard = currentBoard.map(row => [...row]);
        let matchesMade = false;
        let points = 0;
        const matches = new Set<string>();

        // Check horizontal
        for (let r = 0; r < BOARD_SIZE; r++) {
            for (let c = 0; c < BOARD_SIZE - 2; c++) {
                if (newBoard[r][c] && newBoard[r][c] === newBoard[r][c + 1] && newBoard[r][c] === newBoard[r][c + 2]) {
                    matches.add(`${r}-${c}`);
                    matches.add(`${r}-${c+1}`);
                    matches.add(`${r}-${c+2}`);
                    matchesMade = true;
                }
            }
        }

        // Check vertical
        for (let c = 0; c < BOARD_SIZE; c++) {
            for (let r = 0; r < BOARD_SIZE - 2; r++) {
                if (newBoard[r][c] && newBoard[r][c] === newBoard[r + 1][c] && newBoard[r][c] === newBoard[r + 2][c]) {
                     matches.add(`${r}-${c}`);
                     matches.add(`${r+1}-${c}`);
                     matches.add(`${r+2}-${c}`);
                     matchesMade = true;
                }
            }
        }
        
        points = matches.size * 10;
        matches.forEach(match => {
            const [r, c] = match.split('-').map(Number);
            newBoard[r][c] = ''; // Mark for removal
        });

        return { newBoard, matchesMade, points };
    }, []);

    const dropAndRefill = useCallback((boardWithMatches: string[][]): string[][] => {
        const newBoard = boardWithMatches.map(row => [...row]);

        // Drop existing gems
        for (let c = 0; c < BOARD_SIZE; c++) {
            let writeRow = BOARD_SIZE - 1;
            for (let r = BOARD_SIZE - 1; r >= 0; r--) {
                if (newBoard[r][c] !== '') {
                    newBoard[writeRow][c] = newBoard[r][c];
                    if (writeRow !== r) {
                        newBoard[r][c] = '';
                    }
                    writeRow--;
                }
            }
        }

        // Refill empty spaces
        for (let r = 0; r < BOARD_SIZE; r++) {
            for (let c = 0; c < BOARD_SIZE; c++) {
                if (newBoard[r][c] === '') {
                    newBoard[r][c] = GEM_COLORS[Math.floor(Math.random() * GEM_COLORS.length)];
                }
            }
        }
        return newBoard;
    }, []);

    const processBoard = useCallback(async (currentBoard: string[][]) => {
        let boardToProcess = currentBoard.map(row => [...row]);
        let totalPoints = 0;

        while (true) {
            const result = checkForMatches(boardToProcess);
            if (!result.matchesMade) break;

            totalPoints += result.points;
            const boardAfterDrop = dropAndRefill(result.newBoard);

            boardToProcess = boardAfterDrop;
            setBoard(boardToProcess); // Update UI
            await new Promise(res => setTimeout(res, 300)); // Animation delay
        }

        if (totalPoints > 0) {
            setScore(prev => prev + totalPoints);
        }
        return boardToProcess;
    }, [checkForMatches, dropAndRefill]);
    
    useEffect(() => {
        const initialProcess = async () => {
            let newBoard = generateBoard();
            let processedBoard = await processBoard(newBoard);
            // Ensure no matches on initial board
            let checks = 0;
            while (checkForMatches(processedBoard).matchesMade && checks < 10) {
                 newBoard = generateBoard();
                 processedBoard = await processBoard(newBoard);
                 checks++;
            }
            setBoard(processedBoard);
        };
        initialProcess();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (moves <= 0) {
            setGameOver(true);
        }
    }, [moves]);

    const handleGemClick = async (r: number, c: number) => {
        if (gameOver) return;

        if (selectedGem) {
            // Check if it's an adjacent gem
            const isAdjacent = Math.abs(selectedGem.r - r) + Math.abs(selectedGem.c - c) === 1;

            if (isAdjacent) {
                const newBoard = board.map(row => [...row]);
                [newBoard[selectedGem.r][selectedGem.c], newBoard[r][c]] = [newBoard[r][c], newBoard[selectedGem.r][selectedGem.c]];

                // Check if the swap results in a match
                const { matchesMade } = checkForMatches(newBoard);

                if (matchesMade) {
                    setBoard(newBoard);
                    await processBoard(newBoard);
                    setMoves(m => m - 1);
                } else {
                    // Invalid move, swap back (optional visual feedback)
                }
            }
            setSelectedGem(null);
        } else {
            setSelectedGem({ r, c });
        }
    };
    
    const restartGame = () => {
        setScore(0);
        setMoves(30);
        setGameOver(false);
        setSelectedGem(null);
        
        const startNewGame = async () => {
            let processedBoard;
            let checks = 0;
            do {
                const newBoard = generateBoard();
                processedBoard = await processBoard(newBoard);
                checks++;
            } while (checkForMatches(processedBoard).matchesMade && checks < 10);
        };
        startNewGame();
    }

    return (
        <div className="flex flex-col items-center">
            <h1 className="text-5xl font-display text-secondary mb-4">宇宙宝石</h1>
             <Link to="/" className="mb-4 text-secondary hover:underline">返回主页</Link>
            <div className="flex w-full max-w-4xl justify-between items-start">
                {/* Game Board */}
                <div className="bg-surface p-4 rounded-lg shadow-lg border-2 border-primary">
                    <div className="grid gap-1" style={{ gridTemplateColumns: `repeat(${BOARD_SIZE}, 1fr)` }}>
                        {board.map((row, r) =>
                            row.map((gemColor, c) => (
                                <div
                                    key={`${r}-${c}`}
                                    onClick={() => handleGemClick(r, c)}
                                    className={`w-12 h-12 md:w-16 md:h-16 flex items-center justify-center rounded-md cursor-pointer transition-all duration-300 transform hover:scale-110 ${selectedGem && selectedGem.r === r && selectedGem.c === c ? 'ring-4 ring-secondary' : ''}`}
                                    style={{ backgroundColor: gemColor, boxShadow: `inset 0 0 10px rgba(0,0,0,0.5)` }}
                                >
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Game Info Panel */}
                <div className="w-64 bg-surface p-6 rounded-lg shadow-lg border-2 border-primary ml-8">
                    <h2 className="text-3xl font-display text-secondary mb-4">统计</h2>
                    <div className="text-xl mb-4">
                        <span className="font-bold text-text-secondary">分数:</span>
                        <span className="ml-2 font-bold text-white tracking-wider">{score}</span>
                    </div>
                    <div className="text-xl">
                        <span className="font-bold text-text-secondary">剩余步数:</span>
                        <span className="ml-2 font-bold text-white tracking-wider">{moves}</span>
                    </div>
                    {gameOver && (
                        <div className="mt-8 text-center animate-fade-in">
                            <h3 className="text-4xl font-display text-red-500 mb-4">游戏结束</h3>
                            <button onClick={restartGame} className="w-full bg-secondary hover:bg-teal-300 text-background font-bold py-3 px-4 rounded-lg transition-all duration-300 shadow-md hover:shadow-neon">
                                再玩一次
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Match3GamePage;