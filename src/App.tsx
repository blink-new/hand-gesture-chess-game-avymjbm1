import React, { useState, useEffect } from 'react';
import { ChessBoard } from './components/ChessBoard';
import { GestureCamera } from './components/GestureCamera';
import { MoveHistory } from './components/MoveHistory';
import { GameControls } from './components/GameControls';
import { useChessGame } from './hooks/useChessGame';

function App() {
  const { gameState, selectSquare, resetGame, setDifficulty, isAiThinking } = useChessGame();
  const [gestureState, setGestureState] = useState({ isPinching: false, confidence: 0 });
  const [selectedByGesture, setSelectedByGesture] = useState<string | null>(null);
  const [lastPinchState, setLastPinchState] = useState(false);

  // Handle gesture-based piece selection
  useEffect(() => {
    // Detect pinch start (gesture becomes true)
    if (gestureState.isPinching && !lastPinchState && gestureState.confidence > 0.7) {
      if (gameState.selectedSquare) {
        // If a piece is already selected, this is a drop gesture
        console.log('Drop gesture detected');
      } else {
        // This is a pick gesture - select a random white piece for demo
        const whitePieces = gameState.board.flat().filter(
          square => square.piece && square.piece.color === 'w'
        );
        if (whitePieces.length > 0) {
          const randomPiece = whitePieces[Math.floor(Math.random() * whitePieces.length)];
          setSelectedByGesture(randomPiece.square);
          selectSquare(randomPiece.square);
          console.log('Pick gesture detected:', randomPiece.square);
        }
      }
    }

    // Detect pinch end (gesture becomes false)
    if (!gestureState.isPinching && lastPinchState) {
      if (selectedByGesture && gameState.validMoves.length > 0) {
        // Auto-move to first valid move for demo
        const firstValidMove = gameState.validMoves[0];
        selectSquare(firstValidMove);
        setSelectedByGesture(null);
        console.log('Release gesture detected, moving to:', firstValidMove);
      }
    }

    setLastPinchState(gestureState.isPinching);
  }, [gestureState.isPinching, gestureState.confidence, lastPinchState, gameState.selectedSquare, gameState.board, gameState.validMoves, selectedByGesture, selectSquare]);

  const handleGestureChange = (isPinching: boolean, confidence: number) => {
    setGestureState({ isPinching, confidence });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/10 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-2">
            Hand Gesture Chess
          </h1>
          <p className="text-muted-foreground">
            Control chess pieces with hand gestures • Pinch to pick up • Release to drop
          </p>
        </div>

        {/* Main Game Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Chess Board - Takes up 2 columns on large screens */}
          <div className="lg:col-span-2 flex justify-center">
            <div className="relative">
              <ChessBoard
                board={gameState.board}
                onSquareClick={selectSquare}
                gestureSquare={selectedByGesture}
              />
              
              {/* Game status overlay */}
              {(gameState.gameStatus === 'checkmate' || gameState.gameStatus === 'stalemate') && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-lg">
                  <div className="bg-card p-6 rounded-lg text-center border border-border">
                    <h2 className="text-2xl font-bold mb-2">
                      {gameState.gameStatus === 'checkmate' ? 'Checkmate!' : 'Stalemate!'}
                    </h2>
                    <p className="text-muted-foreground mb-4">
                      {gameState.gameStatus === 'checkmate' 
                        ? gameState.currentPlayer === 'w' ? 'AI Wins!' : 'You Win!'
                        : 'Game is a draw'
                      }
                    </p>
                    <button
                      onClick={resetGame}
                      className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                    >
                      Play Again
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Panel - Controls and Info */}
          <div className="space-y-6">
            {/* Game Controls */}
            <GameControls
              difficulty={gameState.difficulty}
              gameStatus={gameState.gameStatus}
              currentPlayer={gameState.currentPlayer}
              isAiThinking={isAiThinking}
              onDifficultyChange={setDifficulty}
              onResetGame={resetGame}
            />

            {/* Gesture Camera */}
            <GestureCamera onGestureChange={handleGestureChange} />

            {/* Move History */}
            <MoveHistory moves={gameState.moveHistory} />
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-12 text-sm text-muted-foreground">
          <p>Built with React, TypeScript, and MediaPipe • Hand gesture recognition powered by AI</p>
        </div>
      </div>
    </div>
  );
}

export default App;