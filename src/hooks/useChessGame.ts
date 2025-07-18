import { useState, useCallback, useEffect } from 'react';
import { Chess } from 'chess.js';
import { GameState, ChessSquare, PieceColor } from '../types/chess';

export const useChessGame = () => {
  const [chess] = useState(() => new Chess());
  const [gameState, setGameState] = useState<GameState>({
    board: [],
    currentPlayer: 'w',
    selectedSquare: null,
    validMoves: [],
    gameStatus: 'playing',
    moveHistory: [],
    difficulty: 'medium'
  });

  const [isAiThinking, setIsAiThinking] = useState(false);

  // Convert chess.js board to our format
  const updateBoard = useCallback(() => {
    const board: ChessSquare[][] = [];
    
    for (let rank = 7; rank >= 0; rank--) {
      const row: ChessSquare[] = [];
      for (let file = 0; file < 8; file++) {
        const square = String.fromCharCode(97 + file) + (rank + 1);
        const piece = chess.get(square as any);
        
        row.push({
          piece: piece ? { type: piece.type, color: piece.color } : null,
          square,
          isSelected: gameState.selectedSquare === square,
          isValidMove: gameState.validMoves.includes(square),
          isValidCapture: gameState.validMoves.includes(square) && piece !== null
        });
      }
      board.push(row);
    }
    
    return board;
  }, [chess, gameState.selectedSquare, gameState.validMoves]);

  // Get valid moves for a square
  const getValidMoves = useCallback((square: string): string[] => {
    const moves = chess.moves({ square: square as any, verbose: true });
    return moves.map(move => move.to);
  }, [chess]);

  // Make a move
  const makeMove = useCallback((from: string, to: string): boolean => {
    try {
      const move = chess.move({ from: from as any, to: to as any });
      if (move) {
        setGameState(prev => ({
          ...prev,
          currentPlayer: chess.turn(),
          selectedSquare: null,
          validMoves: [],
          gameStatus: chess.isCheckmate() ? 'checkmate' : 
                     chess.isCheck() ? 'check' :
                     chess.isStalemate() ? 'stalemate' :
                     chess.isDraw() ? 'draw' : 'playing',
          moveHistory: [...prev.moveHistory, move.san]
        }));
        return true;
      }
    } catch (error) {
      console.error('Invalid move:', error);
    }
    return false;
  }, [chess]);

  // Simple position evaluation for hard difficulty
  const evaluatePosition = useCallback((): number => {
    const pieceValues = { p: 1, n: 3, b: 3, r: 5, q: 9, k: 0 };
    let score = 0;
    
    const board = chess.board();
    for (let i = 0; i < 8; i++) {
      for (let j = 0; j < 8; j++) {
        const piece = board[i][j];
        if (piece) {
          const value = pieceValues[piece.type];
          score += piece.color === 'b' ? value : -value;
        }
      }
    }
    
    return score;
  }, [chess]);

  // AI move calculation
  const makeAiMove = useCallback(async () => {
    if (chess.turn() !== 'b' || chess.isGameOver()) return;

    setIsAiThinking(true);
    
    // Simulate thinking time based on difficulty
    const thinkingTime = gameState.difficulty === 'easy' ? 500 : 
                        gameState.difficulty === 'medium' ? 1000 : 1500;
    
    await new Promise(resolve => setTimeout(resolve, thinkingTime));

    const moves = chess.moves();
    if (moves.length === 0) {
      setIsAiThinking(false);
      return;
    }

    let selectedMove: string;

    switch (gameState.difficulty) {
      case 'easy':
        // Random move
        selectedMove = moves[Math.floor(Math.random() * moves.length)];
        break;
      
      case 'medium': {
        // Slightly better: prefer captures and checks
        const captures = moves.filter(move => move.includes('x'));
        const checks = moves.filter(move => move.includes('+'));
        
        if (captures.length > 0 && Math.random() > 0.3) {
          selectedMove = captures[Math.floor(Math.random() * captures.length)];
        } else if (checks.length > 0 && Math.random() > 0.5) {
          selectedMove = checks[Math.floor(Math.random() * checks.length)];
        } else {
          selectedMove = moves[Math.floor(Math.random() * moves.length)];
        }
        break;
      }
      
      case 'hard': {
        // Basic minimax-like evaluation
        let bestMove = moves[0];
        let bestScore = -Infinity;
        
        for (const move of moves.slice(0, Math.min(moves.length, 10))) {
          chess.move(move);
          const score = evaluatePosition();
          chess.undo();
          
          if (score > bestScore) {
            bestScore = score;
            bestMove = move;
          }
        }
        selectedMove = bestMove;
        break;
      }
      
      default:
        selectedMove = moves[Math.floor(Math.random() * moves.length)];
    }

    chess.move(selectedMove);
    setGameState(prev => ({
      ...prev,
      currentPlayer: chess.turn(),
      gameStatus: chess.isCheckmate() ? 'checkmate' : 
                 chess.isCheck() ? 'check' :
                 chess.isStalemate() ? 'stalemate' :
                 chess.isDraw() ? 'draw' : 'playing',
      moveHistory: [...prev.moveHistory, selectedMove]
    }));
    
    setIsAiThinking(false);
  }, [chess, evaluatePosition, gameState.difficulty]);

  // Select a square
  const selectSquare = useCallback((square: string) => {
    if (chess.turn() !== 'w') return; // Only allow human moves

    if (gameState.selectedSquare === square) {
      // Deselect
      setGameState(prev => ({
        ...prev,
        selectedSquare: null,
        validMoves: []
      }));
    } else if (gameState.selectedSquare && gameState.validMoves.includes(square)) {
      // Make move
      if (makeMove(gameState.selectedSquare, square)) {
        // AI will move after human move
        setTimeout(makeAiMove, 500);
      }
    } else {
      // Select new square
      const piece = chess.get(square as any);
      if (piece && piece.color === 'w') {
        const validMoves = getValidMoves(square);
        setGameState(prev => ({
          ...prev,
          selectedSquare: square,
          validMoves
        }));
      }
    }
  }, [chess, gameState.selectedSquare, gameState.validMoves, makeMove, getValidMoves, makeAiMove]);

  // Reset game
  const resetGame = useCallback(() => {
    chess.reset();
    setGameState(prev => ({
      ...prev,
      currentPlayer: 'w',
      selectedSquare: null,
      validMoves: [],
      gameStatus: 'playing',
      moveHistory: []
    }));
    setIsAiThinking(false);
  }, [chess]);

  // Set difficulty
  const setDifficulty = useCallback((difficulty: 'easy' | 'medium' | 'hard') => {
    setGameState(prev => ({ ...prev, difficulty }));
  }, []);

  // Update board when game state changes
  useEffect(() => {
    setGameState(prev => ({ ...prev, board: updateBoard() }));
  }, [updateBoard]);

  return {
    gameState: { ...gameState, board: updateBoard() },
    selectSquare,
    resetGame,
    setDifficulty,
    isAiThinking
  };
};